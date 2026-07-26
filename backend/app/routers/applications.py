from datetime import datetime, timezone
from typing import Annotated
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from ..database import get_db
from ..schemas.application import (
    ApplicationCreate, ApplicationOut, ApplicationStatus,
    ApplicationUpdate, DashboardStats,
)

router = APIRouter(prefix="/api/applications", tags=["applications"])


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


def _now() -> datetime:
    return datetime.now(timezone.utc)


@router.get("/stats", response_model=DashboardStats)
async def get_stats(db: Annotated[AsyncIOMotorDatabase, Depends(get_db)]):
    all_apps = await db["applications"].find({}, {"status": 1, "date_applied": 1}).to_list(None)
    total = len(all_apps)

    by_status: dict[str, int] = {s.value: 0 for s in ApplicationStatus}
    by_month: dict[str, int] = {}

    for a in all_apps:
        status = a.get("status", ApplicationStatus.APPLIED)
        by_status[status] = by_status.get(status, 0) + 1
        d = a.get("date_applied")
        if d:
            key = d.strftime("%Y-%m") if hasattr(d, "strftime") else str(d)[:7]
            by_month[key] = by_month.get(key, 0) + 1

    responded = by_status.get("Interview", 0) + by_status.get("Offer", 0) + by_status.get("Rejected", 0)
    interviews = by_status.get("Interview", 0) + by_status.get("Offer", 0)
    offers = by_status.get("Offer", 0)

    timeline = [{"month": k, "applications": v} for k, v in sorted(by_month.items())]

    return DashboardStats(
        total=total,
        by_status=by_status,
        response_rate=round(responded / total * 100, 1) if total else 0.0,
        interview_rate=round(interviews / total * 100, 1) if total else 0.0,
        offer_rate=round(offers / total * 100, 1) if total else 0.0,
        timeline=timeline,
    )


@router.get("", response_model=list[ApplicationOut])
async def list_applications(
    db: Annotated[AsyncIOMotorDatabase, Depends(get_db)],
    status: str | None = Query(None),
    search: str | None = Query(None),
    limit: int = Query(100, ge=1, le=500),
):
    query: dict = {}
    if status:
        query["status"] = status
    if search:
        query["$or"] = [
            {"company": {"$regex": search, "$options": "i"}},
            {"position": {"$regex": search, "$options": "i"}},
        ]
    docs = await db["applications"].find(query).sort("created_at", -1).limit(limit).to_list(None)
    return [_serialize(d) for d in docs]


@router.post("", response_model=ApplicationOut, status_code=201)
async def create_application(
    body: ApplicationCreate,
    db: Annotated[AsyncIOMotorDatabase, Depends(get_db)],
):
    now = _now()
    doc = body.model_dump()
    doc["date_applied"] = datetime.combine(doc["date_applied"], datetime.min.time())
    doc["created_at"] = now
    doc["updated_at"] = now
    result = await db["applications"].insert_one(doc)
    created = await db["applications"].find_one({"_id": result.inserted_id})
    return _serialize(created)


@router.get("/{app_id}", response_model=ApplicationOut)
async def get_application(app_id: str, db: Annotated[AsyncIOMotorDatabase, Depends(get_db)]):
    try:
        oid = ObjectId(app_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    doc = await db["applications"].find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Application not found")
    return _serialize(doc)


@router.patch("/{app_id}", response_model=ApplicationOut)
async def update_application(
    app_id: str,
    body: ApplicationUpdate,
    db: Annotated[AsyncIOMotorDatabase, Depends(get_db)],
):
    try:
        oid = ObjectId(app_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")

    updates = body.model_dump(exclude_none=True)
    if "date_applied" in updates:
        updates["date_applied"] = datetime.combine(updates["date_applied"], datetime.min.time())
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    updates["updated_at"] = _now()
    result = await db["applications"].find_one_and_update(
        {"_id": oid}, {"$set": updates}, return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Application not found")
    return _serialize(result)


@router.delete("/{app_id}", status_code=204)
async def delete_application(app_id: str, db: Annotated[AsyncIOMotorDatabase, Depends(get_db)]):
    try:
        oid = ObjectId(app_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    result = await db["applications"].delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
