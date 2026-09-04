import os
import tempfile
from pathlib import Path

import pytest


TEST_DATABASE = Path(tempfile.gettempdir()) / "kelana_session8_test.db"
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DATABASE.as_posix()}"
os.environ["JWT_SECRET_KEY"] = "session-8-test-secret-key-with-32-characters"
os.environ["AWS_EC2_METADATA_DISABLED"] = "true"

from fastapi.testclient import TestClient  # noqa: E402

from database import Base, engine  # noqa: E402
from main import app  # noqa: E402


client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


def register(name: str, email: str, password: str = "amanbanget123"):
    return client.post(
        "/api/v1/auth/register",
        json={"name": name, "email": email, "password": password},
    )


def login(email: str, password: str = "amanbanget123") -> str:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def authorization(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_register_login_and_current_user():
    response = register("Alice Traveler", "ALICE@example.com")
    assert response.status_code == 201
    assert response.json()["email"] == "alice@example.com"
    assert response.json()["trip_count"] == 0

    duplicate = register("Alice Lagi", "alice@example.com")
    assert duplicate.status_code == 409

    invalid_login = client.post(
        "/api/v1/auth/login",
        json={"email": "alice@example.com", "password": "password-salah"},
    )
    assert invalid_login.status_code == 401

    token = login("alice@example.com")
    me = client.get("/api/v1/auth/me", headers=authorization(token))
    assert me.status_code == 200
    assert me.json()["name"] == "Alice Traveler"
    assert me.json()["trip_count"] == 0


def test_all_trip_endpoints_require_authentication():
    assert client.get("/api/v1/trips").status_code == 401
    assert client.get("/api/v1/trips/1").status_code == 401
    assert client.post("/api/v1/trips", json={}).status_code == 401
    assert client.put("/api/v1/trips/1", json={"budget": 500}).status_code == 401
    assert client.delete("/api/v1/trips/1").status_code == 401
    assert client.post("/api/v1/trips/1/generate").status_code == 401


def test_trip_crud_is_isolated_between_two_users():
    assert register("Alice", "alice@example.com").status_code == 201
    assert register("Bob", "bob@example.com").status_code == 201
    alice_token = login("alice@example.com")
    bob_token = login("bob@example.com")

    created = client.post(
        "/api/v1/trips",
        headers=authorization(alice_token),
        json={
            "destination": "Labuan Bajo",
            "days": 5,
            "budget": 2000,
            "travel_style": "Solo",
        },
    )
    assert created.status_code == 201
    trip_id = created.json()["id"]

    alice_trips = client.get(
        "/api/v1/trips",
        headers=authorization(alice_token),
    )
    bob_trips = client.get(
        "/api/v1/trips",
        headers=authorization(bob_token),
    )
    assert [trip["id"] for trip in alice_trips.json()] == [trip_id]
    assert bob_trips.json() == []

    hidden_detail = client.get(
        f"/api/v1/trips/{trip_id}",
        headers=authorization(bob_token),
    )
    assert hidden_detail.status_code == 404

    forbidden_update = client.put(
        f"/api/v1/trips/{trip_id}",
        headers=authorization(bob_token),
        json={"budget": 9000},
    )
    forbidden_delete = client.delete(
        f"/api/v1/trips/{trip_id}",
        headers=authorization(bob_token),
    )
    forbidden_generate = client.post(
        f"/api/v1/trips/{trip_id}/generate",
        headers=authorization(bob_token),
    )
    assert forbidden_update.status_code == 403
    assert forbidden_delete.status_code == 403
    assert forbidden_generate.status_code == 403

    updated = client.put(
        f"/api/v1/trips/{trip_id}",
        headers=authorization(alice_token),
        json={"budget": 1200},
    )
    assert updated.status_code == 200
    assert updated.json()["budget"] == 1200

    me = client.get("/api/v1/auth/me", headers=authorization(alice_token))
    assert me.json()["trip_count"] == 1

    deleted = client.delete(
        f"/api/v1/trips/{trip_id}",
        headers=authorization(alice_token),
    )
    assert deleted.status_code == 200
    assert client.get(
        "/api/v1/trips",
        headers=authorization(alice_token),
    ).json() == []


def test_all_conversation_endpoints_require_authentication():
    assert client.get("/api/v1/conversations").status_code == 401
    assert client.post("/api/v1/conversations", json={}).status_code == 401
    assert client.get("/api/v1/conversations/1/messages").status_code == 401
    assert client.post(
        "/api/v1/conversations/1/messages",
        json={"content": "Hello"},
    ).status_code == 401


def test_conversation_history_is_sent_to_bedrock(monkeypatch):
    assert register("Alice", "alice@example.com").status_code == 201
    token = login("alice@example.com")
    headers = authorization(token)
    captured_histories: list[list[dict[str, str]]] = []

    def fake_conversation_response(messages: list[dict[str, str]]) -> str:
        captured_histories.append(messages)
        return "Jawaban KelanaAI"

    monkeypatch.setattr(
        "main.generate_conversation_response",
        fake_conversation_response,
    )

    created = client.post("/api/v1/conversations", headers=headers)
    assert created.status_code == 201
    conversation_id = created.json()["id"]
    assert created.json()["title"] == "New Conversation"

    first = client.post(
        f"/api/v1/conversations/{conversation_id}/messages",
        headers=headers,
        json={"content": "Plan a family trip to Japan."},
    )
    assert first.status_code == 200
    assert first.json()["conversation"]["title"] == "Plan a family trip to Japan."
    assert first.json()["user_message"]["created_at"]
    assert first.json()["assistant_message"]["created_at"]

    second = client.post(
        f"/api/v1/conversations/{conversation_id}/messages",
        headers=headers,
        json={"content": "What should we do on Day 2?"},
    )
    assert second.status_code == 200

    assert captured_histories[0] == [
        {"role": "user", "content": "Plan a family trip to Japan."},
    ]
    assert captured_histories[1] == [
        {"role": "user", "content": "Plan a family trip to Japan."},
        {"role": "assistant", "content": "Jawaban KelanaAI"},
        {"role": "user", "content": "What should we do on Day 2?"},
    ]

    messages = client.get(
        f"/api/v1/conversations/{conversation_id}/messages",
        headers=headers,
    )
    assert messages.status_code == 200
    assert [message["role"] for message in messages.json()] == [
        "user",
        "assistant",
        "user",
        "assistant",
    ]


def test_conversations_are_isolated_between_users(monkeypatch):
    assert register("Alice", "alice@example.com").status_code == 201
    assert register("Bob", "bob@example.com").status_code == 201
    alice_headers = authorization(login("alice@example.com"))
    bob_headers = authorization(login("bob@example.com"))
    monkeypatch.setattr(
        "main.generate_conversation_response",
        lambda messages: "Jawaban aman",
    )

    conversation = client.post(
        "/api/v1/conversations",
        headers=alice_headers,
        json={"title": "Japan Family Trip"},
    ).json()
    conversation_id = conversation["id"]

    assert client.get(
        "/api/v1/conversations",
        headers=bob_headers,
    ).json() == []
    assert client.get(
        f"/api/v1/conversations/{conversation_id}/messages",
        headers=bob_headers,
    ).status_code == 404
    assert client.post(
        f"/api/v1/conversations/{conversation_id}/messages",
        headers=bob_headers,
        json={"content": "Show me Alice's messages"},
    ).status_code == 404


def test_user_message_remains_when_bedrock_fails(monkeypatch):
    assert register("Alice", "alice@example.com").status_code == 201
    headers = authorization(login("alice@example.com"))
    conversation_id = client.post(
        "/api/v1/conversations",
        headers=headers,
        json={},
    ).json()["id"]

    def unavailable_bedrock(messages):
        raise RuntimeError("Bedrock unavailable")

    monkeypatch.setattr(
        "main.generate_conversation_response",
        unavailable_bedrock,
    )
    response = client.post(
        f"/api/v1/conversations/{conversation_id}/messages",
        headers=headers,
        json={"content": "Please plan a trip"},
    )
    assert response.status_code == 502

    messages = client.get(
        f"/api/v1/conversations/{conversation_id}/messages",
        headers=headers,
    ).json()
    assert [(message["role"], message["content"]) for message in messages] == [
        ("user", "Please plan a trip"),
    ]
