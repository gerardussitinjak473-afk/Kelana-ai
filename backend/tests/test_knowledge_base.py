from fastapi.testclient import TestClient

import main


client = TestClient(main.app)


def test_assistant_returns_grounded_answer_and_sources(monkeypatch):
    monkeypatch.setattr(
        main,
        "ask_knowledge_base",
        lambda question: {
            "answer": "Harga anak KRW 54,000.",
            "sources": ["south-korea-culture-pass.md"],
            "session_id": "session-test",
        },
    )

    response = client.post("/api/v1/ask", json={"question": "Berapa harga KSC-72 untuk anak?"})

    assert response.status_code == 200
    assert response.json()["sources"] == ["south-korea-culture-pass.md"]


def test_assistant_rejects_empty_question():
    response = client.post("/api/v1/ask", json={"question": "  "})
    assert response.status_code == 422
