import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import enum


class CandidateStatus(str, enum.Enum):
    PENDING = "pending"
    PARSED = "parsed"
    SCORED = "scored"
    REJECTED = "rejected"
    SHORTLISTED = "shortlisted"


class Candidate(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobposition.id"))

    first_name = Column(String)
    last_name = Column(String)
    email = Column(String)
    raw_doc_path = Column(String)  # MinIO path

    parsing_status = Column(Enum(CandidateStatus), default=CandidateStatus.PENDING)
    overall_score = Column(Float, default=0.0)
    score_detail = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    job = relationship("JobPosition", back_populates="candidates")
