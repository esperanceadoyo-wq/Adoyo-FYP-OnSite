from io import BytesIO
from pathlib import Path
import secrets

from flask import Blueprint, current_app, g, jsonify, request, send_file
from PIL import Image, ImageOps, UnidentifiedImageError

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
STRING_CHOICES = {
    "comfort_level": {"private", "casual", "public"},
    "current_mood": {"focused", "social", "overwhelmed"},
    "noise_tolerance": {"silent", "hum", "noisy"},
}
LIST_FIELDS = {
    "learning_goals",
    "interests",
    "accessibility_needs",
    "preferred_space_types",
    "preferred_amenities",
}
MAX_AVATAR_BYTES = 5 * 1024 * 1024
ALLOWED_AVATAR_TYPES = {"image/jpeg", "image/png", "image/webp"}


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
            if value is not None and not isinstance(value, str):
                return jsonify({"error": f"{field} must be a string or null."}), 400

            normalized_value = value.strip() if value is not None else None
            if field in STRING_CHOICES and normalized_value is not None:
                normalized_value = normalized_value.lower()
                if normalized_value not in STRING_CHOICES[field]:
                    choices = ", ".join(sorted(STRING_CHOICES[field]))
                    return jsonify(
                        {"error": f"{field} must be one of: {choices}."}
                    ), 400

            setattr(profile, field, normalized_value or None)

    for field in LIST_FIELDS:
        if field in payload:
            value = payload[field]
            if not isinstance(value, list) or not all(
                isinstance(item, str) for item in value
            ):
                return jsonify({"error": f"{field} must be a list of strings."}), 400
            normalized_items = [item.strip() for item in value if item.strip()]
            setattr(profile, field, list(dict.fromkeys(normalized_items)))

    if "preferred_social_intensity" in payload:
        intensity = payload["preferred_social_intensity"]
        if isinstance(intensity, bool) or intensity not in (1, 2, 3):
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


@profile_bp.get("/avatar")
@login_required
def get_avatar():
    profile = _current_profile()
    if not profile.avatar_filename:
        return jsonify({"error": "Profile picture not found."}), 404

    avatar_path = _avatar_directory() / profile.avatar_filename
    if not avatar_path.is_file():
        return jsonify({"error": "Profile picture not found."}), 404

    response = send_file(avatar_path, mimetype="image/webp", conditional=True)
    response.headers["Cache-Control"] = "private, no-store"
    return response


@profile_bp.post("/avatar")
@login_required
def upload_avatar():
    upload = request.files.get("avatar")
    if upload is None or not upload.filename:
        return jsonify({"error": "Choose an image to upload."}), 400
    if upload.mimetype not in ALLOWED_AVATAR_TYPES:
        return jsonify({"error": "Use a JPG, PNG, or WebP image."}), 400

    image_bytes = upload.stream.read(MAX_AVATAR_BYTES + 1)
    if len(image_bytes) > MAX_AVATAR_BYTES:
        return jsonify({"error": "Profile pictures must be 5 MB or smaller."}), 413

    try:
        with Image.open(BytesIO(image_bytes)) as source_image:
            source_image.verify()
        with Image.open(BytesIO(image_bytes)) as source_image:
            normalized = ImageOps.exif_transpose(source_image)
            normalized.thumbnail((512, 512), Image.Resampling.LANCZOS)
            if normalized.mode not in {"RGB", "RGBA"}:
                normalized = normalized.convert("RGBA")
            output = BytesIO()
            normalized.save(output, format="WEBP", quality=88, method=6)
    except (OSError, UnidentifiedImageError, ValueError):
        return jsonify({"error": "The selected file is not a valid image."}), 400

    profile = _current_profile()
    avatar_directory = _avatar_directory()
    avatar_directory.mkdir(parents=True, exist_ok=True)
    previous_filename = profile.avatar_filename
    filename = f"user-{g.current_user.id}-{secrets.token_hex(8)}.webp"
    (avatar_directory / filename).write_bytes(output.getvalue())
    profile.avatar_filename = filename
    db.session.commit()

    if previous_filename and previous_filename != filename:
        previous_path = avatar_directory / previous_filename
        if previous_path.is_file():
            previous_path.unlink()

    return jsonify({"avatar_url": "/api/profile/avatar"})


def _avatar_directory() -> Path:
    configured_directory = current_app.config.get("AVATAR_UPLOAD_DIRECTORY")
    if configured_directory:
        return Path(configured_directory)
    return Path(current_app.instance_path) / "avatars"
