from flask import Blueprint, g, jsonify, request

from ..auth import login_required
from ..extensions import db
from ..models import Achievement
from ..services.leaderboard_service import get_leaderboard
from ..services.progress_service import get_progress

progress_bp = Blueprint("progress", __name__, url_prefix="/api")


@progress_bp.get("/progress")
@login_required
def progress():
    return jsonify({"progress": get_progress(g.current_user.id)})


@progress_bp.get("/achievements")
def achievements():
    rows = db.session.scalars(db.select(Achievement).order_by(Achievement.points)).all()
    return jsonify({"achievements": [achievement.to_dict() for achievement in rows]})


@progress_bp.get("/leaderboard")
@login_required
def leaderboard():
    limit_value = request.args.get("limit", "100")
    try:
        limit = int(limit_value)
    except ValueError:
        return jsonify({"error": "limit must be between 1 and 100."}), 400
    if limit < 1 or limit > 100:
        return jsonify({"error": "limit must be between 1 and 100."}), 400

    return jsonify(get_leaderboard(g.current_user.id, limit=limit))
