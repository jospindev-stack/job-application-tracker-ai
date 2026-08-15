from types import SimpleNamespace

from bson import ObjectId
from fastapi.testclient import TestClient

from app.database import get_db
from app.main import app
from app.routers import ai as ai_router
from app.schemas.application import AIAnalysisResult, CVSuggestion, InterviewPrepResult


class FakeCollection:
    def __init__(self, document=None):
        self.document = document

    async def find_one(self, query):
        if self.document and self.document.get("_id") == query.get("_id"):
            return dict(self.document)
        return None


class FakeDatabase:
    def __init__(self, document=None):
        self.collection = FakeCollection(document)

    def __getitem__(self, name):
        assert name == "applications"
        return self.collection


def analysis_result():
    return AIAnalysisResult(
        match_score=82,
        summary="Strong fit for the role.",
        key_requirements=["Python", "FastAPI", "SQL", "APIs", "Testing"],
        cv_suggestions=[
            CVSuggestion(
                section="Experience",
                suggestion="Highlight backend API delivery.",
                priority="high",
            )
        ],
        keywords_to_add=["Python", "FastAPI", "REST", "SQL", "Docker", "CI"],
        red_flags=[],
    )


def prep_result():
    return InterviewPrepResult(
        likely_questions=[{"question": "Tell me about an API you built", "type": "technical", "tip": "Use a concrete example"}],
        company_research_tips=["Review recent products"],
        skills_to_highlight=["Backend development"],
        preparation_checklist=["Prepare one STAR example"],
    )


def test_analyze_endpoint_returns_mocked_ai_result(monkeypatch):
    async def fake_analyze(position, company, job_description):
        assert position == "Backend Developer"
        assert company == "Acme"
        assert len(job_description) >= 50
        return analysis_result()

    monkeypatch.setattr(ai_router, "analyze_job_offer", fake_analyze)
    client = TestClient(app)

    response = client.post(
        "/api/ai/analyze",
        json={
            "position": "Backend Developer",
            "company": "Acme",
            "job_description": "Build and maintain backend APIs using Python, FastAPI, SQL, Docker, testing and CI practices.",
        },
    )

    assert response.status_code == 200
    assert response.json()["match_score"] == 82


def test_interview_prep_endpoint_returns_mocked_result(monkeypatch):
    async def fake_prep(position, company, job_description):
        return prep_result()

    monkeypatch.setattr(ai_router, "generate_interview_prep", fake_prep)
    client = TestClient(app)

    response = client.post(
        "/api/ai/interview-prep",
        json={"position": "Backend Developer", "company": "Acme"},
    )

    assert response.status_code == 200
    assert response.json()["skills_to_highlight"] == ["Backend development"]


def test_saved_application_analysis_validates_missing_job_description(monkeypatch):
    app_id = ObjectId()
    db = FakeDatabase({
        "_id": app_id,
        "position": "Backend Developer",
        "company": "Acme",
        "job_description": None,
    })
    app.dependency_overrides[get_db] = lambda: db
    client = TestClient(app)

    response = client.post(f"/api/ai/analyze/{app_id}")

    assert response.status_code == 400
    assert response.json()["detail"] == "No job description saved for this application"
    app.dependency_overrides.clear()


def test_saved_application_analysis_returns_404_when_missing():
    app_id = ObjectId()
    app.dependency_overrides[get_db] = lambda: FakeDatabase()
    client = TestClient(app)

    response = client.post(f"/api/ai/analyze/{app_id}")

    assert response.status_code == 404
    assert response.json()["detail"] == "Application not found"
    app.dependency_overrides.clear()


def test_ai_provider_failure_returns_502(monkeypatch):
    async def fail_analyze(position, company, job_description):
        raise RuntimeError("provider unavailable")

    monkeypatch.setattr(ai_router, "analyze_job_offer", fail_analyze)
    client = TestClient(app)

    response = client.post(
        "/api/ai/analyze",
        json={
            "position": "Backend Developer",
            "company": "Acme",
            "job_description": "Build and maintain backend APIs using Python, FastAPI, SQL, Docker, testing and CI practices.",
        },
    )

    assert response.status_code == 502
    assert "AI analysis failed" in response.json()["detail"]
