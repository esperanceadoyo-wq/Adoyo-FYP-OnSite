def test_health_check(client):
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.get_json()["status"] == "ok"


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

    space_id = body["recommendations"][0]["space"]["id"]
    visit_response = authenticated_client.post(
        "/api/visits", json={"space_id": space_id}
    )
    assert visit_response.status_code == 201

    reflection_response = authenticated_client.post(
        "/api/reflections",
        json={
            "space_id": space_id,
            "visit_id": visit_response.get_json()["visit"]["id"],
            "comfort_rating": 5,
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
