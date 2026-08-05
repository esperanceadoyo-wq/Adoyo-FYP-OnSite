from flask import Blueprint, g, jsonify, request

from ..auth import login_required
from ..extensions import db
from ..models import Recommendation, Reflection, Space, UserProfile, Visit
from ..services.recommendation_service import RecommendationFeedback, rank_spaces

recommendations_bp = Blueprint(
    "recommendations", __name__, url_prefix="/api/recommendations"
)


@recommendations_bp.post("")
@login_required
def recommendations():
    payload = request.get_json(silent=True)
    if payload is None:
        payload = {}
    if not isinstance(payload, dict):
        return jsonify({"error": "Request body must be a JSON object."}), 400

    mood = payload.get("mood")
    if mood is not None and mood not in {"focused", "social", "overwhelmed"}:
        return jsonify(
            {"error": "mood must be one of: focused, overwhelmed, social."}
        ), 400

    location_consent = payload.get("location_consent", False)
    if not isinstance(location_consent, bool):
        return jsonify({"error": "location_consent must be a boolean."}), 400

    has_latitude = "latitude" in payload
    has_longitude = "longitude" in payload
    if has_latitude != has_longitude:
        return jsonify(
            {"error": "latitude and longitude must be provided together."}
        ), 400
    if location_consent and not has_latitude:
        return jsonify(
            {"error": "Location coordinates are required when consent is granted."}
        ), 400
    if has_latitude:
        if not location_consent:
            return jsonify(
                {"error": "Explicit location consent is required."}
            ), 400
        latitude = payload["latitude"]
        longitude = payload["longitude"]
        if (
            isinstance(latitude, bool)
            or isinstance(longitude, bool)
            or not isinstance(latitude, (int, float))
            or not isinstance(longitude, (int, float))
        ):
            return jsonify({"error": "Location coordinates must be numbers."}), 400
        if not -90 <= latitude <= 90 or not -180 <= longitude <= 180:
            return jsonify({"error": "Location coordinates are out of range."}), 400

    profile = db.session.scalar(
        db.select(UserProfile).where(UserProfile.user_id == g.current_user.id)
    )
    if profile is None:
        return jsonify(
            {"error": "Complete your profile before requesting recommendations."}
        ), 409

    spaces = db.session.scalars(
        db.select(Space).where(Space.is_active.is_(True))
    ).all()
    raw_limit = payload.get("limit", 5)
    if isinstance(raw_limit, bool):
        return jsonify({"error": "limit must be a whole number."}), 400
    try:
        limit = min(max(int(raw_limit), 1), 20)
    except (TypeError, ValueError):
        return jsonify({"error": "limit must be a whole number."}), 400
    feedback = _recommendation_feedback(g.current_user.id)
    ranked = rank_spaces(profile, spaces, payload, feedback)[:limit]
    response_items = []

    for item in ranked:
        record = Recommendation(
            user_id=g.current_user.id,
            space_id=item.space.id,
            score=item.score,
            reason=item.reason,
            input_context={
                **({"mood": mood} if mood is not None else {}),
                **({"location_used": True} if has_latitude else {}),
                **(
                    {
                        "adaptive_feedback_used": True,
                        "visited_space_count": len(feedback.visited_space_ids),
                    }
                    if feedback.reflection_count or feedback.visited_space_ids
                    else {}
                ),
            },
        )
        db.session.add(record)
        response_items.append(
            {
                "space": item.space.to_dict(),
                "score": item.score,
                "reason": item.reason,
                "distance_km": item.distance_km,
            }
        )

    db.session.commit()
    return jsonify({"recommendations": response_items})


@recommendations_bp.get("/history")
@login_required
def recommendation_history():
    records = db.session.scalars(
        db.select(Recommendation)
        .where(Recommendation.user_id == g.current_user.id)
        .order_by(Recommendation.created_at.desc())
        .limit(50)
    ).all()
    return jsonify({"recommendations": [record.to_dict() for record in records]})


def _recommendation_feedback(user_id: int) -> RecommendationFeedback:
    visited_space_ids = set(
        db.session.scalars(
            db.select(Visit.space_id).where(Visit.user_id == user_id)
        ).all()
    )
    rows = db.session.execute(
        db.select(Reflection, Space)
        .join(Space, Space.id == Reflection.space_id)
        .where(Reflection.user_id == user_id)
        .order_by(Reflection.created_at.desc())
    ).all()
    category_values: dict[str, list[float]] = {}
    noise_values: dict[str, list[float]] = {}
    social_values: list[float] = []
    return_preferences: dict[int, bool] = {}

    for reflection, space in rows:
        learning_rating = reflection.learning_value_rating or reflection.comfort_rating
        preference_rating = (reflection.comfort_rating + learning_rating) / 2
        affinity = ((preference_rating - 3) / 2) * 8
        category_values.setdefault(space.category, []).append(affinity)
        noise_values.setdefault(space.noise_level, []).append(affinity / 2)
        if reflection.social_rating is not None:
            social_values.append(1 + (reflection.social_rating - 1) / 2)
        if reflection.would_return is not None:
            return_preferences.setdefault(space.id, reflection.would_return)

    return RecommendationFeedback(
        category_affinity={
            key: sum(values) / len(values) for key, values in category_values.items()
        },
        noise_affinity={
            key: sum(values) / len(values) for key, values in noise_values.items()
        },
        preferred_social_rating=(
            sum(social_values) / len(social_values) if social_values else None
        ),
        reflection_count=len(rows),
        return_preferences=return_preferences,
        visited_space_ids=visited_space_ids,
    )
