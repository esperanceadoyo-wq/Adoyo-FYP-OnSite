from flask import Blueprint, g, jsonify, request

from ..auth import login_required
from ..extensions import db
from ..models import Recommendation, Space, UserProfile
from ..services.recommendation_service import rank_spaces

recommendations_bp = Blueprint(
    "recommendations", __name__, url_prefix="/api/recommendations"
)


@recommendations_bp.post("")
@login_required
def recommendations():
    payload = request.get_json(silent=True) or {}
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
    try:
        limit = min(max(int(payload.get("limit", 5)), 1), 20)
    except (TypeError, ValueError):
        return jsonify({"error": "limit must be a whole number."}), 400
    ranked = rank_spaces(profile, spaces, payload)[:limit]
    response_items = []

    for item in ranked:
        record = Recommendation(
            user_id=g.current_user.id,
            space_id=item.space.id,
            score=item.score,
            reason=item.reason,
            input_context={
                key: payload[key]
                for key in ("mood", "latitude", "longitude")
                if key in payload
            },
        )
        db.session.add(record)
        response_items.append(
            {
                "space": item.space.to_dict(),
                "score": item.score,
                "reason": item.reason,
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
