from .extensions import db
from .models import Achievement, Space, User, UserProfile

SPACES = [
    {
        "name": "Open Co-working Lounge",
        "description": "A bright collaborative lounge with panoramic views and flexible seating.",
        "category": "lounge",
        "address": "Cyberjaya City Centre",
        "latitude": 2.9213,
        "longitude": 101.6559,
        "amenities": ["wifi", "outlets", "meeting tables"],
        "atmosphere_tags": ["collaborative", "social", "community"],
        "social_intensity": 3,
        "noise_level": "lively",
        "cost_level": 1,
        "opening_hours": {"weekdays": "08:00-22:00", "weekends": "09:00-20:00"},
        "cultural_notes": "Shared tables make it acceptable to ask before joining a group.",
    },
    {
        "name": "Cyberjaya Community Library",
        "description": "A calm public library with reliable connectivity and individual study areas.",
        "category": "library",
        "address": "Persiaran Multimedia, Cyberjaya",
        "latitude": 2.9278,
        "longitude": 101.6417,
        "amenities": ["wifi", "outlets", "quiet rooms"],
        "atmosphere_tags": ["quiet", "study", "focused", "calm"],
        "social_intensity": 1,
        "noise_level": "quiet",
        "cost_level": 0,
        "opening_hours": {"daily": "09:00-18:00"},
        "cultural_notes": "Keep calls outside designated quiet zones.",
    },
    {
        "name": "Coffee Bean & Tea Leaf",
        "description": "A familiar cafe suited to solo work, casual meetings, and short study sessions.",
        "category": "cafe",
        "address": "Tamarind Square, Cyberjaya",
        "latitude": 2.9199,
        "longitude": 101.6368,
        "amenities": ["wifi", "food", "coffee"],
        "atmosphere_tags": ["casual", "social", "low-pressure"],
        "social_intensity": 2,
        "noise_level": "moderate",
        "cost_level": 2,
        "opening_hours": {"daily": "08:00-23:00"},
        "cultural_notes": "Ordering before settling in for a longer session is customary.",
    },
]

ACHIEVEMENTS = [
    {
        "code": "FIRST_STEP",
        "name": "First Step",
        "description": "Record your first third-space visit.",
        "points": 25,
        "criteria": {"visits": 1},
    },
    {
        "code": "THOUGHTFUL_EXPLORER",
        "name": "Thoughtful Explorer",
        "description": "Complete your first post-visit reflection.",
        "points": 30,
        "criteria": {"reflections": 1},
    },
    {
        "code": "SPACE_EXPLORER",
        "name": "Space Explorer",
        "description": "Record three third-space visits.",
        "points": 50,
        "criteria": {"visits": 3},
    },
]


def seed_database() -> None:
    for data in SPACES:
        if not db.session.scalar(db.select(Space).where(Space.name == data["name"])):
            db.session.add(Space(**data))

    for data in ACHIEVEMENTS:
        if not db.session.scalar(
            db.select(Achievement).where(Achievement.code == data["code"])
        ):
            db.session.add(Achievement(**data))

    demo_user = db.session.scalar(
        db.select(User).where(User.email == "demo@onsite.local")
    )
    if demo_user is None:
        demo_user = User(
            name="Christine Explorer",
            email="demo@onsite.local",
            role="student",
        )
        demo_user.set_password("DemoPass123!")
        db.session.add(demo_user)
        db.session.flush()
        db.session.add(
            UserProfile(
                user_id=demo_user.id,
                home_campus="Cyberjaya",
                comfort_level="casual",
                preferred_social_intensity=2,
                noise_tolerance="hum",
                current_mood="focused",
                interests=["study", "collaborative"],
                learning_goals=["build confidence", "meet peers"],
                preferred_space_types=["library", "cafe"],
                preferred_amenities=["wifi", "outlets"],
            )
        )

    db.session.commit()
