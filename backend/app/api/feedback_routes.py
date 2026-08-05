from datetime import timedelta

from flask import Blueprint, current_app, g, jsonify, request

from ..auth import login_required
from ..extensions import db
from ..models import Reflection, Space, Visit, utc_now
from ..services.location_service import distance_meters
from ..services.progress_service import award_eligible_achievements

feedback_bp = Blueprint("feedback", __name__, url_prefix="/api")


@feedback_bp.post("/visits")
@login_required
def create_visit():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Request body must be a JSON object."}), 400

    space_id = payload.get("space_id")
    if isinstance(space_id, bool) or not isinstance(space_id, int):
        return jsonify({"error": "A valid active space_id is required."}), 400
    space = db.session.get(Space, space_id)
    if space is None or not space.is_active:
        return jsonify({"error": "A valid active space_id is required."}), 400
    if space.latitude is None or space.longitude is None:
        return jsonify({"error": "This space cannot be verified by location."}), 409

    if payload.get("location_consent") is not True:
        return jsonify({"error": "Explicit location consent is required."}), 400

    latitude = payload.get("latitude")
    longitude = payload.get("longitude")
    accuracy = payload.get("accuracy_meters")
    values = (latitude, longitude, accuracy)
    if any(isinstance(value, bool) or not isinstance(value, (int, float)) for value in values):
        return jsonify(
            {"error": "latitude, longitude, and accuracy_meters must be numbers."}
        ), 400
    if not -90 <= latitude <= 90 or not -180 <= longitude <= 180:
        return jsonify({"error": "Location coordinates are out of range."}), 400
    if accuracy < 0:
        return jsonify({"error": "accuracy_meters cannot be negative."}), 400

    maximum_accuracy = current_app.config["MAX_VISIT_ACCURACY_METERS"]
    if accuracy > maximum_accuracy:
        return jsonify(
            {
                "error": "The location reading is not accurate enough to verify this visit.",
                "maximum_accuracy_meters": maximum_accuracy,
            }
        ), 422

    distance = distance_meters(
        latitude,
        longitude,
        space.latitude,
        space.longitude,
    )
    verification_radius = current_app.config["VISIT_VERIFICATION_RADIUS_METERS"]
    distance_requirement_waived = (
        space.slug in current_app.config["CHECK_IN_DISTANCE_EXEMPT_SLUGS"]
    )
    verification = {
        "accuracy_meters": round(accuracy, 1),
        "allowed_distance_meters": verification_radius,
        "distance_meters": round(distance, 1),
        "distance_requirement_waived": distance_requirement_waived,
    }
    if distance > verification_radius and not distance_requirement_waived:
        return jsonify(
            {
                "error": "You are not close enough to this space to check in.",
                "verification": verification,
            }
        ), 422

    duplicate_cutoff = utc_now() - timedelta(
        hours=current_app.config["VISIT_DUPLICATE_WINDOW_HOURS"]
    )
    existing_visit = db.session.scalar(
        db.select(Visit)
        .where(
            Visit.user_id == g.current_user.id,
            Visit.space_id == space.id,
            Visit.verification_method == "location",
            Visit.visited_at >= duplicate_cutoff,
        )
        .order_by(Visit.visited_at.desc())
    )
    if existing_visit is not None:
        return jsonify(
            {
                "already_checked_in": True,
                "verification": verification,
                "visit": existing_visit.to_dict(),
            }
        )

    visit = Visit(
        user_id=g.current_user.id,
        space_id=space.id,
        verification_method="location",
    )
    db.session.add(visit)
    db.session.commit()
    award_eligible_achievements(g.current_user.id)
    return jsonify(
        {
            "already_checked_in": False,
            "verification": verification,
            "visit": visit.to_dict(),
        }
    ), 201


@feedback_bp.get("/visits/<int:visit_id>")
@login_required
def get_visit(visit_id: int):
    visit = db.session.get(Visit, visit_id)
    if visit is None or visit.user_id != g.current_user.id:
        return jsonify({"error": "Visit not found."}), 404
    return jsonify({"visit": visit.to_dict()})


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
