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
