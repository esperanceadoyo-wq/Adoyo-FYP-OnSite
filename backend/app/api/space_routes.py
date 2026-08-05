import re

from flask import Blueprint, jsonify, request

from ..auth import admin_required
from ..extensions import db
from ..models import Space

spaces_bp = Blueprint("spaces", __name__, url_prefix="/api/spaces")

SPACE_FIELDS = {
    "name",
    "description",
    "category",
    "address",
    "latitude",
    "longitude",
    "amenities",
    "atmosphere_tags",
    "social_intensity",
    "noise_level",
    "cost_level",
    "opening_hours",
    "safety_notes",
    "cultural_notes",
    "accessibility_features",
    "image_url",
    "image_alt",
    "rating",
    "is_active",
}


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
    payload = request.get_json(silent=True) or {}
    missing = [
        field
        for field in ("name", "description", "category", "address")
        if not payload.get(field)
    ]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}."}), 400

    requested_slug = str(payload.get("slug") or payload["name"])
    space = Space(slug=_available_slug(requested_slug))
    for field in SPACE_FIELDS:
        if field in payload:
            setattr(space, field, payload[field])
    db.session.add(space)
    db.session.commit()
    return jsonify({"space": space.to_dict()}), 201


@spaces_bp.patch("/<int:space_id>")
@admin_required
def update_space(space_id: int):
    space = db.session.get(Space, space_id)
    if space is None:
        return jsonify({"error": "Space not found."}), 404
    payload = request.get_json(silent=True) or {}
    if "slug" in payload:
        space.slug = _available_slug(str(payload["slug"]), space.id)
    for field in SPACE_FIELDS:
        if field in payload:
            setattr(space, field, payload[field])
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
