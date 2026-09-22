from datetime import datetime

from pydantic import BaseModel, Field, field_validator

from app.models.guidance_request import RequestStatus


class GuidanceRequestCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=200)
    mobile_number: str = Field(min_length=7, max_length=20)
    male_deity: str = Field(min_length=1, max_length=200)
    female_deity: str = Field(min_length=1, max_length=200)
    turnstile_token: str

    @field_validator("mobile_number")
    @classmethod
    def digits_only(cls, v: str) -> str:
        cleaned = v.replace(" ", "").replace("-", "")
        if not cleaned.lstrip("+").isdigit():
            raise ValueError("Mobile number must contain only digits")
        return cleaned

    @field_validator("full_name", "male_deity", "female_deity")
    @classmethod
    def strip_text(cls, v: str) -> str:
        return v.strip()


class GuidanceRequestCreateResponse(BaseModel):
    reference_number: str


class GuidanceRequestSummary(BaseModel):
    id: int
    reference_number: str
    full_name: str
    status: RequestStatus
    created_at: datetime

    model_config = {"from_attributes": True}


class GuidanceRequestDetail(BaseModel):
    id: int
    reference_number: str
    full_name: str
    mobile_number: str
    male_deity: str
    female_deity: str
    status: RequestStatus
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class StatusUpdate(BaseModel):
    status: RequestStatus


class ActivityEntry(BaseModel):
    id: int
    action: str
    admin_id: int | None
    created_at: datetime

    model_config = {"from_attributes": True}


class DashboardCounts(BaseModel):
    new: int
    under_review: int
    contacted: int
    guidance_scheduled: int
    completed: int
    no_further_action: int
