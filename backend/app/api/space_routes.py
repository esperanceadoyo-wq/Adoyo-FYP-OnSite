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
    "is_active",
}


@spaces_bp.get("")
def list_spaces():
    category = request.args.get("category")
    statement = db.select(Space).where(Space.is_active.is_(True))
    if category:
        statement = statement.where(Space.category == category)
    spaces = db.session.scalars(statement.order_by(Space.name)).all()
    return jsonify({"spaces": [space.to_dict() for space in spaces]})


@spaces_bp.get("/<int:space_id>")
def get_space(space_id: int):
    space = db.session.get(Space, space_id)
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

    space = Space()
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
