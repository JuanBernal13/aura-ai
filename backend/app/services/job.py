from sqlalchemy.orm import Session
from app.models.job import JobPosition, JobStatus
from app.schemas.job import JobCreate
from app.db.neo4j_provider import neo4j_provider
from uuid import UUID


class JobService:
    def create_job(
        self, db: Session, job_in: JobCreate, org_id: UUID, user_id: UUID
    ) -> JobPosition:
        job = JobPosition(
            org_id=org_id,
            created_by=user_id,
            title=job_in.title,
            description=job_in.description,
            requirements=job_in.requirements,
            status=JobStatus.OPEN,
        )
        db.add(job)
        db.commit()
        db.refresh(job)

        job_id_str = str(job.id)
        neo4j_provider.create_job_node(job_id_str, job.title)

        if job.requirements and isinstance(job.requirements, list):
            for skill_req in job.requirements:
                if isinstance(skill_req, str):
                    neo4j_provider.link_job_skill(job_id_str, skill_req, weight=1.0)
                elif isinstance(skill_req, dict) and "name" in skill_req:
                    neo4j_provider.link_job_skill(
                        job_id_str,
                        skill_req["name"],
                        weight=skill_req.get("weight", 1.0),
                    )

        return job

    def get_job(self, db: Session, job_id: UUID) -> JobPosition:
        return db.query(JobPosition).filter(JobPosition.id == job_id).first()

    def list_jobs(self, db: Session, org_id: UUID):
        return db.query(JobPosition).filter(JobPosition.org_id == org_id).all()


job_service = JobService()
