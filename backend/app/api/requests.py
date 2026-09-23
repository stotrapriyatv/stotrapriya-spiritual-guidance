from fastapi import APIRouter, Depends, HTTPException, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.guidance_request import GuidanceRequest
from app.schemas.guidance_request import GuidanceRequestCreate, GuidanceRequestCreateResponse
from app.services.request_service import generate_reference_number, log_activity
from app.services.turnstile_service import verify_turnstile

router = APIRouter(prefix="/api/requests", tags=["requests"])
limiter = Limiter(key_func=get_remote_address)


@router.post("", response_model=GuidanceRequestCreateResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/hour")
async def submit_request(request: Request, payload: GuidanceRequestCreate, db: Session = Depends(get_db)):
    is_valid = await verify_turnstile(payload.turnstile_token, request.client.host if request.client else None)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification failed. Please try again.")

    # Retry a couple of times in case of a reference-number collision under concurrent submissions.
    for _ in range(3):
        reference_number = generate_reference_number(db)
        record = GuidanceRequest(
            reference_number=reference_number,
            full_name=payload.full_name,
            mobile_number=payload.mobile_number,
            place=payload.place,
            male_deity=payload.male_deity,
            female_deity=payload.female_deity,
        )
        db.add(record)
        try:
            db.flush()
        except IntegrityError:
            db.rollback()
            continue
        log_activity(db, record.id, "Request created")
        db.commit()
        return GuidanceRequestCreateResponse(reference_number=reference_number)

    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not process request. Please try again.")
