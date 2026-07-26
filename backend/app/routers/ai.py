from typing import Annotated
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from ..database import get_db
from ..schemas.application import (
    AIAnalysisRequest, AIAnalysisResult,
    InterviewPrepRequest, InterviewPrepResult,
)
from ..services.groq_service import analyze_job_offer, generate_interview_prep

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/analyze", response_model=AIAnalysisResult)
async def analyze_application(body: AIAnalysisRequest):
    try:
        return await analyze_job_offer(body.position, body.company, body.job_description)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {str(e)}")


@router.post("/interview-prep", response_model=InterviewPrepResult)
async def interview_prep(body: InterviewPrepRequest):
    try:
        return await generate_interview_prep(body.position, body.company, body.job_description)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Interview prep generation failed: {str(e)}")


@router.post("/analyze/{app_id}", response_model=AIAnalysisResult)
async def analyze_saved_application(
    app_id: str,
    db: Annotated[AsyncIOMotorDatabase, Depends(get_db)],
):
    try:
        oid = ObjectId(app_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")

    doc = await db["applications"].find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Application not found")
    if not doc.get("job_description"):
        raise HTTPException(status_code=400, detail="No job description saved for this application")

    try:
        return await analyze_job_offer(doc["position"], doc["company"], doc["job_description"])
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {str(e)}")


@router.post("/interview-prep/{app_id}", response_model=InterviewPrepResult)
async def interview_prep_saved(
    app_id: str,
    db: Annotated[AsyncIOMotorDatabase, Depends(get_db)],
):
    try:
        oid = ObjectId(app_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")

    doc = await db["applications"].find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Application not found")

    try:
        return await generate_interview_prep(doc["position"], doc["company"], doc.get("job_description"))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Interview prep failed: {str(e)}")
