from app.extensions import db
from app.models import Reflection, Space, Visit


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


def test_protected_routes_require_authentication(client):
    response = client.get("/api/profile")

    assert response.status_code == 401
    assert response.get_json()["error"] == "Authentication required."


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
        ({key: value for key, value in base_payload.items() if key != "would_return"}, "would_return must be a boolean."),
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
