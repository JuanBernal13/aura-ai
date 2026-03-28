from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.db.session import minio_client, get_db
from app.schemas.candidate import Candidate
from app.models.candidate import Candidate as CandidateModel
from app.tasks.worker import parse_cv_task
from app.core.config import settings
from uuid import UUID
import os

router = APIRouter()

@router.post("/{job_id}", response_model=Candidate)
async def create_candidate_from_file(
    *,
    db: Session = Depends(get_db),
    job_id: UUID,
    email: str = Form(...),
    file: UploadFile = File(...),
) -> CandidateModel:
    candidate = CandidateModel(job_id=job_id, email=email, parsing_status="pending")
    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    extension = os.path.splitext(file.filename)[1]
    minio_path = f"candidates/{candidate.id}{extension}"

    if not minio_client.bucket_exists(settings.MINIO_BUCKET_RAW):
        minio_client.make_bucket(settings.MINIO_BUCKET_RAW)

    file_size = os.fstat(file.file.fileno()).st_size
    minio_client.put_object(
        settings.MINIO_BUCKET_RAW, minio_path, file.file, length=file_size
    )

    candidate.raw_doc_path = minio_path
    db.commit()

    parse_cv_task.delay(str(candidate.id), minio_path)

    return candidate

@router.get("/{id}", response_model=Candidate)
def get_candidate(*, db: Session = Depends(get_db), id: UUID) -> CandidateModel:
    candidate = db.query(CandidateModel).filter(CandidateModel.id == id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

@router.get("/job/{job_id}", response_model=List[Candidate])
def list_candidates_by_job(*, db: Session = Depends(get_db), job_id: UUID) -> List[CandidateModel]:
    return db.query(CandidateModel).filter(CandidateModel.job_id == job_id).all()
