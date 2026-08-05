from .extensions import db
from .models import Achievement, Space, User, UserProfile

SPACES = [
    {
        "slug": "cyberjaya-community-library",
        "name": "Cyberjaya Community Library",
        "description": "An architectural sanctuary for deep focus, reading, and individual study.",
        "category": "library",
        "address": "Persiaran Multimedia, Cyberjaya",
        "latitude": 2.9278,
        "longitude": 101.6417,
        "amenities": ["wifi", "outlets", "quiet rooms"],
        "atmosphere_tags": ["study", "focused", "quiet"],
        "social_intensity": 1,
        "noise_level": "quiet",
        "cost_level": 0,
        "opening_hours": {"daily": "09:00-18:00"},
        "cultural_notes": "Keep calls outside designated quiet zones.",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDfZmvkbJBJglQjbaezVPDEFfM0JP14UoNCXJtsQVuDzYfF3LFlB9-hTgSZ-YswvDPkhMU-RtuyP7b_MiriZ6dv_F5mFekqK7PtD4xsIRFjTAb_FIkh_Z8VP6AyhoEn1A1QvrtDCZ37gR2_AOTJEAHBdDvB0ei_lzOkgVqrVQ8gV4ct0BFLzQLrzVC4mqpfEqkJ8MLknHU_NJ6b_Go2i6oqM1TzBguVTBMaIwQUcb9-BwkEcLGVBGvfkQ",
        "image_alt": "A quiet, modern library interior with soft light and study areas.",
        "rating": 4.9,
    },
    {
        "slug": "bookxcess-tamarind",
        "name": "BookXcess @ Tamarind",
        "description": "A scenic library-cafe hybrid with towering shelves and intimate reading nooks.",
        "category": "bookstore",
        "address": "Tamarind Square, Cyberjaya",
        "latitude": 2.9197,
        "longitude": 101.6367,
        "amenities": ["wifi", "coffee", "reading nooks"],
        "atmosphere_tags": ["reading", "aesthetic", "quiet"],
        "social_intensity": 1,
        "noise_level": "moderate",
        "cost_level": 1,
        "opening_hours": {"daily": "10:00-22:00"},
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBBoNaQBevWtptTr80cP0Ua7mxbJn-jDMBAVYlS588d059E8E4Dt0xmSQQ8H9yHPT21gaq1E4FNmdYPCP7u-aUmMZSV6sXLd1hO10P1ckYa-c4aFe2s3fQwgcbxrkXQeq_cYBwrFEBuOWgT0DhrnsOcQYYQdEwmoWqi9H02B6Vgq0hDlWGMS8678ZpbDrCifpMUuFO_yE2HZ9YCwK7h04OFfDCbIvOgQEN97Xfi3YByKMMh6ZPeDIG7-A",
        "image_alt": "A scenic library cafe with tall shelves and intimate reading nooks.",
        "rating": 4.8,
    },
    {
        "slug": "cyberjaya-lake-gardens",
        "name": "Cyberjaya Lake Gardens",
        "description": "A nature retreat for reflection and quiet walks among greenery and calm water.",
        "category": "park",
        "address": "Cyberjaya Lake Gardens, Cyberjaya",
        "latitude": 2.9361,
        "longitude": 101.6474,
        "amenities": ["mobile coverage", "walking paths", "green space"],
        "atmosphere_tags": ["reflection", "nature", "calm"],
        "social_intensity": 1,
        "noise_level": "quiet",
        "cost_level": 0,
        "opening_hours": {"daily": "06:00-20:00"},
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBkqm6o29QbzMolmJndMyH49Y6EI7NaQMPprpKwPBted61OAcnDGlgsabygYFiIVc8D3iPk9WDalwMKM590RY4OGxrC2r-emZ-eQTn845B3Ccf7nJ05kiGAh2b3ceKBrk8GB_IJSIhgQhgDyJN1oNCCDtveyHmLwHzm0D_uOAJMFXH38hx-efUS75WFiEjRUnlV5-vO5eoFp08eoxaOrccZQTVIcJ6lnxyGVSExZO_V-If4_-WaPEiYzw",
        "image_alt": "A calm lakeside garden surrounded by greenery.",
        "rating": 4.7,
    },
    {
        "slug": "open-co-working-lounge",
        "name": "Open Co-Working Lounge",
        "description": "Modern ergonomic desks and vibrant lighting for independent work and collaboration.",
        "category": "lounge",
        "address": "Cyberjaya City Centre",
        "latitude": 2.9213,
        "longitude": 101.6559,
        "amenities": ["wifi", "outlets", "meeting tables"],
        "atmosphere_tags": ["work", "collaborative", "community"],
        "social_intensity": 2,
        "noise_level": "moderate",
        "cost_level": 1,
        "opening_hours": {"daily": "08:00-20:00"},
        "cultural_notes": "Shared tables make it acceptable to ask before joining a group.",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBBld25p38CY6yFPk4PzlR2ZsxjddigtODRoPk2nGunIgKaHrkQ1gSHzpdQ4a0lacW1MP6AJ-RcthqqrG4nP_Z5kmdpFRv715SsF__3kOj1HmzmpOwG8SL8-_R-EHvg4BwFEIswhAduGYkSPEgavWKY9GYGPazqQQNBNEiYU_Yun9jifiLJ6nkc5AQ3av6yqVeuM79CAYU2imok4GfzmjW3w_nztaGlIRDQChfsa9XVO1XFAUZgSpK4fQ",
        "image_alt": "A modern open co-working lounge with ergonomic desks.",
        "rating": 4.8,
    },
    {
        "slug": "zus-coffee",
        "name": "ZUS Coffee",
        "description": "A tech-friendly specialty coffee shop for quick meetings and focused afternoon work.",
        "category": "cafe",
        "address": "Cyberjaya, Selangor",
        "latitude": 2.9224,
        "longitude": 101.6502,
        "amenities": ["coffee", "wifi", "music"],
        "atmosphere_tags": ["productive", "casual", "focused"],
        "social_intensity": 2,
        "noise_level": "moderate",
        "cost_level": 2,
        "opening_hours": {"daily": "07:30-23:00"},
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCXCf3YYxAs2ngby25WUQxWVCYPPhXpp9ZHBwtaOvsASZkJIr-QosutJPTPZzAoRv_5-E4BRyAEAp280CTGD71j2JKQeR1e2winHfybue0QOWfdBGewXeYqTAsS6FCxjQuTfBYnE3Cp5LXNGMssjWTAHAgC5DfEKvm09qtyqf2u2QMrul_vCap1QuYrOHfMBpUuTVRnczEPb3lsJr6NW8X6KVPplglgvQvmcfQaH9HdnheT4zpBcMKvzTpQ2IuRNk3UZljcFZtWZqnZ",
        "image_alt": "A specialty coffee shop with a focused, modern interior.",
        "rating": 4.6,
    },
    {
        "slug": "richiamo-coffee-tamarind",
        "name": "Richiamo Coffee Tamarind",
        "description": "A cozy industrial cafe with local food and a relaxed social-work atmosphere.",
        "category": "cafe",
        "address": "Tamarind Square, Cyberjaya",
        "latitude": 2.9198,
        "longitude": 101.6369,
        "amenities": ["food", "outlets", "shared tables"],
        "atmosphere_tags": ["social", "dining", "casual"],
        "social_intensity": 2,
        "noise_level": "moderate",
        "cost_level": 2,
        "opening_hours": {"daily": "09:00-00:00"},
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuClhoMIwQD6j1yDT-5IeA1hHT-oazio_ycg2tGLjEvOHeZ7QUdnbiFkQFZUQKlfcFgJ8Q4kLelmRxhaWUi4NSiCHfBsozaNs8ZngkwBoObEoX-oEqLjxpNtgiPs-iBt4C6sIGeyHPeV3aa_ALqZzJ5QYgo0CQyP5hZffG6E2OJoj7vynH7gH3uKmoplz-nVPO44xeePqbmSHrm9nO4Y4Y1OIdpmwf5bBqI_ElDxsdA-XE4fyHmtF_wW1_DBkqJrz4ZZNPQINm80LFAY",
        "image_alt": "A cozy industrial cafe with warm lighting and shared tables.",
        "rating": 4.5,
    },
    {
        "slug": "coffee-bean-tea-leaf-dpulze",
        "name": "Coffee Bean & Tea Leaf",
        "description": "A bustling coffee hub for casual catch-ups, short study sessions, and people-watching.",
        "category": "cafe",
        "address": "DPULZE Shopping Centre, Cyberjaya",
        "latitude": 2.9219,
        "longitude": 101.6504,
        "amenities": ["shopping", "tables", "coffee"],
        "atmosphere_tags": ["collaborative", "central", "social"],
        "social_intensity": 3,
        "noise_level": "lively",
        "cost_level": 2,
        "opening_hours": {"daily": "10:00-22:00"},
        "cultural_notes": "Ordering before settling in for a longer session is customary.",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuAVucMYHiC4R81jiibBG_T1jDyYkrbSDaQ_jIvtXgeNn83gI6mBT28LOkWpiWBkCE5U2mWcfOanf038_J7MH2ByPyylTF_cpv42TGtstrURVBNZ6Pl90iHmICmGWUlVIIM_I_QM6u8OftO7H4LKK3tDTdx7zfoE77K7rGtwyzITV87c8ST-vJRvdX6Py72w7qnMAjcF5JKVIfbL1cACDXHJae54uNGnwb4ElsZyOiuSNw36bJOzo0v4RQ",
        "image_alt": "A busy coffee shop inside a shopping mall.",
        "rating": 4.4,
    },
    {
        "slug": "tamarind-square-courtyard",
        "name": "Tamarind Square Courtyard",
        "description": "An open-air stepped courtyard that brings the community together in the evening.",
        "category": "courtyard",
        "address": "Tamarind Square, Cyberjaya",
        "latitude": 2.9197,
        "longitude": 101.6366,
        "amenities": ["green space", "seating", "community events"],
        "atmosphere_tags": ["community", "open air", "social"],
        "social_intensity": 3,
        "noise_level": "lively",
        "cost_level": 0,
        "opening_hours": {"daily": "24 Hours"},
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBoPnl0NWAWHp3l1RXhk-cwJT25MgEsOSUVAslylY6gqJnOhIdJEJUdiYSMJeyuuBWZydx5zWKVkXQ5axH2QsKnwhriaU-wvugGjapHs2OvNgwoWYc5sW_JVRMMbuPL7PfA8WzZ2nIQHfodfLsrthiXq7ui-j8I5FFUXWaeLJMd-_xpGsXUt-Cah1iZ56H0rWU0X4L523tzl1PkhX3oZmv6dVyT8LYakkiE3p5J30oY031z_ySZVATEPg",
        "image_alt": "An open-air courtyard with amphitheater steps and greenery.",
        "rating": 4.7,
    },
    {
        "slug": "event-plaza-tamarind",
        "name": "Event Plaza Tamarind",
        "description": "A vibrant public square hosting concerts, markets, and lively social gatherings.",
        "category": "event venue",
        "address": "Tamarind Square, Cyberjaya",
        "latitude": 2.9196,
        "longitude": 101.6365,
        "amenities": ["live events", "family friendly", "open plaza"],
        "atmosphere_tags": ["events", "engagement", "social"],
        "social_intensity": 3,
        "noise_level": "lively",
        "cost_level": 1,
        "opening_hours": {"daily": "Event Basis"},
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuAwOI9k2xcyhSOqWCYJrPBXxjw5E56lpuT4T4tL1fcv8cbnataxwy9IoKqkiSSKkj7zl2C41ewrjPo1k9_yzhINsU1PEcEL6p_i1B_bpiese6f7zZ-tFd5I2RTG9FuQRv-iUuavmXrH2qqKWG-tvNEoKRpO2Bhhez3WCZ3rHJlFdYu_B8EJedUM7Ahp0lYSypnTxbNgYNeTf_cwiYjlfjuQrwqF2PQ7ca1FnggSXh_vYY38IONjBxkPAw",
        "image_alt": "A vibrant public plaza used for markets, concerts, and gatherings.",
        "rating": 4.5,
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
        space = db.session.scalar(
            db.select(Space).where(
                (Space.slug == data["slug"]) | (Space.name == data["name"])
            )
        )
        if space is None:
            db.session.add(Space(**data))
        else:
            for field, value in data.items():
                setattr(space, field, value)

    for data in ACHIEVEMENTS:
        achievement = db.session.scalar(
            db.select(Achievement).where(Achievement.code == data["code"])
        )
        if achievement is None:
            db.session.add(Achievement(**data))
        else:
            for field, value in data.items():
                setattr(achievement, field, value)

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
