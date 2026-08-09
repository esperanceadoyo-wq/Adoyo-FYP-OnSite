from flask import Blueprint, jsonify
from sqlalchemy import func

from ..auth import admin_required
from ..extensions import db
from ..models import Reflection, Space, User, Visit

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_bp.get("/overview")
@admin_required
def overview():
    visit_counts = (
        db.select(
            Visit.space_id.label("space_id"),
            func.count(Visit.id).label("visits"),
        )
        .group_by(Visit.space_id)
        .subquery()
    )
    reflection_counts = (
        db.select(
            Reflection.space_id.label("space_id"),
            func.count(Reflection.id).label("reflections"),
        )
        .group_by(Reflection.space_id)
        .subquery()
    )
    location_rows = db.session.execute(
        db.select(
            Space,
            func.coalesce(visit_counts.c.visits, 0),
            func.coalesce(reflection_counts.c.reflections, 0),
        )
        .outerjoin(visit_counts, visit_counts.c.space_id == Space.id)
        .outerjoin(reflection_counts, reflection_counts.c.space_id == Space.id)
        .order_by(Space.name)
    ).all()
    recent_rows = db.session.execute(
        db.select(Reflection, Space, User)
        .join(Space, Space.id == Reflection.space_id)
        .join(User, User.id == Reflection.user_id)
        .order_by(Reflection.created_at.desc(), Reflection.id.desc())
        .limit(20)
    ).all()

    return jsonify(
        {
            "locations": [
                {
                    "reflections": int(reflections),
                    "space": space.to_dict(),
                    "visits": int(visits),
                }
                for space, visits, reflections in location_rows
            ],
            "recent_reflections": [
                {
                    **reflection.to_dict(),
                    "space": {
                        "id": space.id,
                        "name": space.name,
                        "slug": space.slug,
                    },
                    "user": {"id": user.id, "name": user.name},
                }
                for reflection, space, user in recent_rows
            ],
            "stats": {
                "active_locations": sum(
                    1 for space, _, _ in location_rows if space.is_active
                ),
                "total_locations": len(location_rows),
                "total_reflections": sum(
                    int(reflections) for _, _, reflections in location_rows
                ),
                "total_visits": sum(int(visits) for _, visits, _ in location_rows),
            },
        }
    )
