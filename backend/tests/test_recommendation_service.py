from app.models import Space, UserProfile
from app.services.recommendation_service import RecommendationFeedback, rank_spaces


def test_rank_spaces_prefers_profile_match(app):
    profile = UserProfile(
        user_id=99,
        current_mood="focused",
        preferred_social_intensity=1,
        noise_tolerance="silent",
        interests=["study"],
        preferred_space_types=["library"],
        preferred_amenities=["wifi"],
    )
    library = Space(
        name="Quiet Library",
        description="Quiet study",
        category="library",
        address="Campus",
        amenities=["wifi"],
        atmosphere_tags=["quiet", "study"],
        social_intensity=1,
        noise_level="quiet",
    )
    cafe = Space(
        name="Busy Cafe",
        description="Social cafe",
        category="cafe",
        address="Town",
        amenities=["coffee"],
        atmosphere_tags=["social"],
        social_intensity=3,
        noise_level="lively",
    )

    ranked = rank_spaces(profile, [cafe, library], {"mood": "focused"})

    assert ranked[0].space.name == "Quiet Library"
    assert ranked[0].score == 90
    assert ranked[0].score > ranked[1].score


def test_rank_spaces_uses_location_only_with_per_request_consent(app):
    profile = UserProfile(user_id=99, location_consent=False)
    nearby = Space(
        name="Nearby Space",
        description="Nearby",
        category="park",
        address="Cyberjaya",
        amenities=[],
        atmosphere_tags=[],
        social_intensity=2,
        noise_level="moderate",
        latitude=2.92,
        longitude=101.65,
    )

    without_consent = rank_spaces(
        profile,
        [nearby],
        {"latitude": 2.92, "longitude": 101.65},
    )[0]
    with_consent = rank_spaces(
        profile,
        [nearby],
        {
            "latitude": 2.92,
            "location_consent": True,
            "longitude": 101.65,
        },
    )[0]

    assert without_consent.distance_km is None
    assert with_consent.distance_km == 0
    assert with_consent.score == without_consent.score + 10


def test_rank_spaces_uses_feedback_and_favors_unvisited_spaces(app):
    profile = UserProfile(user_id=99)
    visited = Space(
        id=1,
        name="Visited Cafe",
        description="Visited",
        category="cafe",
        address="Cyberjaya",
        amenities=[],
        atmosphere_tags=[],
        social_intensity=2,
        noise_level="moderate",
    )
    unvisited = Space(
        id=2,
        name="New Cafe",
        description="New",
        category="cafe",
        address="Cyberjaya",
        amenities=[],
        atmosphere_tags=[],
        social_intensity=2,
        noise_level="moderate",
    )
    feedback = RecommendationFeedback(
        category_affinity={"cafe": 4},
        noise_affinity={"moderate": 2},
        preferred_social_rating=2,
        reflection_count=1,
        return_preferences={1: False},
        visited_space_ids={1},
    )

    ranked = rank_spaces(profile, [visited, unvisited], feedback=feedback)

    assert ranked[0].space.id == 2
    assert ranked[0].score > ranked[1].score
    assert "somewhere new to explore" in ranked[0].reason
