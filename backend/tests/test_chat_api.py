from app.extensions import db
from app.models import Space


def test_chat_rejects_invalid_requests(client):
    cases = [
        ({}, "message must be a non-empty string."),
        ({"message": " "}, "message must be a non-empty string."),
        ({"message": "x" * 501}, "message cannot exceed 500 characters."),
        (
            {"context_intent": "unknown", "message": "Tell me more"},
            "context_intent is not recognized.",
        ),
        (
            {"message": "Where am I?", "page_path": 12},
            "page_path must be a short string.",
        ),
    ]

    missing_body = client.post("/api/chat")
    assert missing_body.status_code == 400
    assert missing_body.get_json()["error"] == "Request body must be a JSON object."

    for payload, error in cases:
        response = client.post("/api/chat", json=payload)
        assert response.status_code == 400
        assert response.get_json()["error"] == error


def test_chat_matches_paraphrases_and_explicit_follow_ups(client):
    onboarding = client.post(
        "/api/chat", json={"message": "How do I get started?"}
    ).get_json()
    xp_response = client.post(
        "/api/chat", json={"message": "How can I level up in OnSite?"}
    )
    xp_body = xp_response.get_json()
    follow_up = client.post(
        "/api/chat",
        json={"context_intent": xp_body["intent"], "message": "Tell me more"},
    )

    assert onboarding["intent"] == "onboarding"
    assert onboarding["in_scope"] is True
    assert xp_response.status_code == 200
    assert xp_body["in_scope"] is True
    assert xp_body["intent"] == "xp_levels"
    assert "20 XP" in xp_body["answer"]
    assert follow_up.status_code == 200
    assert follow_up.get_json()["intent"] == "xp_levels"


def test_chat_refuses_irrelevant_and_ambiguous_questions(client):
    irrelevant = client.post(
        "/api/chat", json={"message": "What is the weather in London?"}
    ).get_json()
    ambiguous = client.post(
        "/api/chat", json={"message": "Can you help with location visit?"}
    ).get_json()

    assert irrelevant["in_scope"] is False
    assert irrelevant["intent"] is None
    assert "only help with OnSite" in irrelevant["answer"]
    assert ambiguous["in_scope"] is False


def test_chat_uses_current_page_without_echoing_unknown_paths(client):
    known = client.post(
        "/api/chat",
        json={"message": "What can I do here?", "page_path": "/profile"},
    ).get_json()
    unknown = client.post(
        "/api/chat",
        json={
            "message": "What can I do here?",
            "page_path": "/<script>alert(1)</script>",
        },
    ).get_json()

    assert "profile and journey" in known["answer"]
    assert known["links"] == [{"href": "/profile", "label": "Open this page"}]
    assert "<script>" not in unknown["answer"]
    assert all("<script>" not in link["href"] for link in unknown["links"])


def test_chat_lists_only_active_spaces_with_allowlisted_links(app, client):
    with app.app_context():
        inactive = db.session.scalar(
            db.select(Space).where(Space.slug == "cyberjaya-community-library")
        )
        inactive.is_active = False
        inactive_name = inactive.name
        db.session.commit()

    response = client.post(
        "/api/chat", json={"message": "What spaces are available?"}
    )
    body = response.get_json()

    assert response.status_code == 200
    assert body["intent"] == "spaces"
    assert inactive_name not in body["answer"]
    assert all(
        link["href"] == "/explore" or link["href"].startswith("/spaces/")
        for link in body["links"]
    )
    assert all("cyberjaya-community-library" not in link["href"] for link in body["links"])


def test_chat_guests_receive_login_prompts_for_private_questions(client):
    progress = client.post("/api/chat", json={"message": "What is my XP?"}).get_json()
    saved = client.post(
        "/api/chat", json={"message": "Show my saved spaces"}
    ).get_json()

    assert "Log in" in progress["answer"]
    assert progress["links"] == [{"href": "/login", "label": "Log in"}]
    assert "Log in" in saved["answer"]


def test_chat_uses_only_the_authenticated_users_progress_and_saved_spaces(
    authenticated_client,
):
    space = authenticated_client.get(
        "/api/spaces/cyberjaya-community-library"
    ).get_json()["space"]
    authenticated_client.post("/api/saved-spaces", json={"space_id": space["id"]})

    owner_saved = authenticated_client.post(
        "/api/chat", json={"message": "How many saved spaces do I have?"}
    ).get_json()
    owner_progress = authenticated_client.post(
        "/api/chat", json={"message": "Show my progress"}
    ).get_json()

    authenticated_client.post(
        "/api/auth/register",
        json={
            "email": "chat-isolation@example.edu",
            "name": "Chat Isolation",
            "password": "SecurePass123!",
        },
    )
    other_saved = authenticated_client.post(
        "/api/chat", json={"message": "How many saved spaces do I have?"}
    ).get_json()

    assert "1 saved space" in owner_saved["answer"]
    assert "XP at Level" in owner_progress["answer"]
    assert "0 saved spaces" in other_saved["answer"]


def test_chat_limits_admin_guidance_to_administrators(
    authenticated_client, admin_client
):
    student = authenticated_client.post(
        "/api/chat", json={"message": "Open the admin dashboard"}
    ).get_json()
    admin = admin_client.post(
        "/api/chat", json={"message": "Open the admin dashboard"}
    ).get_json()

    assert "only available" in student["answer"]
    assert student["links"] == []
    assert admin["links"] == [{"href": "/admin", "label": "Open admin"}]
