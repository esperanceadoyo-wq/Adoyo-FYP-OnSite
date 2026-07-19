from datetime import datetime

from flask import Blueprint, g, jsonify, request

from ..auth import login_required
from ..extensions import db
from ..models import Reflection, Space, Visit
from ..services.progress_service import award_eligible_achievements

feedback_bp = Blueprint("feedback", __name__, url_prefix="/api")


def _parse_datetime(value: str | None):
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


@feedback_bp.post("/visits")
@login_required
def create_visit():
    payload = request.get_json(silent=True) or {}
    space = db.session.get(Space, payload.get("space_id"))
    if space is None or not space.is_active:
        return jsonify({"error": "A valid active space_id is required."}), 400

    visited_at = _parse_datetime(payload.get("visited_at"))
    if payload.get("visited_at") and visited_at is None:
        return jsonify({"error": "visited_at must be an ISO 8601 date-time."}), 400

    visit = Visit(
        user_id=g.current_user.id,
        space_id=space.id,
        verification_method=payload.get("verification_method", "manual"),
    )
    if visited_at:
        visit.visited_at = visited_at
    db.session.add(visit)
    db.session.commit()
    award_eligible_achievements(g.current_user.id)
    return jsonify({"visit": visit.to_dict()}), 201


@feedback_bp.post("/reflections")
@login_required
def create_reflection():
    payload = request.get_json(silent=True) or {}
    space = db.session.get(Space, payload.get("space_id"))
    if space is None:
        return jsonify({"error": "A valid space_id is required."}), 400

    comfort_rating = payload.get("comfort_rating")
    ratings = [
        comfort_rating,
        payload.get("social_rating"),
        payload.get("learning_value_rating"),
    ]
    if comfort_rating is None or any(
        rating is not None and (not isinstance(rating, int) or not 1 <= rating <= 5)
        for rating in ratings
    ):
        return jsonify({"error": "Ratings must be whole numbers from 1 to 5."}), 400

    visit_id = payload.get("visit_id")
    if visit_id:
        visit = db.session.get(Visit, visit_id)
        if visit is None or visit.user_id != g.current_user.id:
            return jsonify({"error": "Visit not found."}), 404

    reflection = Reflection(
        user_id=g.current_user.id,
        space_id=space.id,
        visit_id=visit_id,
        comfort_rating=comfort_rating,
        social_rating=payload.get("social_rating"),
        learning_value_rating=payload.get("learning_value_rating"),
        mood_before=payload.get("mood_before"),
        mood_after=payload.get("mood_after"),
        reflection_text=payload.get("reflection_text"),
        would_return=payload.get("would_return"),
    )
    db.session.add(reflection)
    db.session.commit()
    award_eligible_achievements(g.current_user.id)
    return jsonify({"reflection": reflection.to_dict()}), 201
