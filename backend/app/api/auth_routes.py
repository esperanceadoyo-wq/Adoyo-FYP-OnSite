import hashlib
import re
import secrets
from datetime import timedelta

from flask import Blueprint, current_app, g, jsonify, request, session

from ..auth import login_required
from ..extensions import db
from ..models import PasswordResetToken, User, UserProfile, utc_now

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def password_is_valid(password: str) -> bool:
    return (
        len(password) >= 8
        and any(character.isupper() for character in password)
        and any(character.islower() for character in password)
        and any(character.isdigit() for character in password)
    )


def hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


@auth_bp.post("/register")
def register():
    payload = request.get_json(silent=True) or {}
    name = str(payload.get("name", "")).strip()
    email = str(payload.get("email", "")).strip().lower()
    password = str(payload.get("password", ""))

    if len(name) < 2 or not EMAIL_PATTERN.match(email):
        return jsonify({"error": "A valid name and email are required."}), 400
    if not password_is_valid(password):
        return jsonify({
            "error": "Password must be at least 8 characters and include uppercase, lowercase, and a number."
        }), 400
    if db.session.scalar(db.select(User).where(User.email == email)):
        return jsonify({"error": "An account with that email already exists."}), 409

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.flush()
    db.session.add(UserProfile(user_id=user.id))
    db.session.commit()
    session.clear()
    session["user_id"] = user.id
    return jsonify({"user": user.to_dict()}), 201


@auth_bp.post("/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = str(payload.get("email", "")).strip().lower()
    password = str(payload.get("password", ""))
    user = db.session.scalar(db.select(User).where(User.email == email))

    if user is None or not user.check_password(password):
        return jsonify({"error": "Invalid email or password."}), 401

    session.clear()
    session["user_id"] = user.id
    return jsonify({"user": user.to_dict()})


@auth_bp.post("/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logged out."})


@auth_bp.post("/forgot-password")
def forgot_password():
    payload = request.get_json(silent=True) or {}
    email = str(payload.get("email", "")).strip().lower()

    if not EMAIL_PATTERN.match(email):
        return jsonify({"error": "Enter a valid email address."}), 400

    user = db.session.scalar(db.select(User).where(User.email == email))
    response = {
        "message": "If an account matches that email, password reset instructions are ready."
    }

    if user is not None:
        now = utc_now()
        db.session.execute(
            db.update(PasswordResetToken)
            .where(
                PasswordResetToken.user_id == user.id,
                PasswordResetToken.used_at.is_(None),
            )
            .values(used_at=now)
        )
        token = secrets.token_urlsafe(32)
        db.session.add(
            PasswordResetToken(
                user_id=user.id,
                token_hash=hash_reset_token(token),
                expires_at=now + timedelta(minutes=30),
            )
        )
        db.session.commit()

        if current_app.config["TESTING"] or current_app.config[
            "EXPOSE_PASSWORD_RESET_TOKEN"
        ]:
            response["reset_path"] = f"/reset-password?token={token}"

    return jsonify(response)


@auth_bp.post("/reset-password")
def reset_password():
    payload = request.get_json(silent=True) or {}
    token = str(payload.get("token", "")).strip()
    password = str(payload.get("password", ""))

    if not token:
        return jsonify({"error": "The password reset link is invalid."}), 400
    if not password_is_valid(password):
        return jsonify({
            "error": "Password must be at least 8 characters and include uppercase, lowercase, and a number."
        }), 400

    reset_token = db.session.scalar(
        db.select(PasswordResetToken).where(
            PasswordResetToken.token_hash == hash_reset_token(token),
            PasswordResetToken.used_at.is_(None),
        )
    )
    now = utc_now()
    expires_at = reset_token.expires_at if reset_token else None
    if expires_at is not None and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=now.tzinfo)

    if reset_token is None or expires_at is None or expires_at <= now:
        return jsonify({"error": "The password reset link is invalid or expired."}), 400

    user = db.session.get(User, reset_token.user_id)
    if user is None:
        return jsonify({"error": "The password reset link is invalid or expired."}), 400

    user.set_password(password)
    reset_token.used_at = now
    db.session.commit()
    session.clear()
    return jsonify({"message": "Your password has been updated. You can now log in."})


@auth_bp.get("/me")
@login_required
def me():
    return jsonify({"user": g.current_user.to_dict()})
