import re

from flask import Blueprint, jsonify, request

from ..auth import admin_required
from ..extensions import db
from ..models import Space

spaces_bp = Blueprint("spaces", __name__, url_prefix="/api/spaces")

REQUIRED_STRING_FIELDS = ("name", "description", "category", "address")
OPTIONAL_STRING_FIELDS = (
    "safety_notes",
    "cultural_notes",
    "image_url",
    "image_alt",
)
LIST_FIELDS = (
    "amenities",
    "atmosphere_tags",
    "accessibility_features",
)


def _slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")


def _available_slug(value: str, current_space_id: int | None = None) -> str:
    base_slug = _slugify(value) or "space"
    slug = base_slug
    suffix = 2

    while True:
        existing = db.session.scalar(db.select(Space).where(Space.slug == slug))
        if existing is None or existing.id == current_space_id:
            return slug
        slug = f"{base_slug}-{suffix}"
        suffix += 1


def _validated_updates(payload: dict, creating: bool = False):
    updates = {}
    for field in REQUIRED_STRING_FIELDS:
        if creating and field not in payload:
            return None, f"Missing required fields: {field}."
        if field in payload:
            value = payload[field]
            if not isinstance(value, str) or not value.strip():
                return None, f"{field} must be a non-empty string."
            updates[field] = value.strip().lower() if field == "category" else value.strip()

    for field in OPTIONAL_STRING_FIELDS:
        if field not in payload:
            continue
        value = payload[field]
        if value is not None and not isinstance(value, str):
            return None, f"{field} must be a string or null."
        updates[field] = value.strip() if isinstance(value, str) and value.strip() else None

    if "noise_level" in payload:
        value = payload["noise_level"]
        if value not in ("silent", "hum", "moderate", "lively"):
            return None, "noise_level must be silent, hum, moderate, or lively."
        updates["noise_level"] = value

    for field in LIST_FIELDS:
        if field not in payload:
            continue
        value = payload[field]
        if not isinstance(value, list) or any(not isinstance(item, str) for item in value):
            return None, f"{field} must be a list of strings."
        updates[field] = list(dict.fromkeys(item.strip() for item in value if item.strip()))

    for field, minimum, maximum in (
        ("social_intensity", 1, 3),
        ("cost_level", 1, 3),
    ):
        if field in payload:
            value = payload[field]
            if isinstance(value, bool) or not isinstance(value, int) or not minimum <= value <= maximum:
                return None, f"{field} must be a whole number from {minimum} to {maximum}."
            updates[field] = value

    for field, minimum, maximum in (
        ("latitude", -90, 90),
        ("longitude", -180, 180),
        ("rating", 0, 5),
    ):
        if field in payload:
            value = payload[field]
            if value is not None and (
                isinstance(value, bool)
                or not isinstance(value, (int, float))
                or not minimum <= value <= maximum
            ):
                return None, f"{field} must be a number from {minimum} to {maximum} or null."
            updates[field] = value

    if "opening_hours" in payload:
        value = payload["opening_hours"]
        if not isinstance(value, dict) or any(
            not isinstance(key, str) or not isinstance(hours, str)
            for key, hours in value.items()
        ):
            return None, "opening_hours must be an object of text values."
        updates["opening_hours"] = value

    if "is_active" in payload:
        if not isinstance(payload["is_active"], bool):
            return None, "is_active must be a boolean."
        updates["is_active"] = payload["is_active"]

    return updates, None


@spaces_bp.get("")
def list_spaces():
    category = request.args.get("category")
    social_intensity = request.args.get("social_intensity")
    statement = db.select(Space).where(Space.is_active.is_(True))
    if category:
        statement = statement.where(Space.category == category.strip().lower())
    if social_intensity:
        try:
            intensity = int(social_intensity)
        except ValueError:
            return jsonify({"error": "social_intensity must be 1, 2, or 3."}), 400
        if intensity not in (1, 2, 3):
            return jsonify({"error": "social_intensity must be 1, 2, or 3."}), 400
        statement = statement.where(Space.social_intensity == intensity)
    spaces = db.session.scalars(statement.order_by(Space.name)).all()
    return jsonify({"spaces": [space.to_dict() for space in spaces]})


@spaces_bp.get("/<space_identifier>")
def get_space(space_identifier: str):
    if space_identifier.isdigit():
        space = db.session.get(Space, int(space_identifier))
    else:
        space = db.session.scalar(
            db.select(Space).where(Space.slug == space_identifier)
        )
    if space is None or not space.is_active:
        return jsonify({"error": "Space not found."}), 404
    return jsonify({"space": space.to_dict()})


@spaces_bp.post("")
@admin_required
def create_space():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Request body must be a JSON object."}), 400
    updates, error = _validated_updates(payload, creating=True)
    if error:
        return jsonify({"error": error}), 400

    requested_slug = payload.get("slug")
    if requested_slug is not None and (
        not isinstance(requested_slug, str) or not requested_slug.strip()
    ):
        return jsonify({"error": "slug must be a non-empty string."}), 400
    requested_slug = requested_slug or payload["name"]
    space = Space(slug=_available_slug(requested_slug))
    for field, value in updates.items():
        setattr(space, field, value)
    db.session.add(space)
    db.session.commit()
    return jsonify({"space": space.to_dict()}), 201


@spaces_bp.patch("/<int:space_id>")
@admin_required
def update_space(space_id: int):
    space = db.session.get(Space, space_id)
    if space is None:
        return jsonify({"error": "Space not found."}), 404
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Request body must be a JSON object."}), 400
    updates, error = _validated_updates(payload)
    if error:
        return jsonify({"error": error}), 400
    if "slug" in payload:
        if not isinstance(payload["slug"], str) or not payload["slug"].strip():
            return jsonify({"error": "slug must be a non-empty string."}), 400
        space.slug = _available_slug(payload["slug"], space.id)
    for field, value in updates.items():
        setattr(space, field, value)
    db.session.commit()
    return jsonify({"space": space.to_dict()})


@spaces_bp.delete("/<int:space_id>")
@admin_required
def deactivate_space(space_id: int):
    space = db.session.get(Space, space_id)
    if space is None:
        return jsonify({"error": "Space not found."}), 404
    space.is_active = False
    db.session.commit()
    return jsonify({"space": space.to_dict()})
