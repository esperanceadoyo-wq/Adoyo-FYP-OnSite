from flask import Blueprint, g, jsonify, request

from ..auth import login_required
from ..extensions import db
from ..models import SavedSpace, Space


saved_spaces_bp = Blueprint(
    "saved_spaces", __name__, url_prefix="/api/saved-spaces"
)


@saved_spaces_bp.get("")
@login_required
def list_saved_spaces():
    rows = db.session.execute(
        db.select(SavedSpace, Space)
        .join(Space, Space.id == SavedSpace.space_id)
        .where(
            SavedSpace.user_id == g.current_user.id,
            Space.is_active.is_(True),
        )
        .order_by(SavedSpace.created_at.desc(), SavedSpace.id.desc())
    ).all()
    return jsonify(
        {"saved_spaces": [saved.to_dict(space) for saved, space in rows]}
    )


@saved_spaces_bp.post("")
@login_required
def save_space():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "A JSON object is required."}), 400

    space_id = payload.get("space_id")
    if isinstance(space_id, bool) or not isinstance(space_id, int):
        return jsonify({"error": "space_id must be an integer."}), 400

    space = db.session.get(Space, space_id)
    if space is None or not space.is_active:
        return jsonify({"error": "Space not found."}), 404

    saved = db.session.scalar(
        db.select(SavedSpace).where(
            SavedSpace.user_id == g.current_user.id,
            SavedSpace.space_id == space.id,
        )
    )
    if saved is not None:
        return jsonify({"saved_space": saved.to_dict(space)})

    saved = SavedSpace(user_id=g.current_user.id, space_id=space.id)
    db.session.add(saved)
    db.session.commit()
    return jsonify({"saved_space": saved.to_dict(space)}), 201


@saved_spaces_bp.delete("/<int:space_id>")
@login_required
def remove_saved_space(space_id: int):
    saved = db.session.scalar(
        db.select(SavedSpace).where(
            SavedSpace.user_id == g.current_user.id,
            SavedSpace.space_id == space_id,
        )
    )
    if saved is None:
        return jsonify({"error": "Saved space not found."}), 404

    db.session.delete(saved)
    db.session.commit()
    return jsonify({"message": "Space removed from saved spaces."})
