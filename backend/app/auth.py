from functools import wraps
from typing import Callable

from flask import g, jsonify, session

from .extensions import db
from .models import User


def login_required(view: Callable):
    @wraps(view)
    def wrapped(*args, **kwargs):
        user_id = session.get("user_id")
        user = db.session.get(User, user_id) if user_id else None
        if user is None:
            session.clear()
            return jsonify({"error": "Authentication required."}), 401

        g.current_user = user
        return view(*args, **kwargs)

    return wrapped


def admin_required(view: Callable):
    @wraps(view)
    @login_required
    def wrapped(*args, **kwargs):
        if g.current_user.role != "admin":
            return jsonify({"error": "Administrator access required."}), 403
        return view(*args, **kwargs)

    return wrapped
