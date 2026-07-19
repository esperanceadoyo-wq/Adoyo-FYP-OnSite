from flask import Blueprint, g, jsonify, request

from ..auth import login_required
from ..extensions import db
from ..models import UserProfile

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")

STRING_FIELDS = {
    "home_campus",
    "comfort_level",
    "noise_tolerance",
    "current_mood",
}
LIST_FIELDS = {
    "learning_goals",
    "interests",
    "accessibility_needs",
    "preferred_space_types",
    "preferred_amenities",
}


def _current_profile() -> UserProfile:
    profile = db.session.scalar(
        db.select(UserProfile).where(UserProfile.user_id == g.current_user.id)
    )
    if profile is None:
        profile = UserProfile(user_id=g.current_user.id)
        db.session.add(profile)
        db.session.flush()
    return profile


@profile_bp.get("")
@login_required
def get_profile():
    return jsonify({"profile": _current_profile().to_dict()})


@profile_bp.put("")
@login_required
def update_profile():
    payload = request.get_json(silent=True) or {}
    profile = _current_profile()

    for field in STRING_FIELDS:
        if field in payload:
            value = payload[field]
            setattr(profile, field, str(value).strip() if value is not None else None)

    for field in LIST_FIELDS:
        if field in payload:
            value = payload[field]
            if not isinstance(value, list) or not all(
                isinstance(item, str) for item in value
            ):
                return jsonify({"error": f"{field} must be a list of strings."}), 400
            setattr(profile, field, list(dict.fromkeys(value)))

    if "preferred_social_intensity" in payload:
        intensity = payload["preferred_social_intensity"]
        if intensity not in (1, 2, 3):
            return jsonify(
                {"error": "preferred_social_intensity must be 1, 2, or 3."}
            ), 400
        profile.preferred_social_intensity = intensity

    if "location_consent" in payload:
        if not isinstance(payload["location_consent"], bool):
            return jsonify({"error": "location_consent must be a boolean."}), 400
        profile.location_consent = payload["location_consent"]

    db.session.commit()
    return jsonify({"profile": profile.to_dict()})
