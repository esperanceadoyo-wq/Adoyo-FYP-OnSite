from dataclasses import dataclass, field

from ..models import Space, UserProfile
from .location_service import distance_meters


@dataclass
class RankedSpace:
    space: Space
    score: float
    reason: str
    distance_km: float | None = None


@dataclass
class RecommendationFeedback:
    category_affinity: dict[str, float] = field(default_factory=dict)
    noise_affinity: dict[str, float] = field(default_factory=dict)
    preferred_social_rating: float | None = None
    reflection_count: int = 0
    return_preferences: dict[int, bool] = field(default_factory=dict)
    visited_space_ids: set[int] = field(default_factory=set)


def rank_spaces(
    profile: UserProfile,
    spaces: list[Space],
    context: dict | None = None,
    feedback: RecommendationFeedback | None = None,
) -> list[RankedSpace]:
    context = context or {}
    feedback = feedback or RecommendationFeedback()
    mood = context.get("mood") or profile.current_mood
    latitude = context.get("latitude")
    longitude = context.get("longitude")
    location_consent = context.get("location_consent") is True
    ranked: list[RankedSpace] = []

    for space in spaces:
        score = 20.0
        reasons: list[str] = []
        distance_km = None
        tags = {tag.lower() for tag in (space.atmosphere_tags or [])}
        amenities = {item.lower() for item in (space.amenities or [])}

        if space.category in (profile.preferred_space_types or []):
            score += 20
            reasons.append(f"it matches your preferred {space.category} spaces")

        interest_matches = tags.intersection(
            item.lower() for item in (profile.interests or [])
        )
        if interest_matches:
            score += min(20, len(interest_matches) * 10)
            reasons.append(f"it supports your {sorted(interest_matches)[0]} interests")

        amenity_matches = amenities.intersection(
            item.lower() for item in (profile.preferred_amenities or [])
        )
        if amenity_matches:
            score += min(15, len(amenity_matches) * 5)
            reasons.append(f"it has {', '.join(sorted(amenity_matches)[:2])}")

        if profile.preferred_social_intensity:
            difference = abs(
                space.social_intensity - profile.preferred_social_intensity
            )
            score += max(0, 15 - difference * 7.5)
            if difference == 0:
                reasons.append("its social atmosphere fits your comfort level")

        noise_aliases = {"silent": "quiet", "hum": "moderate", "noisy": "lively"}
        preferred_noise = noise_aliases.get(
            profile.noise_tolerance or "", profile.noise_tolerance
        )
        if preferred_noise and space.noise_level == preferred_noise:
            score += 10
            reasons.append(f"its {space.noise_level} noise level suits you")

        mood_tags = {
            "focused": {"quiet", "study", "focused"},
            "social": {"social", "community", "collaborative"},
            "overwhelmed": {"quiet", "calm", "low-pressure"},
        }
        if mood and tags.intersection(mood_tags.get(mood, set())):
            score += 10
            reasons.append(f"it fits your {mood} mood today")

        category_affinity = feedback.category_affinity.get(space.category, 0)
        noise_affinity = feedback.noise_affinity.get(space.noise_level, 0)
        if category_affinity:
            score += category_affinity
            if category_affinity > 0:
                reasons.append("your reflections favor this type of space")
        if noise_affinity:
            score += noise_affinity
            if noise_affinity > 0:
                reasons.append("its atmosphere matches your past feedback")

        if feedback.preferred_social_rating is not None:
            social_difference = abs(
                space.social_intensity - feedback.preferred_social_rating
            )
            social_feedback_score = max(0, 6 - social_difference * 3)
            score += social_feedback_score
            if social_difference <= 0.5:
                reasons.append("its social setting matches your recent visits")

        return_preference = feedback.return_preferences.get(space.id)
        if return_preference is True:
            score += 8
            reasons.append("you said you would return")
        elif return_preference is False:
            score -= 15

        if feedback.visited_space_ids and space.id not in feedback.visited_space_ids:
            score += 8
            reasons.insert(0, "it gives you somewhere new to explore")

        if (
            location_consent
            and latitude is not None
            and longitude is not None
            and space.latitude is not None
            and space.longitude is not None
        ):
            distance_km = distance_meters(
                float(latitude), float(longitude), space.latitude, space.longitude
            ) / 1000
            score += max(0, 10 - distance_km * 2)
            if distance_km <= 2:
                reasons.append("it is nearby")

        reason = (
            "Recommended because " + ", and ".join(reasons[:3]) + "."
            if reasons
            else "Recommended as an active third space worth exploring."
        )
        ranked.append(
            RankedSpace(
                space=space,
                score=round(max(0, min(score, 100)), 1),
                reason=reason,
                distance_km=(round(distance_km, 2) if distance_km is not None else None),
            )
        )

    return sorted(ranked, key=lambda item: (-item.score, item.space.name))
