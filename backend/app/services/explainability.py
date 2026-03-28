from typing import Dict, Union, List
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from app.core.config import settings

class ExplanationService:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4-turbo-preview",
            openai_api_key=settings.OPENAI_API_KEY,
            temperature=0.7
        )
        self.prompt = PromptTemplate(
            template="""
            Analyze why this candidate received a score of {overall_score} for the job position.
            
            Data:
            - Vector Similarity Score: {vector_score} (matches overall context and experience)
            - Skill Match Score: {skill_score} (exact required skills matches)
            - Learning Potential Score: {potential_score} (GNN-predicted ability to learn missing skills)
            - Matched Skills count: {matches}
            
            Provide a concise, professional explanation for a hiring manager including:
            1. Strengths found in their profile.
            2. Logic behind their potential to fill missing skills.
            3. A final recommendation summary.
            """,
            input_variables=["overall_score", "vector_score", "skill_score", "potential_score", "matches"]
        )
        self.chain = self.prompt | self.llm

    def explain_score(self, score_data: Dict[str, Union[str, float, int]]) -> str:
        response = self.chain.invoke({
            "overall_score": score_data["overall_score"],
            "vector_score": score_data["vector_score"],
            "skill_score": score_data["skill_score"],
            "potential_score": score_data["potential_score"],
            "matches": score_data["matches"]
        })
        return response.content

explanation_service = ExplanationService()
