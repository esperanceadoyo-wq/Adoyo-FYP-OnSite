from datetime import datetime, timedelta, timezone

from sqlalchemy import func

from ..extensions import db
from ..models import Achievement, Reflection, Space, UserAchievement, Visit, isoformat

VISIT_XP = 20
REFLECTION_XP = 15
XP_PER_LEVEL = 200
WEEKLY_VISIT_TARGET = 5


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


def get_progress(user_id: int, now: datetime | None = None) -> dict:
    now = now or datetime.now(timezone.utc)
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
    awarded_by_achievement_id = {
        achievement.id: user_achievement
        for user_achievement, achievement in awarded_rows
    }
    all_achievements = db.session.scalars(
        db.select(Achievement).order_by(Achievement.points, Achievement.id)
    ).all()
    achievement_progress = [
        _achievement_progress(
            achievement,
            awarded_by_achievement_id.get(achievement.id),
            visit_count,
            reflection_count,
        )
        for achievement in all_achievements
    ]
    achievement_points = sum(row.Achievement.points for row in awarded_rows)
    xp = visit_count * VISIT_XP + reflection_count * REFLECTION_XP + achievement_points
    level = xp // XP_PER_LEVEL + 1
    visit_dates = [
        visited_at.date()
        for visited_at in db.session.scalars(
            db.select(Visit.visited_at)
            .where(Visit.user_id == user_id)
            .order_by(Visit.visited_at.desc())
        ).all()
    ]
    week_start = now.date() - timedelta(days=now.weekday())
    weekly_visits = sum(visited_at >= week_start for visited_at in visit_dates)
    weekly_target = WEEKLY_VISIT_TARGET
    locked_milestones = [
        milestone for milestone in achievement_progress if not milestone["unlocked"]
    ]

    return {
        "visits": visit_count,
        "reflections": reflection_count,
        "xp": xp,
        "level": level,
        "current_level_xp": xp % XP_PER_LEVEL,
        "next_level_xp": XP_PER_LEVEL,
        "current_streak": _current_streak(visit_dates, now.date()),
        "weekly_goal": {
            "completed": weekly_visits,
            "target": weekly_target,
            "percent": min(100, round((weekly_visits / weekly_target) * 100)),
        },
        "achievements": [
            user_achievement.to_dict(achievement)
            for user_achievement, achievement in awarded_rows
        ],
        "achievement_progress": achievement_progress,
        "next_milestone": locked_milestones[0] if locked_milestones else None,
        "recent_activity": _recent_activity(user_id),
    }


def _current_streak(visit_dates: list, today) -> int:
    unique_dates = sorted(set(visit_dates), reverse=True)
    if not unique_dates or unique_dates[0] < today - timedelta(days=1):
        return 0

    streak = 1
    for previous, current in zip(unique_dates, unique_dates[1:]):
        if previous - current != timedelta(days=1):
            break
        streak += 1
    return streak


def _achievement_progress(
    achievement: Achievement,
    awarded: UserAchievement | None,
    visit_count: int,
    reflection_count: int,
) -> dict:
    criteria = achievement.criteria or {}
    requirements = []
    for metric, current in (
        ("visits", visit_count),
        ("reflections", reflection_count),
    ):
        target = int(criteria.get(metric, 0))
        if target:
            requirements.append(
                {
                    "completed": min(current, target),
                    "metric": metric,
                    "remaining": max(0, target - current),
                    "target": target,
                }
            )

    return {
        "achievement": achievement.to_dict(),
        "awarded_at": isoformat(awarded.awarded_at) if awarded else None,
        "requirements": requirements,
        "unlocked": awarded is not None,
    }


def _recent_activity(user_id: int) -> list[dict]:
    visit_rows = db.session.execute(
        db.select(Visit, Space)
        .join(Space, Space.id == Visit.space_id)
        .where(Visit.user_id == user_id)
        .order_by(Visit.visited_at.desc())
        .limit(5)
    ).all()
    reflection_rows = db.session.execute(
        db.select(Reflection, Space)
        .join(Space, Space.id == Reflection.space_id)
        .where(Reflection.user_id == user_id)
        .order_by(Reflection.created_at.desc())
        .limit(5)
    ).all()
    activities = [
        {
            "id": f"visit-{visit.id}",
            "kind": "visit",
            "occurred_at": isoformat(visit.visited_at),
            "space": space.to_dict(),
            "title": f"Visited {space.name}",
            "xp": VISIT_XP,
        }
        for visit, space in visit_rows
    ]
    activities.extend(
        {
            "id": f"reflection-{reflection.id}",
            "kind": "reflection",
            "occurred_at": isoformat(reflection.created_at),
            "space": space.to_dict(),
            "title": f"Reflected on {space.name}",
            "xp": REFLECTION_XP,
        }
        for reflection, space in reflection_rows
    )
    return sorted(
        activities,
        key=lambda activity: activity["occurred_at"] or "",
        reverse=True,
    )[:5]
