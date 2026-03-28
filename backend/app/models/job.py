import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import enum


class JobStatus(str, enum.Enum):
    OPEN = "open"
    CLOSED = "closed"
    DRAFT = "draft"


class JobPosition(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organization.id"))
    created_by = Column(UUID(as_uuid=True), ForeignKey("user.id"))

    title = Column(String, nullable=False)
    description = Column(String)
    requirements = Column(JSON)
    status = Column(Enum(JobStatus), default=JobStatus.OPEN)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    organization = relationship("Organization", back_populates="jobs")
    creator = relationship("User", back_populates="created_jobs")
    candidates = relationship("Candidate", back_populates="job")
