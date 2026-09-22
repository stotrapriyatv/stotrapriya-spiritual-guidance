import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class RequestStatus(str, enum.Enum):
    NEW = "NEW"
    UNDER_REVIEW = "UNDER_REVIEW"
    CONTACTED = "CONTACTED"
    GUIDANCE_SCHEDULED = "GUIDANCE_SCHEDULED"
    COMPLETED = "COMPLETED"
    NO_FURTHER_ACTION = "NO_FURTHER_ACTION"


class GuidanceRequest(Base):
    __tablename__ = "guidance_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    reference_number: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(200))
    mobile_number: Mapped[str] = mapped_column(String(20))
    male_deity: Mapped[str] = mapped_column(String(200))
    female_deity: Mapped[str] = mapped_column(String(200))
    status: Mapped[RequestStatus] = mapped_column(
        Enum(RequestStatus, name="request_status"), default=RequestStatus.NEW
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
