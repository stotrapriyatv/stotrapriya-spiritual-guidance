from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.activity import RequestActivity
from app.models.guidance_request import GuidanceRequest


def generate_reference_number(db: Session) -> str:
    year = datetime.now(timezone.utc).year
    count = db.execute(select(func.count()).select_from(GuidanceRequest)).scalar_one()
    next_number = count + 1
    return f"SP-{year}-{next_number:04d}"


def log_activity(db: Session, request_id: int, action: str, admin_id: int | None = None) -> None:
    entry = RequestActivity(request_id=request_id, admin_id=admin_id, action=action)
    db.add(entry)
