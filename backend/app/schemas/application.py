from __future__ import annotations
from datetime import date, datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, HttpUrl


class ApplicationStatus(str, Enum):
    APPLIED = "Applied"
    INTERVIEW = "Interview"
    OFFER = "Offer"
    REJECTED = "Rejected"
    WITHDRAWN = "Withdrawn"


class ApplicationCreate(BaseModel):
    company: str = Field(..., min_length=1, max_length=200)
    position: str = Field(..., min_length=1, max_length=200)
    location: Optional[str] = None
    job_url: Optional[str] = None
    job_description: Optional[str] = Field(None, max_length=10_000)
    status: ApplicationStatus = ApplicationStatus.APPLIED
    date_applied: date = Field(default_factory=date.today)
    salary_range: Optional[str] = None
    contact: Optional[str] = None
    notes: Optional[str] = Field(None, max_length=3000)


class ApplicationUpdate(BaseModel):
    company: Optional[str] = Field(None, min_length=1, max_length=200)
    position: Optional[str] = Field(None, min_length=1, max_length=200)
    location: Optional[str] = None
    job_url: Optional[str] = None
    job_description: Optional[str] = Field(None, max_length=10_000)
    status: Optional[ApplicationStatus] = None
    date_applied: Optional[date] = None
    salary_range: Optional[str] = None
    contact: Optional[str] = None
    notes: Optional[str] = Field(None, max_length=3000)


class ApplicationOut(BaseModel):
    id: str
    company: str
    position: str
    location: Optional[str] = None
    job_url: Optional[str] = None
    job_description: Optional[str] = None
    status: ApplicationStatus
    date_applied: date
    salary_range: Optional[str] = None
    contact: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class DashboardStats(BaseModel):
    total: int
    by_status: dict[str, int]
    response_rate: float
    interview_rate: float
    offer_rate: float
    timeline: list[dict]


class AIAnalysisRequest(BaseModel):
    job_description: str = Field(..., min_length=50, max_length=10_000)
    position: str
    company: str


class InterviewPrepRequest(BaseModel):
    position: str
    company: str
    job_description: Optional[str] = None


class CVSuggestion(BaseModel):
    section: str
    suggestion: str
    priority: str  # high | medium | low


class AIAnalysisResult(BaseModel):
    match_score: int = Field(..., ge=0, le=100)
    summary: str
    key_requirements: list[str]
    cv_suggestions: list[CVSuggestion]
    keywords_to_add: list[str]
    red_flags: list[str]


class InterviewPrepResult(BaseModel):
    likely_questions: list[dict]
    company_research_tips: list[str]
    skills_to_highlight: list[str]
    preparation_checklist: list[str]
