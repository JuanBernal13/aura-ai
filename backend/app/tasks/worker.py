from app.tasks.celery_app import celery_app
from app.nlp.parser import resume_parser
from app.nlp.embeddings import embedding_service
from app.db.session import SessionLocal, mongo_db, minio_client
from app.models.candidate import Candidate, CandidateStatus
from app.db.neo4j_provider import neo4j_provider
from app.core.config import settings
import tempfile
import os


@celery_app.task(name="app.tasks.worker.parse_cv_task")
def parse_cv_task(candidate_id: str, minio_path: str):
    db = SessionLocal()
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp:
            minio_client.fget_object(settings.MINIO_BUCKET_RAW, minio_path, temp.name)
            raw_text = resume_parser.parse_pdf(temp.name)
            parsed_data = resume_parser.extract_structured_data(raw_text)

            mongo_db.resumes.insert_one(
                {
                    "candidate_id": candidate_id,
                    "raw_text": raw_text,
                    "parsed_data": parsed_data,
                }
            )

            candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
            if candidate:
                candidate.parsing_status = CandidateStatus.PARSED
                candidate.first_name = parsed_data.get("first_name")
                candidate.last_name = parsed_data.get("last_name")
                candidate.email = parsed_data.get("email")
                db.commit()

            embedding_service.index_candidate(
                candidate_id=candidate_id,
                text=raw_text,
                metadata={
                    "job_id": str(candidate.job_id),
                    "first_name": candidate.first_name,
                    "last_name": candidate.last_name,
                },
            )

            neo4j_provider.create_candidate_node(
                candidate_id, f"{candidate.first_name} {candidate.last_name}"
            )
            for skill in parsed_data.get("skills", []):
                neo4j_provider.link_candidate_skill(
                    candidate_id, skill, proficiency=0.5
                )

            os.remove(temp.name)

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()
