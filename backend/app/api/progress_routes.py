from flask import Blueprint, g, jsonify

from ..auth import login_required
from ..extensions import db
from ..models import Achievement
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
