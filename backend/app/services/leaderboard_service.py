from sqlalchemy import func

from ..extensions import db
from ..models import (
    Achievement,
    Reflection,
    User,
    UserAchievement,
    UserProfile,
    Visit,
)


def get_leaderboard(current_user_id: int, limit: int = 100) -> dict:
    visit_counts = (
        db.select(
            Visit.user_id.label("user_id"),
            func.count(Visit.id).label("visits"),
        )
        .group_by(Visit.user_id)
        .subquery()
    )
    reflection_counts = (
        db.select(
            Reflection.user_id.label("user_id"),
            func.count(Reflection.id).label("reflections"),
        )
        .group_by(Reflection.user_id)
        .subquery()
    )
    achievement_points = (
        db.select(
            UserAchievement.user_id.label("user_id"),
            func.sum(Achievement.points).label("achievement_points"),
        )
        .join(Achievement, Achievement.id == UserAchievement.achievement_id)
        .group_by(UserAchievement.user_id)
        .subquery()
    )

    rows = db.session.execute(
        db.select(
            User,
            func.coalesce(visit_counts.c.visits, 0),
            func.coalesce(reflection_counts.c.reflections, 0),
            func.coalesce(achievement_points.c.achievement_points, 0),
        )
        .join(UserProfile, UserProfile.user_id == User.id)
        .outerjoin(visit_counts, visit_counts.c.user_id == User.id)
        .outerjoin(reflection_counts, reflection_counts.c.user_id == User.id)
        .outerjoin(achievement_points, achievement_points.c.user_id == User.id)
        .where(
            User.role == "student",
            UserProfile.leaderboard_visible.is_(True),
        )
    ).all()

    ranked = []
    for user, visits, reflections, points in rows:
        xp = int(visits) * 20 + int(reflections) * 15 + int(points)
        ranked.append(
            {
                "user_id": user.id,
                "name": user.name,
                "visits": int(visits),
                "reflections": int(reflections),
                "xp": xp,
                "level": xp // 200 + 1,
                "title": level_name(xp // 200 + 1),
                "created_at": user.created_at,
            }
        )

    ranked.sort(
        key=lambda entry: (
            -entry["xp"],
            -entry["visits"],
            -entry["reflections"],
            entry["created_at"],
            entry["user_id"],
        )
    )

    entries = []
    for rank, entry in enumerate(ranked[:limit], start=1):
        entries.append(
            {
                key: value
                for key, value in {
                    **entry,
                    "rank": rank,
                    "is_current_user": entry["user_id"] == current_user_id,
                }.items()
                if key != "created_at"
            }
        )

    current_user_visible = any(
        entry["user_id"] == current_user_id for entry in ranked
    )
    return {
        "entries": entries,
        "current_user_visible": current_user_visible,
        "total_visible_users": len(ranked),
    }


def level_name(level: int) -> str:
    if level >= 6:
        return "OnSite Ambassador"
    if level >= 5:
        return "Third Space Champion"
    if level >= 4:
        return "Cultural Navigator"
    if level >= 3:
        return "Community Connector"
    if level >= 2:
        return "Campus Wanderer"
    return "New Explorer"
