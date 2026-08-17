import re
from dataclasses import dataclass

from ..extensions import db
from ..models import Achievement, SavedSpace, Space, User, UserProfile
from .progress_service import (
    REFLECTION_XP,
    VISIT_XP,
    WEEKLY_VISIT_TARGET,
    XP_PER_LEVEL,
    get_progress,
)

REFUSAL = (
    "I can only help with OnSite, including navigation, onboarding, spaces, "
    "recommendations, check-ins, reflections, and your progress."
)


@dataclass(frozen=True)
class ChatIntent:
    key: str
    phrases: tuple[str, ...]
    keywords: frozenset[str]


INTENTS = (
    ChatIntent(
        "current_page",
        ("where am i", "this page", "what can i do here", "help with this page"),
        frozenset({"page", "here", "screen"}),
    ),
    ChatIntent(
        "navigation",
        (
            "navigate",
            "dashboard",
            "explore",
            "profile",
            "settings",
            "find a page",
            "where can i",
            "how do i get",
        ),
        frozenset({"navigate", "menu", "page", "find"}),
    ),
    ChatIntent(
        "onboarding",
        (
            "onboarding",
            "preferences",
            "set up my preferences",
            "adjust preferences",
            "get started",
            "how do i get started",
        ),
        frozenset({"onboarding", "preferences", "interests", "mood"}),
    ),
    ChatIntent(
        "recommendations",
        ("recommendation", "recommended spaces", "nearby recommendations"),
        frozenset({"recommendation", "recommendations", "nearby", "suggest"}),
    ),
    ChatIntent(
        "spaces",
        (
            "available locations",
            "available spaces",
            "locations",
            "spaces are available",
            "where can i study",
            "quiet space",
            "social space",
            "places to go",
        ),
        frozenset(
            {
                "space",
                "spaces",
                "location",
                "locations",
                "library",
                "cafe",
                "quiet",
                "study",
                "social",
                "wifi",
                "amenities",
                "available",
            }
        ),
    ),
    ChatIntent(
        "saved_spaces",
        ("saved spaces", "bookmarked spaces", "my bookmarks", "save a space"),
        frozenset({"saved", "bookmark", "bookmarked", "favorite"}),
    ),
    ChatIntent(
        "check_in",
        ("check in", "check-in", "verify my visit", "location verification"),
        frozenset({"checkin", "check", "visit", "verify", "verification"}),
    ),
    ChatIntent(
        "reflections",
        (
            "submit a reflection",
            "post-visit reflection",
            "reflection",
            "give feedback",
        ),
        frozenset({"reflection", "reflections", "feedback", "visit"}),
    ),
    ChatIntent(
        "personal_progress",
        (
            "my xp",
            "my level",
            "my progress",
            "my streak",
            "my weekly goal",
            "my badges",
            "what level am i",
        ),
        frozenset({"my", "xp", "level", "progress", "streak", "weekly", "badges"}),
    ),
    ChatIntent(
        "xp_levels",
        ("xp", "earn xp", "gain xp", "level up", "xp and levels", "how does xp work"),
        frozenset({"xp", "level", "levels", "points", "progression"}),
    ),
    ChatIntent(
        "achievements",
        (
            "achievement badges",
            "badges",
            "badges and milestones",
            "milestones",
            "next milestone",
        ),
        frozenset({"achievement", "achievements", "badge", "badges", "milestone"}),
    ),
    ChatIntent(
        "leaderboard",
        ("leaderboard", "rankings", "leaderboard visibility"),
        frozenset({"leaderboard", "ranking", "rankings", "rank"}),
    ),
    ChatIntent(
        "account",
        (
            "create an account",
            "sign up",
            "log in",
            "change my password",
            "forgot password",
            "account settings",
        ),
        frozenset({"account", "login", "signup", "password", "email", "settings"}),
    ),
    ChatIntent(
        "privacy",
        ("privacy", "location consent", "is my location stored", "my data"),
        frozenset({"privacy", "consent", "data", "coordinates", "location"}),
    ),
    ChatIntent(
        "admin",
        ("admin dashboard", "manage locations", "admin analytics"),
        frozenset({"admin", "administrator", "analytics", "manage"}),
    ),
)

FOLLOW_UPS = {
    "can you explain more",
    "explain more",
    "how does that work",
    "tell me more",
    "what about that",
}

PAGE_GUIDANCE = {
    "/": ("the OnSite welcome page", "You can learn about OnSite, then sign up or log in."),
    "/about": ("the About page", "This page explains OnSite's purpose and approach."),
    "/dashboard": (
        "your dashboard",
        "Review personalized recommendations, progress, and suggested spaces here.",
    ),
    "/explore": ("Explore Spaces", "Browse active spaces by social comfort category."),
    "/forgot-password": (
        "password recovery",
        "Request a password-reset link for your OnSite account here.",
    ),
    "/leaderboard": ("the leaderboard", "Compare opted-in student progress and XP."),
    "/login": ("the login page", "Sign in to access your personalized OnSite journey."),
    "/notifications": (
        "notifications",
        "Review private OnSite updates and milestone information here.",
    ),
    "/onboarding": (
        "onboarding",
        "Set your mood, interests, comfort level, and space preferences here.",
    ),
    "/privacy": ("the Privacy page", "Review how OnSite handles account and location data."),
    "/profile": (
        "your profile and journey",
        "Review XP, levels, badges, streaks, milestones, and recent activity.",
    ),
    "/saved": ("Saved Spaces", "Review spaces you bookmarked for later."),
    "/settings": (
        "Settings",
        "Update account details, privacy choices, and profile preferences.",
    ),
    "/signup": ("account registration", "Create an OnSite student account here."),
}

DEFAULT_SUGGESTIONS = [
    "How do I get started?",
    "What spaces are available?",
    "How do XP and levels work?",
]


def answer_question(
    message: str,
    *,
    context_intent: str | None = None,
    page_path: str | None = None,
    user: User | None = None,
) -> dict:
    normalized = _normalize(message)
    intent = _match_intent(normalized, context_intent)
    if intent is None:
        return _response(REFUSAL, None, False, suggestions=DEFAULT_SUGGESTIONS)

    handlers = {
        "account": _account_answer,
        "achievements": _achievements_answer,
        "admin": _admin_answer,
        "check_in": _check_in_answer,
        "current_page": _current_page_answer,
        "leaderboard": _leaderboard_answer,
        "navigation": _navigation_answer,
        "onboarding": _onboarding_answer,
        "personal_progress": _personal_progress_answer,
        "privacy": _privacy_answer,
        "recommendations": _recommendations_answer,
        "reflections": _reflections_answer,
        "saved_spaces": _saved_spaces_answer,
        "spaces": _spaces_answer,
        "xp_levels": _xp_levels_answer,
    }
    return handlers[intent](normalized, page_path, user)


def _match_intent(message: str, context_intent: str | None) -> str | None:
    if message in FOLLOW_UPS and context_intent in {intent.key for intent in INTENTS}:
        return context_intent

    scored = []
    words = set(message.split())
    for intent in INTENTS:
        phrase_matches = sum(1 for phrase in intent.phrases if phrase in message)
        keyword_matches = len(words.intersection(intent.keywords))
        if phrase_matches == 0 and keyword_matches < 2:
            continue
        scored.append((phrase_matches * 6 + keyword_matches, phrase_matches, intent.key))

    if not scored:
        return None
    scored.sort(reverse=True)
    top = scored[0]
    if len(scored) > 1 and top[:2] == scored[1][:2]:
        return None
    return top[2]


def _normalize(value: str) -> str:
    return " ".join(re.sub(r"[^a-z0-9]+", " ", value.casefold()).split())


def _response(
    answer: str,
    intent: str | None,
    in_scope: bool = True,
    *,
    links: list[dict] | None = None,
    suggestions: list[str] | None = None,
) -> dict:
    return {
        "answer": answer,
        "in_scope": in_scope,
        "intent": intent,
        "links": links or [],
        "suggestions": suggestions or [],
    }


def _current_page_answer(_message, page_path, _user):
    normalized_path = _known_page_path(page_path)
    if normalized_path.startswith("/spaces/"):
        guidance = (
            "a space details or visit page",
            "Review the space, then save it or continue through location verification, check-in, and reflection.",
        )
    else:
        guidance = PAGE_GUIDANCE.get(normalized_path)
    if guidance is None:
        return _navigation_answer("", page_path, _user)
    title, detail = guidance
    return _response(
        f"You are on {title}. {detail}",
        "current_page",
        links=[{"href": normalized_path, "label": "Open this page"}],
        suggestions=["Where can I find spaces?", "How do I get started?"],
    )


def _navigation_answer(_message, _page_path, _user):
    return _response(
        "Use Dashboard for recommendations, Explore for all active spaces, Profile for your journey, and Settings for account or privacy changes.",
        "navigation",
        links=[
            {"href": "/dashboard", "label": "Dashboard"},
            {"href": "/explore", "label": "Explore"},
            {"href": "/profile", "label": "Profile"},
            {"href": "/settings", "label": "Settings"},
        ],
        suggestions=["What can I do on this page?", "How do I get started?"],
    )


def _onboarding_answer(_message, _page_path, user):
    if user is None:
        answer = (
            "Create an account, then complete onboarding to set your mood, interests, "
            "comfort level, preferred amenities, and space types."
        )
        links = [
            {"href": "/signup", "label": "Create account"},
            {"href": "/login", "label": "Log in"},
        ]
    else:
        profile = _profile_for(user.id)
        configured = bool(
            profile
            and (
                profile.interests
                or profile.preferred_space_types
                or profile.preferred_amenities
            )
        )
        answer = (
            "Your preferences are already set. You can revisit onboarding whenever "
            "your mood, interests, or preferred spaces change."
            if configured
            else "Complete onboarding to personalize your recommendations and dashboard."
        )
        links = [{"href": "/onboarding", "label": "Adjust preferences"}]
    return _response(
        answer,
        "onboarding",
        links=links,
        suggestions=["How do recommendations work?", "What spaces are available?"],
    )


def _recommendations_answer(_message, _page_path, user):
    answer = (
        "OnSite ranks active spaces using your mood and saved preferences, then adapts "
        "to verified visits and reflections. Location is used only for a nearby request "
        "after explicit consent."
    )
    links = [{"href": "/dashboard", "label": "View recommendations"}]
    if user is None:
        answer += " Log in and complete onboarding to receive personalized results."
        links.append({"href": "/login", "label": "Log in"})
    return _response(
        answer,
        "recommendations",
        links=links,
        suggestions=["How do I adjust preferences?", "Is my location stored?"],
    )


def _spaces_answer(message, _page_path, _user):
    spaces = db.session.scalars(
        db.select(Space).where(Space.is_active.is_(True)).order_by(Space.name)
    ).all()
    filtered = _filter_spaces(spaces, message)
    selected = (filtered or spaces)[:4]
    if not selected:
        return _response(
            "There are no active OnSite spaces available right now.",
            "spaces",
            links=[{"href": "/explore", "label": "Explore spaces"}],
        )
    summary = "; ".join(
        f"{space.name} ({space.category}, {space.noise_level})" for space in selected
    )
    prefix = "Matching OnSite spaces include" if filtered else "Available OnSite spaces include"
    return _response(
        f"{prefix}: {summary}.",
        "spaces",
        links=[
            {"href": f"/spaces/{space.slug}", "label": space.name}
            for space in selected
        ]
        + [{"href": "/explore", "label": "View all spaces"}],
        suggestions=["Show me quiet spaces", "How do recommendations work?"],
    )


def _filter_spaces(spaces: list[Space], message: str) -> list[Space]:
    tokens = set(message.split())
    matches = []
    for space in spaces:
        searchable = _normalize(
            " ".join(
                [
                    space.name,
                    space.category,
                    space.noise_level,
                    *(space.amenities or []),
                    *(space.atmosphere_tags or []),
                ]
            )
        )
        name_match = _normalize(space.name) in message
        relevant_tokens = tokens.intersection(
            set(searchable.split())
            - {"space", "spaces", "location", "locations", "available"}
        )
        quiet_match = "quiet" in tokens and space.noise_level in {"quiet", "silent"}
        if name_match or quiet_match or relevant_tokens:
            matches.append(space)
    return matches


def _saved_spaces_answer(_message, _page_path, user):
    if user is None:
        return _login_required_response(
            "Log in to save spaces and review your bookmarks.", "saved_spaces"
        )
    count = db.session.scalar(
        db.select(db.func.count())
        .select_from(SavedSpace)
        .join(Space, Space.id == SavedSpace.space_id)
        .where(SavedSpace.user_id == user.id, Space.is_active.is_(True))
    )
    return _response(
        f"You currently have {count} saved {'space' if count == 1 else 'spaces'}. Use the bookmark control on a space to add or remove it.",
        "saved_spaces",
        links=[{"href": "/saved", "label": "View saved spaces"}],
        suggestions=["What spaces are available?", "How do I check in?"],
    )


def _check_in_answer(_message, _page_path, user):
    answer = (
        "Open a space, continue to location verification, and allow a one-time browser "
        "location reading. OnSite verifies distance without storing precise coordinates."
    )
    links = [{"href": "/explore", "label": "Choose a space"}]
    if user is None:
        answer += " You must be logged in to record a visit."
        links.append({"href": "/login", "label": "Log in"})
    return _response(
        answer,
        "check_in",
        links=links,
        suggestions=["Is my location stored?", "How do reflections work?"],
    )


def _reflections_answer(_message, _page_path, user):
    answer = (
        "After a location-verified check-in, continue to the reflection form and submit "
        "your comfort, social experience, tags, and thoughts. Each visit accepts one reflection."
    )
    if user is None:
        answer += " Log in before starting a visit."
    return _response(
        answer,
        "reflections",
        links=[{"href": "/explore", "label": "Find a space"}],
        suggestions=["How do I check in?", "How do I earn XP?"],
    )


def _personal_progress_answer(_message, _page_path, user):
    if user is None:
        return _login_required_response(
            "Log in to view your personal XP, level, badges, streak, and weekly goal.",
            "personal_progress",
        )
    progress = get_progress(user.id)
    badges = len(progress["achievements"])
    weekly = progress["weekly_goal"]
    return _response(
        f"You have {progress['xp']} XP at Level {progress['level']}, with {badges} "
        f"{'badge' if badges == 1 else 'badges'}, a {progress['current_streak']}-day "
        f"streak, and {weekly['completed']}/{weekly['target']} weekly visits.",
        "personal_progress",
        links=[{"href": "/profile", "label": "View my journey"}],
        suggestions=["How do I earn XP?", "What is my next milestone?"],
    )


def _xp_levels_answer(_message, _page_path, _user):
    return _response(
        f"A verified visit earns {VISIT_XP} XP and a reflection earns {REFLECTION_XP} XP. "
        f"Achievement bonuses are added too, and each level requires {XP_PER_LEVEL} XP. "
        f"The weekly goal is {WEEKLY_VISIT_TARGET} visits.",
        "xp_levels",
        links=[{"href": "/profile", "label": "View progress"}],
        suggestions=["What badges can I earn?", "Show my progress"],
    )


def _achievements_answer(_message, _page_path, user):
    achievements = db.session.scalars(
        db.select(Achievement).order_by(Achievement.points, Achievement.id)
    ).all()
    names = ", ".join(achievement.name for achievement in achievements)
    answer = f"OnSite achievements are: {names}. Each unlocks automatically when its visit or reflection requirements are met."
    if user is not None:
        progress = get_progress(user.id)
        milestone = progress["next_milestone"]
        if milestone:
            answer += f" Your next milestone is {milestone['achievement']['name']}."
        else:
            answer += " You have unlocked every available milestone."
    return _response(
        answer,
        "achievements",
        links=[{"href": "/profile", "label": "View badges"}],
        suggestions=["How do I earn XP?", "Show my progress"],
    )


def _leaderboard_answer(_message, _page_path, user):
    answer = (
        "The leaderboard ranks students who choose to be visible using their real XP "
        "and progress. Visibility can be changed in Settings."
    )
    if user is None:
        answer += " Log in to view rankings."
    return _response(
        answer,
        "leaderboard",
        links=[
            {"href": "/leaderboard", "label": "View leaderboard"},
            {"href": "/settings", "label": "Privacy settings"},
        ],
        suggestions=["How do I earn XP?", "What badges can I earn?"],
    )


def _account_answer(message, _page_path, user):
    if "forgot" in message or "reset" in message:
        answer = "Use Forgot Password to request a reset, then follow the reset link."
        links = [{"href": "/forgot-password", "label": "Reset password"}]
    elif user is None:
        answer = "Create an account to save preferences and track your journey, or log in if you already have one."
        links = [
            {"href": "/signup", "label": "Create account"},
            {"href": "/login", "label": "Log in"},
        ]
    else:
        answer = "Use Settings to update your name, email, password, and privacy choices."
        links = [{"href": "/settings", "label": "Open settings"}]
    return _response(
        answer,
        "account",
        links=links,
        suggestions=["How do I get started?", "How is my data handled?"],
    )


def _privacy_answer(_message, _page_path, _user):
    return _response(
        "OnSite requests location only with explicit consent. Precise coordinates are used for the current nearby request or check-in verification and are not stored in visit history.",
        "privacy",
        links=[
            {"href": "/privacy", "label": "Read privacy details"},
            {"href": "/settings", "label": "Privacy settings"},
        ],
        suggestions=["How do check-ins work?", "How do recommendations work?"],
    )


def _admin_answer(_message, _page_path, user):
    if user is None or user.role != "admin":
        return _response(
            "Administrative tools are only available to authorized OnSite administrators.",
            "admin",
            links=[{"href": "/login", "label": "Log in"}] if user is None else [],
            suggestions=DEFAULT_SUGGESTIONS,
        )
    return _response(
        "Use the Admin area to add, update, or deactivate locations and review aggregate engagement and feedback.",
        "admin",
        links=[{"href": "/admin", "label": "Open admin"}],
        suggestions=["How do I manage locations?", "What can I do on this page?"],
    )


def _login_required_response(answer: str, intent: str):
    return _response(
        answer,
        intent,
        links=[{"href": "/login", "label": "Log in"}],
        suggestions=["How do I get started?", "What spaces are available?"],
    )


def _profile_for(user_id: int) -> UserProfile | None:
    return db.session.scalar(
        db.select(UserProfile).where(UserProfile.user_id == user_id)
    )


def _known_page_path(page_path: str | None) -> str:
    if not page_path or not page_path.startswith("/") or len(page_path) > 255:
        return "/"
    path = page_path.split("?", 1)[0].split("#", 1)[0]
    if path in PAGE_GUIDANCE or path.startswith("/spaces/"):
        return path
    return "/"
