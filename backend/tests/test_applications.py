from datetime import datetime, timezone
from types import SimpleNamespace

import pytest
from bson import ObjectId
from fastapi.testclient import TestClient

from app.database import get_db
from app.main import app
from app.routers.applications import get_stats


class FakeCursor:
    def __init__(self, documents):
        self.documents = list(documents)

    def sort(self, *_args, **_kwargs):
        return self

    def limit(self, value):
        self.documents = self.documents[:value]
        return self

    async def to_list(self, _length):
        return list(self.documents)


class FakeCollection:
    def __init__(self, documents=None):
        self.documents = list(documents or [])

    def find(self, query=None, projection=None):
        query = query or {}
        documents = self.documents
        if "status" in query:
            documents = [d for d in documents if d.get("status") == query["status"]]
        return FakeCursor(documents)

    async def find_one(self, query):
        oid = query.get("_id")
        return next((dict(d) for d in self.documents if d.get("_id") == oid), None)

    async def insert_one(self, document):
        stored = dict(document)
        stored["_id"] = ObjectId()
        self.documents.append(stored)
        return SimpleNamespace(inserted_id=stored["_id"])

    async def find_one_and_update(self, query, update, return_document=True):
        oid = query.get("_id")
        for document in self.documents:
            if document.get("_id") == oid:
                document.update(update.get("$set", {}))
                return dict(document)
        return None

    async def delete_one(self, query):
        oid = query.get("_id")
        before = len(self.documents)
        self.documents = [d for d in self.documents if d.get("_id") != oid]
        return SimpleNamespace(deleted_count=before - len(self.documents))


class FakeDatabase:
    def __init__(self, documents=None):
        self.collection = FakeCollection(documents)

    def __getitem__(self, name):
        assert name == "applications"
        return self.collection


def make_document(**overrides):
    now = datetime.now(timezone.utc)
    document = {
        "_id": ObjectId(),
        "company": "Example Inc.",
        "position": "Software Developer",
        "location": "Montreal",
        "job_url": None,
        "job_description": "A sufficiently detailed job description for testing.",
        "status": "Applied",
        "date_applied": datetime(2026, 8, 1),
        "salary_range": None,
        "contact": None,
        "notes": None,
        "created_at": now,
        "updated_at": now,
    }
    document.update(overrides)
    return document


@pytest.mark.asyncio
async def test_dashboard_stats_calculates_rates_and_timeline():
    db = FakeDatabase([
        make_document(status="Applied", date_applied=datetime(2026, 7, 10)),
        make_document(status="Interview", date_applied=datetime(2026, 8, 1)),
        make_document(status="Offer", date_applied=datetime(2026, 8, 2)),
        make_document(status="Rejected", date_applied=datetime(2026, 8, 3)),
    ])

    result = await get_stats(db)

    assert result.total == 4
    assert result.by_status["Applied"] == 1
    assert result.by_status["Interview"] == 1
    assert result.by_status["Offer"] == 1
    assert result.by_status["Rejected"] == 1
    assert result.response_rate == 75.0
    assert result.interview_rate == 50.0
    assert result.offer_rate == 25.0
    assert result.timeline == [
        {"month": "2026-07", "applications": 1},
        {"month": "2026-08", "applications": 3},
    ]


def test_create_get_update_and_delete_application():
    db = FakeDatabase()
    app.dependency_overrides[get_db] = lambda: db
    client = TestClient(app)

    payload = {
        "company": "Acme",
        "position": "Backend Developer",
        "status": "Applied",
        "date_applied": "2026-08-15",
    }

    created_response = client.post("/api/applications", json=payload)
    assert created_response.status_code == 201
    created = created_response.json()
    app_id = created["id"]
    assert created["company"] == "Acme"

    get_response = client.get(f"/api/applications/{app_id}")
    assert get_response.status_code == 200
    assert get_response.json()["position"] == "Backend Developer"

    update_response = client.patch(
        f"/api/applications/{app_id}",
        json={"status": "Interview"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["status"] == "Interview"

    delete_response = client.delete(f"/api/applications/{app_id}")
    assert delete_response.status_code == 204

    missing_response = client.get(f"/api/applications/{app_id}")
    assert missing_response.status_code == 404

    app.dependency_overrides.clear()


def test_invalid_application_id_returns_400():
    db = FakeDatabase()
    app.dependency_overrides[get_db] = lambda: db
    client = TestClient(app)

    response = client.get("/api/applications/not-an-object-id")

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid ID"
    app.dependency_overrides.clear()
