from sqlalchemy import func

from ..extensions import db
from ..models import Achievement, Reflection, UserAchievement, Visit


def award_eligible_achievements(user_id: int) -> list[UserAchievement]:
    visit_count = db.session.scalar(
        db.select(func.count()).select_from(Visit).where(Visit.user_id == user_id)
    )
    reflection_count = db.session.scalar(
        db.select(func.count())
        .select_from(Reflection)
        .where(Reflection.user_id == user_id)
    )
    achievements = db.session.scalars(db.select(Achievement)).all()
    existing_ids = set(
        db.session.scalars(
            db.select(UserAchievement.achievement_id).where(
                UserAchievement.user_id == user_id
            )
        ).all()
    )
    awarded: list[UserAchievement] = []

    for achievement in achievements:
        criteria = achievement.criteria or {}
        eligible = (
            criteria.get("visits", 0) <= visit_count
            and criteria.get("reflections", 0) <= reflection_count
        )
        if eligible and achievement.id not in existing_ids:
            user_achievement = UserAchievement(
                user_id=user_id, achievement_id=achievement.id
            )
            db.session.add(user_achievement)
            awarded.append(user_achievement)

    if awarded:
        db.session.commit()
    return awarded


def get_progress(user_id: int) -> dict:
    award_eligible_achievements(user_id)
    visit_count = db.session.scalar(
        db.select(func.count()).select_from(Visit).where(Visit.user_id == user_id)
    )
    reflection_count = db.session.scalar(
        db.select(func.count())
        .select_from(Reflection)
        .where(Reflection.user_id == user_id)
    )
    awarded_rows = db.session.execute(
        db.select(UserAchievement, Achievement)
        .join(Achievement, Achievement.id == UserAchievement.achievement_id)
        .where(UserAchievement.user_id == user_id)
        .order_by(UserAchievement.awarded_at.desc())
    ).all()
    achievement_points = sum(row.Achievement.points for row in awarded_rows)
    xp = visit_count * 20 + reflection_count * 15 + achievement_points
    level = xp // 200 + 1

    return {
        "visits": visit_count,
        "reflections": reflection_count,
        "xp": xp,
        "level": level,
        "current_level_xp": xp % 200,
        "next_level_xp": 200,
        "achievements": [
            user_achievement.to_dict(achievement)
            for user_achievement, achievement in awarded_rows
        ],
    }
