import re

from flask import Blueprint, g, jsonify, request, session

from ..auth import login_required
from ..extensions import db
from ..models import User, UserProfile

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def password_is_valid(password: str) -> bool:
    return (
        len(password) >= 8
        and any(character.isupper() for character in password)
        and any(character.islower() for character in password)
        and any(character.isdigit() for character in password)
    )


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


@auth_bp.get("/me")
@login_required
def me():
    return jsonify({"user": g.current_user.to_dict()})
