from typing import List, Dict, Union
from app.db.session import SessionLocal
from app.db.neo4j_provider import neo4j_provider
from app.nlp.embeddings import embedding_service
from app.nlp.gnn_predictor import potential_predictor
from app.services.explainability import explanation_service
from app.models.candidate import Candidate
from app.models.job import JobPosition
from uuid import UUID

class MatchingService:
    def rank_candidates_for_job(
        self, job_id: UUID, limit: int = 10, include_explanation: bool = True
    ) -> List[Dict[str, Union[str, float, int, UUID]]]:
        db = SessionLocal()
        try:
            job = db.query(JobPosition).filter(JobPosition.id == job_id).first()
            if not job:
                return []

            job_text = f"{job.title} {job.description}"
            vector_results = embedding_service.search_candidates(
                query_text=job_text, limit=limit * 2
            )

            vector_scores = {str(res.id): res.score for res in vector_results}

            scored_candidates = []
            for cand_id_str, v_score in vector_scores.items():
                graph_result = list(neo4j_provider.get_skill_gap(cand_id_str, str(job_id)))
                
                skill_score = 0.0
                total_weight = 0.0
                matches = 0
                missing_skills = []

                for record in graph_result:
                    weight = record["required_weight"] or 1.0
                    prof = record["candidate_proficiency"] or 0.0
                    total_weight += weight
                    skill_score += prof * weight
                    if prof > 0:
                        matches += 1
                    else:
                        missing_skills.append(record["skill"])

                normalized_skill_score = (
                    skill_score / total_weight if total_weight > 0 else 0.0
                )

                predictions = potential_predictor.predict_next_skills(cand_id_str)
                predicted_skills = {p["skill"]: p["probability"] for p in predictions}
                
                potential_sum = 0.0
                for skill in missing_skills:
                    if skill in predicted_skills:
                        potential_sum += predicted_skills[skill]
                
                potential_score = potential_sum / len(missing_skills) if missing_skills else 1.0
                
                final_score = (v_score * 0.4) + (normalized_skill_score * 0.3) + (potential_score * 0.3)

                candidate = (
                    db.query(Candidate)
                    .filter(Candidate.id == UUID(cand_id_str))
                    .first()
                )
                if candidate:
                    scored_candidates.append(
                        {
                            "id": candidate.id,
                            "first_name": candidate.first_name,
                            "last_name": candidate.last_name,
                            "email": candidate.email,
                            "overall_score": round(final_score, 4),
                            "vector_score": round(v_score, 4),
                            "skill_score": round(normalized_skill_score, 4),
                            "potential_score": round(potential_score, 4),
                            "matches": matches,
                        }
                    )

            scored_candidates.sort(key=lambda x: x["overall_score"], reverse=True)
            top_candidates = scored_candidates[:limit]
            
            if include_explanation:
                for candidate_data in top_candidates[:3]:
                    candidate_data["reasoning"] = explanation_service.explain_score(candidate_data)
                    
            return top_candidates

        finally:
            db.close()

matching_service = MatchingService()
