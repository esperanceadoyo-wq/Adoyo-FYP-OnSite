from app.models import Space, UserProfile
from app.services.recommendation_service import rank_spaces


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
    assert ranked[0].score > ranked[1].score
