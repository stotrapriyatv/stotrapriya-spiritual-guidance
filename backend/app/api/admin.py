from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.db.database import get_db
from app.models.activity import RequestActivity
from app.models.admin import AdminUser
from app.models.guidance_request import GuidanceRequest, RequestStatus
from app.schemas.guidance_request import (
    ActivityEntry,
    DashboardCounts,
    GuidanceRequestDetail,
    GuidanceRequestSummary,
    StatusUpdate,
)
from app.services.request_service import log_activity

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])


@router.get("/dashboard", response_model=DashboardCounts)
def dashboard(db: Session = Depends(get_db)):
    counts = {}
    for s in RequestStatus:
        counts[s.value] = db.execute(
            select(func.count()).select_from(GuidanceRequest).where(GuidanceRequest.status == s)
        ).scalar_one()

    return DashboardCounts(
        new=counts[RequestStatus.NEW],
        under_review=counts[RequestStatus.UNDER_REVIEW],
        contacted=counts[RequestStatus.CONTACTED],
        guidance_scheduled=counts[RequestStatus.GUIDANCE_SCHEDULED],
        completed=counts[RequestStatus.COMPLETED],
        no_further_action=counts[RequestStatus.NO_FURTHER_ACTION],
    )


@router.get("/requests", response_model=list[GuidanceRequestSummary])
def list_requests(db: Session = Depends(get_db), status_filter: RequestStatus | None = None):
    stmt = select(GuidanceRequest).order_by(GuidanceRequest.created_at.desc())
    if status_filter:
        stmt = stmt.where(GuidanceRequest.status == status_filter)
    return db.execute(stmt).scalars().all()


@router.get("/requests/{request_id}", response_model=GuidanceRequestDetail)
def get_request(request_id: int, db: Session = Depends(get_db)):
    record = db.get(GuidanceRequest, request_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
    return record


@router.patch("/requests/{request_id}/status", response_model=GuidanceRequestDetail)
def update_status(
    request_id: int,
    payload: StatusUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    record = db.get(GuidanceRequest, request_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")

    old_status = record.status
    record.status = payload.status
    log_activity(db, record.id, f"Status changed: {old_status.value} → {payload.status.value}", admin.id)
    db.commit()
    db.refresh(record)
    return record


@router.get("/requests/{request_id}/activity", response_model=list[ActivityEntry])
def get_activity(request_id: int, db: Session = Depends(get_db)):
    record = db.get(GuidanceRequest, request_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")

    stmt = (
        select(RequestActivity)
        .where(RequestActivity.request_id == request_id)
        .order_by(RequestActivity.created_at.asc())
    )
    return db.execute(stmt).scalars().all()
