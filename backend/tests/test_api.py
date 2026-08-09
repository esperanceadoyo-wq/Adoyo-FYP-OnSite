import base64
from datetime import datetime, timedelta, timezone
from io import BytesIO

from app.extensions import db
from app.models import Reflection, SavedSpace, Space, User, UserProfile, Visit
from app.services.progress_service import get_progress


def _create_verified_visit(client, slug="zus-coffee"):
    space = client.get(f"/api/spaces/{slug}").get_json()["space"]
    response = client.post(
        "/api/visits",
        json={
            "accuracy_meters": 10,
            "latitude": space["latitude"],
            "location_consent": True,
            "longitude": space["longitude"],
            "space_id": space["id"],
        },
    )
    assert response.status_code == 201
    return space, response.get_json()["visit"]


def test_health_check(client):
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.get_json()["status"] == "ok"


def test_leaderboard_requires_authentication(client):
    response = client.get("/api/leaderboard")

    assert response.status_code == 401


def test_leaderboard_ranks_visible_students_by_real_progress(
    app, authenticated_client
):
    second_client = app.test_client()
    third_client = app.test_client()
    hidden_client = app.test_client()
    for test_client, name, email in (
        (second_client, "Second Explorer", "second@example.edu"),
        (third_client, "Third Explorer", "third@example.edu"),
        (hidden_client, "Hidden Explorer", "hidden@example.edu"),
    ):
        response = test_client.post(
            "/api/auth/register",
            json={"email": email, "name": name, "password": "SecurePass123!"},
        )
        assert response.status_code == 201

    with app.app_context():
        space = db.session.scalar(db.select(Space).order_by(Space.id))
        users = {
            user.email: user
            for user in db.session.scalars(
                db.select(User).where(
                    User.email.in_(
                        [
                            "demo@onsite.local",
                            "second@example.edu",
                            "third@example.edu",
                            "hidden@example.edu",
                        ]
                    )
                )
            ).all()
        }
        visits = []
        for email, visit_count in (
            ("second@example.edu", 3),
            ("third@example.edu", 2),
            ("hidden@example.edu", 8),
        ):
            for offset in range(visit_count):
                visit = Visit(
                    user_id=users[email].id,
                    space_id=space.id,
                    verification_method="location",
                    visited_at=datetime.now(timezone.utc) + timedelta(minutes=offset),
                )
                db.session.add(visit)
                visits.append((email, visit))
        db.session.flush()
        second_visit = next(
            visit for email, visit in visits if email == "second@example.edu"
        )
        db.session.add(
            Reflection(
                comfort_rating=5,
                learning_value_rating=4,
                social_rating=3,
                space_id=space.id,
                user_id=users["second@example.edu"].id,
                visit_id=second_visit.id,
                would_return=True,
            )
        )
        hidden_profile = db.session.scalar(
            db.select(UserProfile).where(
                UserProfile.user_id == users["hidden@example.edu"].id
            )
        )
        hidden_profile.leaderboard_visible = False
        db.session.commit()

        second_progress = get_progress(users["second@example.edu"].id)
        third_progress = get_progress(users["third@example.edu"].id)

    response = authenticated_client.get("/api/leaderboard")
    data = response.get_json()

    assert response.status_code == 200
    assert [entry["name"] for entry in data["entries"][:2]] == [
        "Second Explorer",
        "Third Explorer",
    ]
    assert [entry["rank"] for entry in data["entries"]] == [1, 2, 3]
    assert data["entries"][0]["xp"] == second_progress["xp"]
    assert data["entries"][0]["visits"] == 3
    assert data["entries"][0]["reflections"] == 1
    assert data["entries"][1]["xp"] == third_progress["xp"]
    assert data["entries"][2]["is_current_user"] is True
    assert all(entry["name"] != "Hidden Explorer" for entry in data["entries"])
    assert data["current_user_visible"] is True
    assert data["total_visible_users"] == 3


def test_leaderboard_respects_current_user_visibility(authenticated_client):
    updated = authenticated_client.patch(
        "/api/auth/account", json={"leaderboard_visible": False}
    )
    response = authenticated_client.get("/api/leaderboard")
    data = response.get_json()

    assert updated.status_code == 200
    assert response.status_code == 200
    assert data["entries"] == []
    assert data["current_user_visible"] is False
    assert data["total_visible_users"] == 0


def test_leaderboard_validates_and_applies_limit(app, authenticated_client):
    other_client = app.test_client()
    assert other_client.post(
        "/api/auth/register",
        json={
            "email": "limited@example.edu",
            "name": "Limited Explorer",
            "password": "SecurePass123!",
        },
    ).status_code == 201

    limited = authenticated_client.get("/api/leaderboard?limit=1")

    assert limited.status_code == 200
    assert len(limited.get_json()["entries"]) == 1
    assert limited.get_json()["total_visible_users"] == 2
    for value in ("0", "101", "many"):
        response = authenticated_client.get(f"/api/leaderboard?limit={value}")
        assert response.status_code == 400
        assert response.get_json()["error"] == "limit must be between 1 and 100."


def test_space_catalog_returns_display_metadata_and_supports_filters(client):
    response = client.get("/api/spaces")

    assert response.status_code == 200
    spaces = response.get_json()["spaces"]
    assert len(spaces) == 9
    assert len({space["slug"] for space in spaces}) == 9
    assert all(space["image_url"] for space in spaces)
    assert all("/aida-public/" in space["image_url"] for space in spaces)
    assert all(space["image_alt"] for space in spaces)

    cafes = client.get("/api/spaces?category=cafe").get_json()["spaces"]
    private_spaces = client.get(
        "/api/spaces?social_intensity=1"
    ).get_json()["spaces"]
    assert len(cafes) == 3
    assert len(private_spaces) == 3
    assert all(space["category"] == "cafe" for space in cafes)
    assert all(space["social_intensity"] == 1 for space in private_spaces)


def test_space_details_support_numeric_ids_and_slugs(client):
    catalog_space = client.get("/api/spaces?category=park").get_json()["spaces"][0]

    by_id = client.get(f"/api/spaces/{catalog_space['id']}")
    by_slug = client.get(f"/api/spaces/{catalog_space['slug']}")

    assert by_id.status_code == 200
    assert by_slug.status_code == 200
    assert by_id.get_json()["space"] == by_slug.get_json()["space"]


def test_space_details_return_not_found_for_unknown_slug(client):
    response = client.get("/api/spaces/not-a-real-space")

    assert response.status_code == 404
    assert response.get_json()["error"] == "Space not found."


def test_space_catalog_rejects_invalid_social_intensity(client):
    response = client.get("/api/spaces?social_intensity=quiet")

    assert response.status_code == 400
    assert response.get_json()["error"] == "social_intensity must be 1, 2, or 3."


def test_space_catalog_hides_inactive_spaces(app, client):
    with app.app_context():
        space = db.session.scalar(
            db.select(Space).where(Space.slug == "cyberjaya-community-library")
        )
        space.is_active = False
        space_id = space.id
        db.session.commit()

    list_response = client.get("/api/spaces")
    detail_response = client.get(f"/api/spaces/{space_id}")
    slug_response = client.get("/api/spaces/cyberjaya-community-library")

    assert list_response.status_code == 200
    assert all(
        space["id"] != space_id for space in list_response.get_json()["spaces"]
    )
    assert detail_response.status_code == 404
    assert slug_response.status_code == 404


def test_saved_spaces_require_authentication(client):
    catalog_space = client.get("/api/spaces").get_json()["spaces"][0]

    assert client.get("/api/saved-spaces").status_code == 401
    assert client.post(
        "/api/saved-spaces", json={"space_id": catalog_space["id"]}
    ).status_code == 401
    assert client.delete(
        f"/api/saved-spaces/{catalog_space['id']}"
    ).status_code == 401


def test_saved_spaces_can_be_listed_saved_idempotently_and_removed(
    app, authenticated_client
):
    space = authenticated_client.get(
        "/api/spaces/cyberjaya-community-library"
    ).get_json()["space"]

    first_save = authenticated_client.post(
        "/api/saved-spaces", json={"space_id": space["id"]}
    )
    repeated_save = authenticated_client.post(
        "/api/saved-spaces", json={"space_id": space["id"]}
    )
    saved_list = authenticated_client.get("/api/saved-spaces")

    assert first_save.status_code == 201
    assert repeated_save.status_code == 200
    assert repeated_save.get_json()["saved_space"]["id"] == first_save.get_json()[
        "saved_space"
    ]["id"]
    assert saved_list.status_code == 200
    assert len(saved_list.get_json()["saved_spaces"]) == 1
    assert saved_list.get_json()["saved_spaces"][0]["space"]["slug"] == space["slug"]

    with app.app_context():
        assert db.session.scalar(db.select(db.func.count(SavedSpace.id))) == 1

    removed = authenticated_client.delete(f"/api/saved-spaces/{space['id']}")
    missing_remove = authenticated_client.delete(f"/api/saved-spaces/{space['id']}")

    assert removed.status_code == 200
    assert missing_remove.status_code == 404
    assert authenticated_client.get("/api/saved-spaces").get_json()[
        "saved_spaces"
    ] == []


def test_saved_spaces_are_private_to_each_user(app, authenticated_client):
    space = authenticated_client.get("/api/spaces?category=cafe").get_json()[
        "spaces"
    ][0]
    first_save = authenticated_client.post(
        "/api/saved-spaces", json={"space_id": space["id"]}
    )

    other_client = app.test_client()
    registration = other_client.post(
        "/api/auth/register",
        json={
            "email": "saved-owner@example.edu",
            "name": "Saved Owner",
            "password": "SavedPass123!",
        },
    )
    other_list = other_client.get("/api/saved-spaces")
    other_remove = other_client.delete(f"/api/saved-spaces/{space['id']}")

    assert first_save.status_code == 201
    assert registration.status_code == 201
    assert other_list.get_json()["saved_spaces"] == []
    assert other_remove.status_code == 404
    assert len(
        authenticated_client.get("/api/saved-spaces").get_json()["saved_spaces"]
    ) == 1


def test_saved_spaces_reject_invalid_or_inactive_spaces(app, authenticated_client):
    invalid_id = authenticated_client.post(
        "/api/saved-spaces", json={"space_id": "one"}
    )
    missing_space = authenticated_client.post(
        "/api/saved-spaces", json={"space_id": 999999}
    )
    space = authenticated_client.get("/api/spaces?category=park").get_json()[
        "spaces"
    ][0]
    saved = authenticated_client.post(
        "/api/saved-spaces", json={"space_id": space["id"]}
    )

    with app.app_context():
        stored_space = db.session.get(Space, space["id"])
        stored_space.is_active = False
        db.session.commit()

    inactive_save = authenticated_client.post(
        "/api/saved-spaces", json={"space_id": space["id"]}
    )
    saved_list = authenticated_client.get("/api/saved-spaces")

    assert invalid_id.status_code == 400
    assert missing_space.status_code == 404
    assert saved.status_code == 201
    assert inactive_save.status_code == 404
    assert saved_list.get_json()["saved_spaces"] == []


def test_register_creates_authenticated_user_and_profile(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Amina Student",
            "email": "amina@example.edu",
            "password": "SecurePass123!",
        },
    )

    assert response.status_code == 201
    assert response.get_json()["user"]["email"] == "amina@example.edu"
    profile_response = client.get("/api/profile")
    assert profile_response.status_code == 200
    assert profile_response.get_json()["profile"]["interests"] == []


def test_register_rejects_weak_password(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Amina Student",
            "email": "amina@example.edu",
            "password": "password",
        },
    )

    assert response.status_code == 400
    assert "Password" in response.get_json()["error"]


def test_password_reset_updates_credentials_and_token_is_single_use(client):
    request_response = client.post(
        "/api/auth/forgot-password", json={"email": "demo@onsite.local"}
    )
    reset_path = request_response.get_json()["reset_path"]
    token = reset_path.split("token=", maxsplit=1)[1]

    reset_response = client.post(
        "/api/auth/reset-password",
        json={"password": "NewDemoPass456!", "token": token},
    )
    reused_response = client.post(
        "/api/auth/reset-password",
        json={"password": "AnotherPass789!", "token": token},
    )
    old_login = client.post(
        "/api/auth/login",
        json={"email": "demo@onsite.local", "password": "DemoPass123!"},
    )
    new_login = client.post(
        "/api/auth/login",
        json={"email": "demo@onsite.local", "password": "NewDemoPass456!"},
    )

    assert request_response.status_code == 200
    assert reset_response.status_code == 200
    assert reused_response.status_code == 400
    assert old_login.status_code == 401
    assert new_login.status_code == 200


def test_forgot_password_does_not_reveal_unknown_accounts(client):
    response = client.post(
        "/api/auth/forgot-password", json={"email": "unknown@example.edu"}
    )

    assert response.status_code == 200
    assert "reset_path" not in response.get_json()
    assert "If an account matches" in response.get_json()["message"]


def test_protected_routes_require_authentication(client):
    response = client.get("/api/profile")

    assert response.status_code == 401
    assert response.get_json()["error"] == "Authentication required."


def test_account_settings_persist_name_and_privacy_without_password(
    authenticated_client,
):
    response = authenticated_client.patch(
        "/api/auth/account",
        json={
            "activity_visible": True,
            "leaderboard_visible": False,
            "location_consent": True,
            "name": "Updated Explorer",
        },
    )
    profile_response = authenticated_client.get("/api/profile")
    user_response = authenticated_client.get("/api/auth/me")

    assert response.status_code == 200
    assert response.get_json()["user"]["name"] == "Updated Explorer"
    assert user_response.get_json()["user"]["name"] == "Updated Explorer"
    profile = profile_response.get_json()["profile"]
    assert profile["activity_visible"] is True
    assert profile["leaderboard_visible"] is False
    assert profile["location_consent"] is True


def test_sensitive_account_settings_require_the_current_password(
    authenticated_client,
):
    missing_password = authenticated_client.patch(
        "/api/auth/account", json={"email": "updated@example.edu"}
    )
    wrong_password = authenticated_client.patch(
        "/api/auth/account",
        json={
            "current_password": "WrongPass123!",
            "email": "updated@example.edu",
        },
    )
    unchanged_user = authenticated_client.get("/api/auth/me").get_json()["user"]

    assert missing_password.status_code == 403
    assert wrong_password.status_code == 403
    assert unchanged_user["email"] == "demo@onsite.local"


def test_account_settings_update_email_and_password(authenticated_client):
    response = authenticated_client.patch(
        "/api/auth/account",
        json={
            "current_password": "DemoPass123!",
            "email": "updated@example.edu",
            "new_password": "UpdatedPass456!",
        },
    )
    authenticated_client.post("/api/auth/logout")
    old_credentials = authenticated_client.post(
        "/api/auth/login",
        json={"email": "demo@onsite.local", "password": "DemoPass123!"},
    )
    new_credentials = authenticated_client.post(
        "/api/auth/login",
        json={"email": "updated@example.edu", "password": "UpdatedPass456!"},
    )

    assert response.status_code == 200
    assert response.get_json()["user"]["email"] == "updated@example.edu"
    assert old_credentials.status_code == 401
    assert new_credentials.status_code == 200


def test_account_settings_reject_duplicate_email_weak_password_and_invalid_privacy(
    authenticated_client,
):
    authenticated_client.post("/api/auth/logout")
    registration = authenticated_client.post(
        "/api/auth/register",
        json={
            "email": "existing@example.edu",
            "name": "Existing User",
            "password": "ExistingPass123!",
        },
    )
    authenticated_client.post("/api/auth/logout")
    authenticated_client.post(
        "/api/auth/login",
        json={"email": "demo@onsite.local", "password": "DemoPass123!"},
    )

    duplicate_email = authenticated_client.patch(
        "/api/auth/account",
        json={
            "current_password": "DemoPass123!",
            "email": "EXISTING@example.edu",
        },
    )
    weak_password = authenticated_client.patch(
        "/api/auth/account",
        json={
            "current_password": "DemoPass123!",
            "new_password": "weak",
        },
    )
    invalid_privacy = authenticated_client.patch(
        "/api/auth/account", json={"leaderboard_visible": "yes"}
    )

    assert registration.status_code == 201
    assert duplicate_email.status_code == 409
    assert weak_password.status_code == 400
    assert invalid_privacy.status_code == 400


def test_student_cannot_manage_spaces(authenticated_client):
    response = authenticated_client.post(
        "/api/spaces",
        json={
            "name": "Restricted Space",
            "description": "Students cannot create this.",
            "category": "library",
            "address": "Campus",
        },
    )

    assert response.status_code == 403
    assert response.get_json()["error"] == "Administrator access required."


def test_admin_overview_requires_admin(app, authenticated_client):
    anonymous_response = app.test_client().get("/api/admin/overview")
    student_response = authenticated_client.get("/api/admin/overview")

    assert anonymous_response.status_code == 401
    assert student_response.status_code == 403
    assert student_response.get_json()["error"] == (
        "Administrator access required."
    )


def test_admin_overview_aggregates_locations_and_recent_reflections(
    authenticated_client, admin_client
):
    space, visit = _create_verified_visit(authenticated_client)
    reflection_response = authenticated_client.post(
        "/api/reflections",
        json={
            "comfort_rating": 5,
            "learning_value_rating": 4,
            "reflection_text": "A useful admin overview reflection.",
            "social_rating": 3,
            "space_id": space["id"],
            "visit_id": visit["id"],
            "would_return": True,
        },
    )
    inactive_space = authenticated_client.get("/api/spaces").get_json()["spaces"][0]
    deactivated = admin_client.delete(f"/api/spaces/{inactive_space['id']}")
    response = admin_client.get("/api/admin/overview")
    data = response.get_json()
    target = next(
        item for item in data["locations"] if item["space"]["id"] == space["id"]
    )
    inactive = next(
        item
        for item in data["locations"]
        if item["space"]["id"] == inactive_space["id"]
    )

    assert reflection_response.status_code == 201
    assert deactivated.status_code == 200
    assert response.status_code == 200
    assert data["stats"]["total_locations"] == 9
    assert data["stats"]["active_locations"] == 8
    assert data["stats"]["total_visits"] == 1
    assert data["stats"]["total_reflections"] == 1
    assert target["visits"] == 1
    assert target["reflections"] == 1
    assert inactive["space"]["is_active"] is False
    assert data["recent_reflections"][0]["reflection_text"] == (
        "A useful admin overview reflection."
    )
    assert data["recent_reflections"][0]["user"]["name"] == "Christine Explorer"


def test_admin_can_create_update_deactivate_and_reactivate_space(admin_client):
    invalid_create = admin_client.post(
        "/api/spaces",
        json={
            "address": "Campus",
            "category": "library",
            "description": "Invalid name type.",
            "name": ["Invalid"],
        },
    )
    created = admin_client.post(
        "/api/spaces",
        json={
            "address": "1 Integration Way",
            "amenities": ["wifi", "wifi", "outlets"],
            "category": "COMMUNITY",
            "description": "Created through the admin API.",
            "name": "Admin Integration Space",
            "noise_level": "hum",
            "opening_hours": {"daily": "08:00 - 20:00"},
            "social_intensity": 2,
        },
    )
    space = created.get_json()["space"]
    updated = admin_client.patch(
        f"/api/spaces/{space['id']}",
        json={"name": "Updated Admin Space", "social_intensity": 3},
    )
    invalid_update = admin_client.patch(
        f"/api/spaces/{space['id']}", json={"latitude": 120}
    )
    deactivated = admin_client.delete(f"/api/spaces/{space['id']}")
    hidden_detail = admin_client.get(f"/api/spaces/{space['slug']}")
    overview = admin_client.get("/api/admin/overview").get_json()
    overview_space = next(
        item
        for item in overview["locations"]
        if item["space"]["id"] == space["id"]
    )
    reactivated = admin_client.patch(
        f"/api/spaces/{space['id']}", json={"is_active": True}
    )
    restored_detail = admin_client.get(f"/api/spaces/{space['slug']}")

    assert invalid_create.status_code == 400
    assert created.status_code == 201
    assert space["category"] == "community"
    assert space["amenities"] == ["wifi", "outlets"]
    assert updated.status_code == 200
    assert updated.get_json()["space"]["name"] == "Updated Admin Space"
    assert invalid_update.status_code == 400
    assert deactivated.status_code == 200
    assert hidden_detail.status_code == 404
    assert overview_space["space"]["is_active"] is False
    assert reactivated.status_code == 200
    assert restored_detail.status_code == 200


def test_onboarding_profile_contract_does_not_infer_uncollected_fields(
    authenticated_client,
):
    response = authenticated_client.put(
        "/api/profile",
        json={
            "comfort_level": "private",
            "current_mood": "focused",
            "interests": ["study", "study", " collaborative "],
            "noise_tolerance": "silent",
            "preferred_amenities": ["wifi", "outlets"],
            "preferred_social_intensity": 1,
        },
    )

    assert response.status_code == 200
    profile = response.get_json()["profile"]
    assert profile["comfort_level"] == "private"
    assert profile["interests"] == ["study", "collaborative"]
    assert profile["learning_goals"] == ["build confidence", "meet peers"]
    assert profile["preferred_space_types"] == ["library", "cafe"]


def test_profile_rejects_unknown_onboarding_values(authenticated_client):
    response = authenticated_client.put(
        "/api/profile", json={"comfort_level": "extreme"}
    )

    assert response.status_code == 400
    assert "comfort_level must be one of" in response.get_json()["error"]


def test_profile_avatar_upload_and_fetch(authenticated_client):
    png_bytes = base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
    )
    upload = authenticated_client.post(
        "/api/profile/avatar",
        data={"avatar": (BytesIO(png_bytes), "profile.png")},
        content_type="multipart/form-data",
    )
    profile = authenticated_client.get("/api/profile").get_json()["profile"]
    avatar = authenticated_client.get("/api/profile/avatar")

    assert upload.status_code == 200
    assert upload.get_json()["avatar_url"] == "/api/profile/avatar"
    assert profile["avatar_url"] == "/api/profile/avatar"
    assert avatar.status_code == 200
    assert avatar.content_type == "image/webp"
    assert avatar.data.startswith(b"RIFF")


def test_profile_avatar_rejects_non_image_files(authenticated_client):
    response = authenticated_client.post(
        "/api/profile/avatar",
        data={"avatar": (BytesIO(b"not an image"), "profile.png")},
        content_type="multipart/form-data",
    )

    assert response.status_code == 400
    assert response.get_json()["error"] == "The selected file is not a valid image."


def test_profile_allows_clearing_preferences_and_preserves_campus_name(
    authenticated_client,
):
    response = authenticated_client.put(
        "/api/profile",
        json={"current_mood": None, "home_campus": "  Cyberjaya Campus  "},
    )

    assert response.status_code == 200
    profile = response.get_json()["profile"]
    assert profile["current_mood"] is None
    assert profile["home_campus"] == "Cyberjaya Campus"


def test_profile_recommendation_and_progress_flow(authenticated_client):
    profile_response = authenticated_client.put(
        "/api/profile",
        json={
            "current_mood": "focused",
            "interests": ["study"],
            "preferred_space_types": ["library"],
            "preferred_amenities": ["wifi"],
            "preferred_social_intensity": 1,
            "noise_tolerance": "silent",
        },
    )
    assert profile_response.status_code == 200

    recommendation_response = authenticated_client.post(
        "/api/recommendations", json={"mood": "focused", "limit": 2}
    )
    body = recommendation_response.get_json()
    assert recommendation_response.status_code == 200
    assert len(body["recommendations"]) == 2
    assert body["recommendations"][0]["space"]["category"] == "library"
    assert body["recommendations"][0]["reason"].startswith("Recommended because")

    space = body["recommendations"][0]["space"]
    space_id = space["id"]
    visit_response = authenticated_client.post(
        "/api/visits",
        json={
            "accuracy_meters": 10,
            "latitude": space["latitude"],
            "location_consent": True,
            "longitude": space["longitude"],
            "space_id": space_id,
        },
    )
    assert visit_response.status_code == 201

    reflection_response = authenticated_client.post(
        "/api/reflections",
        json={
            "space_id": space_id,
            "visit_id": visit_response.get_json()["visit"]["id"],
            "comfort_rating": 5,
            "social_rating": 4,
            "learning_value_rating": 4,
            "mood_before": "focused",
            "mood_after": "confident",
            "would_return": True,
        },
    )
    assert reflection_response.status_code == 201

    progress = authenticated_client.get("/api/progress").get_json()["progress"]
    assert progress["visits"] == 1
    assert progress["reflections"] == 1
    assert progress["xp"] >= 90
    assert len(progress["achievements"]) == 2


def test_reflection_submission_requires_matching_verified_visit(
    app, authenticated_client
):
    space, visit = _create_verified_visit(authenticated_client)
    other_space = authenticated_client.get(
        "/api/spaces/cyberjaya-community-library"
    ).get_json()["space"]
    valid_payload = {
        "comfort_rating": 5,
        "learning_value_rating": 4,
        "mood_after": "calm",
        "reflection_text": "Comfortable and productive.",
        "social_rating": 3,
        "space_id": space["id"],
        "visit_id": visit["id"],
        "would_return": True,
    }

    missing_visit = authenticated_client.post(
        "/api/reflections",
        json={key: value for key, value in valid_payload.items() if key != "visit_id"},
    )
    mismatched_space = authenticated_client.post(
        "/api/reflections",
        json={**valid_payload, "space_id": other_space["id"]},
    )
    incomplete_ratings = authenticated_client.post(
        "/api/reflections",
        json={
            **valid_payload,
            "learning_value_rating": None,
        },
    )
    response = authenticated_client.post("/api/reflections", json=valid_payload)
    duplicate = authenticated_client.post("/api/reflections", json=valid_payload)

    assert missing_visit.status_code == 400
    assert missing_visit.get_json()["error"] == "A verified visit_id is required."
    assert mismatched_space.status_code == 400
    assert mismatched_space.get_json()["error"] == "Visit does not belong to this space."
    assert incomplete_ratings.status_code == 400
    assert incomplete_ratings.get_json()["error"] == (
        "All ratings must be whole numbers from 1 to 5."
    )
    assert response.status_code == 201
    assert response.get_json()["reflection"]["visit_id"] == visit["id"]
    assert duplicate.status_code == 409
    assert duplicate.get_json()["error"] == (
        "A reflection was already submitted for this visit."
    )
    with app.app_context():
        assert db.session.scalar(
            db.select(db.func.count()).select_from(Reflection)
        ) == 1


def test_reflection_rejects_invalid_fields(authenticated_client):
    space, visit = _create_verified_visit(authenticated_client)
    base_payload = {
        "comfort_rating": 4,
        "learning_value_rating": 4,
        "social_rating": 4,
        "space_id": space["id"],
        "visit_id": visit["id"],
        "would_return": True,
    }
    cases = [
        ({**base_payload, "comfort_rating": True}, "All ratings must be whole numbers from 1 to 5."),
        ({**base_payload, "would_return": "yes"}, "would_return must be a boolean or null."),
        ({**base_payload, "reflection_text": "x" * 5001}, "reflection_text cannot exceed 5000 characters."),
    ]

    for payload, error in cases:
        response = authenticated_client.post("/api/reflections", json=payload)
        assert response.status_code == 400
        assert response.get_json()["error"] == error


def test_location_check_in_creates_verified_visit_without_coordinates(
    app, authenticated_client
):
    space = authenticated_client.get(
        "/api/spaces/cyberjaya-community-library"
    ).get_json()["space"]
    payload = {
        "accuracy_meters": 12.5,
        "latitude": space["latitude"],
        "location_consent": True,
        "longitude": space["longitude"],
        "space_id": space["id"],
    }

    response = authenticated_client.post("/api/visits", json=payload)
    body = response.get_json()

    assert response.status_code == 201
    assert body["already_checked_in"] is False
    assert body["visit"]["verification_method"] == "location"
    assert body["verification"]["distance_meters"] == 0
    assert body["verification"]["accuracy_meters"] == 12.5
    assert body["verification"]["distance_requirement_waived"] is True
    assert "latitude" not in body["visit"]
    assert "longitude" not in body["visit"]

    visit_response = authenticated_client.get(
        f"/api/visits/{body['visit']['id']}"
    )
    assert visit_response.status_code == 200
    assert visit_response.get_json()["visit"] == body["visit"]

    with app.app_context():
        assert "latitude" not in Visit.__table__.columns
        assert "longitude" not in Visit.__table__.columns


def test_location_check_in_is_idempotent_within_duplicate_window(
    app, authenticated_client
):
    space = authenticated_client.get("/api/spaces/zus-coffee").get_json()["space"]
    payload = {
        "accuracy_meters": 15,
        "latitude": space["latitude"],
        "location_consent": True,
        "longitude": space["longitude"],
        "space_id": space["id"],
    }

    first = authenticated_client.post("/api/visits", json=payload)
    second = authenticated_client.post("/api/visits", json=payload)

    assert first.status_code == 201
    assert second.status_code == 200
    assert second.get_json()["already_checked_in"] is True
    assert second.get_json()["visit"]["id"] == first.get_json()["visit"]["id"]
    with app.app_context():
        assert db.session.scalar(db.select(db.func.count(Visit.id))) == 1


def test_location_check_in_rejects_unverified_readings(app, authenticated_client):
    space = authenticated_client.get("/api/spaces/zus-coffee").get_json()["space"]
    base_payload = {
        "accuracy_meters": 15,
        "latitude": space["latitude"],
        "location_consent": True,
        "longitude": space["longitude"],
        "space_id": space["id"],
    }
    cases = [
        (
            {**base_payload, "location_consent": False},
            400,
            "Explicit location consent is required.",
        ),
        (
            {**base_payload, "accuracy_meters": 500},
            422,
            "The location reading is not accurate enough to verify this visit.",
        ),
        (
            {**base_payload, "latitude": 3.139, "longitude": 101.6869},
            422,
            "You are not close enough to this space to check in.",
        ),
    ]

    for payload, status_code, error in cases:
        response = authenticated_client.post("/api/visits", json=payload)
        assert response.status_code == status_code
        assert response.get_json()["error"] == error

    with app.app_context():
        assert db.session.scalar(db.select(db.func.count(Visit.id))) == 0


def test_community_library_allows_check_in_from_any_distance(
    authenticated_client,
):
    space = authenticated_client.get(
        "/api/spaces/cyberjaya-community-library"
    ).get_json()["space"]

    response = authenticated_client.post(
        "/api/visits",
        json={
            "accuracy_meters": 15,
            "latitude": 3.139,
            "location_consent": True,
            "longitude": 101.6869,
            "space_id": space["id"],
        },
    )
    body = response.get_json()

    assert response.status_code == 201
    assert body["verification"]["distance_meters"] > 150
    assert body["verification"]["distance_requirement_waived"] is True
    assert body["visit"]["verification_method"] == "location"


def test_visit_details_are_private_to_the_visit_owner(authenticated_client):
    space = authenticated_client.get("/api/spaces/zus-coffee").get_json()["space"]
    visit = authenticated_client.post(
        "/api/visits",
        json={
            "accuracy_meters": 10,
            "latitude": space["latitude"],
            "location_consent": True,
            "longitude": space["longitude"],
            "space_id": space["id"],
        },
    ).get_json()["visit"]

    registration = authenticated_client.post(
        "/api/auth/register",
        json={
            "email": "another.student@example.edu",
            "name": "Another Student",
            "password": "SecurePass123!",
        },
    )
    response = authenticated_client.get(f"/api/visits/{visit['id']}")

    assert registration.status_code == 201
    assert response.status_code == 404
    assert response.get_json()["error"] == "Visit not found."


def test_visit_and_reflection_history_are_enriched_and_private(
    authenticated_client,
):
    space, visit = _create_verified_visit(authenticated_client)
    reflection_response = authenticated_client.post(
        "/api/reflections",
        json={
            "comfort_rating": 5,
            "learning_value_rating": 4,
            "social_rating": 3,
            "space_id": space["id"],
            "visit_id": visit["id"],
            "would_return": True,
        },
    )

    visits_response = authenticated_client.get("/api/visits?limit=1")
    reflections_response = authenticated_client.get("/api/reflections?limit=1")
    visit_history = visits_response.get_json()["visits"]
    reflection_history = reflections_response.get_json()["reflections"]

    assert reflection_response.status_code == 201
    assert visits_response.status_code == 200
    assert reflections_response.status_code == 200
    assert visit_history[0]["space"]["slug"] == "zus-coffee"
    assert visit_history[0]["reflection"]["id"] == reflection_history[0]["id"]
    assert reflection_history[0]["visit"]["id"] == visit["id"]

    authenticated_client.post(
        "/api/auth/register",
        json={
            "email": "history.student@example.edu",
            "name": "History Student",
            "password": "SecurePass123!",
        },
    )

    assert authenticated_client.get("/api/visits").get_json()["visits"] == []
    assert authenticated_client.get("/api/reflections").get_json()["reflections"] == []


def test_history_rejects_invalid_limits(authenticated_client):
    invalid_number = authenticated_client.get("/api/visits?limit=recent")
    out_of_range = authenticated_client.get("/api/reflections?limit=101")

    assert invalid_number.status_code == 400
    assert invalid_number.get_json()["error"] == "limit must be a whole number."
    assert out_of_range.status_code == 400
    assert out_of_range.get_json()["error"] == "limit must be between 1 and 100."


def test_progress_uses_real_streak_weekly_activity_and_milestones(
    app, authenticated_client
):
    now = datetime(2026, 8, 6, 12, tzinfo=timezone.utc)
    with app.app_context():
        user = db.session.scalar(
            db.select(User).where(User.email == "demo@onsite.local")
        )
        space = db.session.scalar(
            db.select(Space).where(Space.slug == "cyberjaya-community-library")
        )
        visits = [
            Visit(
                user_id=user.id,
                space_id=space.id,
                verification_method="location",
                visited_at=now - timedelta(days=days),
            )
            for days in (0, 1, 2, 9)
        ]
        db.session.add_all(visits)
        db.session.flush()
        db.session.add(
            Reflection(
                comfort_rating=5,
                created_at=now + timedelta(minutes=5),
                learning_value_rating=4,
                social_rating=3,
                space_id=space.id,
                user_id=user.id,
                visit_id=visits[0].id,
                would_return=True,
            )
        )
        db.session.commit()

        progress = get_progress(user.id, now=now)

    assert progress["current_streak"] == 3
    assert progress["weekly_goal"] == {
        "completed": 3,
        "percent": 60,
        "target": 5,
    }
    assert len(progress["achievement_progress"]) == 6
    assert progress["recent_activity"][0]["kind"] == "reflection"
    assert progress["recent_activity"][0]["title"] == (
        "Reflected on Cyberjaya Community Library"
    )
    assert progress["recent_activity"][0]["occurred_at"].endswith("+00:00")
    assert progress["next_milestone"]["achievement"]["code"] == "CAMPUS_REGULAR"


def test_recommendations_persist_ranked_results_and_history(authenticated_client):
    response = authenticated_client.post(
        "/api/recommendations", json={"mood": "focused", "limit": 3}
    )

    assert response.status_code == 200
    recommendations = response.get_json()["recommendations"]
    assert len(recommendations) == 3
    assert all(item["space"]["slug"] for item in recommendations)
    assert all(item["score"] >= 0 for item in recommendations)
    assert all(item["reason"] for item in recommendations)

    history_response = authenticated_client.get("/api/recommendations/history")
    history = history_response.get_json()["recommendations"]
    assert history_response.status_code == 200
    assert len(history) == 3
    assert all(item["input_context"] == {"mood": "focused"} for item in history)


def test_recommendations_use_prior_visits_and_reflections(authenticated_client):
    space, visit = _create_verified_visit(authenticated_client)
    reflection = authenticated_client.post(
        "/api/reflections",
        json={
            "comfort_rating": 2,
            "learning_value_rating": 2,
            "social_rating": 4,
            "space_id": space["id"],
            "visit_id": visit["id"],
            "would_return": False,
        },
    )
    response = authenticated_client.post("/api/recommendations", json={"limit": 9})
    recommendations = response.get_json()["recommendations"]
    history = authenticated_client.get(
        "/api/recommendations/history"
    ).get_json()["recommendations"]

    assert reflection.status_code == 201
    assert response.status_code == 200
    assert recommendations[0]["space"]["id"] != space["id"]
    assert any("somewhere new to explore" in item["reason"] for item in recommendations)
    assert all(
        item["input_context"]
        == {
            "adaptive_feedback_used": True,
            "visited_space_count": 1,
        }
        for item in history
    )


def test_recommendations_reject_invalid_context(authenticated_client):
    invalid_mood = authenticated_client.post(
        "/api/recommendations", json={"mood": "excited"}
    )
    invalid_limit = authenticated_client.post(
        "/api/recommendations", json={"limit": True}
    )
    invalid_body = authenticated_client.post(
        "/api/recommendations", json=["focused"]
    )

    assert invalid_mood.status_code == 400
    assert "mood must be one of" in invalid_mood.get_json()["error"]
    assert invalid_limit.status_code == 400
    assert invalid_limit.get_json()["error"] == "limit must be a whole number."
    assert invalid_body.status_code == 400
    assert invalid_body.get_json()["error"] == "Request body must be a JSON object."


def test_recommendations_exclude_inactive_spaces_and_allow_empty_results(
    app, authenticated_client
):
    with app.app_context():
        spaces = db.session.scalars(db.select(Space)).all()
        for space in spaces:
            space.is_active = False
        db.session.commit()

    response = authenticated_client.post("/api/recommendations", json={"limit": 8})
    history = authenticated_client.get("/api/recommendations/history")

    assert response.status_code == 200
    assert response.get_json()["recommendations"] == []
    assert history.status_code == 200
    assert history.get_json()["recommendations"] == []


def test_nearby_recommendations_do_not_persist_precise_coordinates(
    authenticated_client,
):
    response = authenticated_client.post(
        "/api/recommendations",
        json={
            "latitude": 2.9197,
            "limit": 3,
            "location_consent": True,
            "longitude": 101.6367,
            "mood": "focused",
        },
    )

    assert response.status_code == 200
    recommendations = response.get_json()["recommendations"]
    assert len(recommendations) == 3
    assert all(item["distance_km"] is not None for item in recommendations)

    history = authenticated_client.get(
        "/api/recommendations/history"
    ).get_json()["recommendations"]
    assert len(history) == 3
    assert all(
        item["input_context"] == {"location_used": True, "mood": "focused"}
        for item in history
    )
    assert all("latitude" not in item["input_context"] for item in history)
    assert all("longitude" not in item["input_context"] for item in history)


def test_nearby_recommendations_require_valid_explicit_consent(
    authenticated_client,
):
    cases = [
        (
            {"latitude": 2.92, "longitude": 101.65},
            "Explicit location consent is required.",
        ),
        (
            {"latitude": 2.92, "location_consent": True},
            "latitude and longitude must be provided together.",
        ),
        (
            {"location_consent": True},
            "Location coordinates are required when consent is granted.",
        ),
        (
            {
                "latitude": 91,
                "location_consent": True,
                "longitude": 101.65,
            },
            "Location coordinates are out of range.",
        ),
    ]

    for payload, error in cases:
        response = authenticated_client.post("/api/recommendations", json=payload)
        assert response.status_code == 400
        assert response.get_json()["error"] == error
