from dataclasses import dataclass

from ..models import Space, UserProfile
from .location_service import distance_meters


@dataclass
class RankedSpace:
    space: Space
    score: float
    reason: str
    distance_km: float | None = None


def rank_spaces(
    profile: UserProfile,
    spaces: list[Space],
    context: dict | None = None,
) -> list[RankedSpace]:
    context = context or {}
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
                score=round(min(score, 100), 1),
                reason=reason,
                distance_km=(round(distance_km, 2) if distance_km is not None else None),
            )
        )

    return sorted(ranked, key=lambda item: (-item.score, item.space.name))
