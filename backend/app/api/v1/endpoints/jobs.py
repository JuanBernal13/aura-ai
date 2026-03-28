from typing import List, Dict, Union
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.job import job_service
from app.services.matching import matching_service
from app.schemas.job import Job, JobCreate
from app.models.user import User
from app.models.job import JobPosition
from app.api import deps
from uuid import UUID

router = APIRouter()

@router.post("/", response_model=Job)
def create_job(
    *,
    db: Session = Depends(get_db),
    job_in: JobCreate,
    current_user: User = Depends(deps.get_current_user)
) -> JobPosition:
    return job_service.create_job(db, job_in, current_user.org_id, current_user.id)

@router.get("/", response_model=List[Job])
def list_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> List[JobPosition]:
    return job_service.list_jobs(db, current_user.org_id)

@router.get("/{id}/rank", response_model=List[Dict[str, Union[str, float, int, UUID]]])
def rank_candidates(
    *,
    id: UUID,
    limit: int = 10,
    current_user: User = Depends(deps.get_current_user)
) -> List[Dict[str, Union[str, float, int, UUID]]]:
    return matching_service.rank_candidates_for_job(id, limit)

@router.get("/{id}", response_model=Job)
def get_job(
    *,
    db: Session = Depends(get_db),
    id: UUID,
    current_user: User = Depends(deps.get_current_user)
) -> JobPosition:
    job = job_service.get_job(db, id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.org_id != current_user.org_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return job
