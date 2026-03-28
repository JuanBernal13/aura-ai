from typing import List, Optional, Dict, Union
from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

class CandidateSkill(BaseModel):
    name: str
    proficiency: Optional[float] = 0.0
    years_exp: Optional[float] = 0.0

class Experience(BaseModel):
    company: str
    title: str
    start_date: Optional[str]
    end_date: Optional[str]
    description: Optional[str]

class CandidateEducation(BaseModel):
    institution: str
    degree: Optional[str] = None
    year: Optional[int] = None

class CandidateParsedData(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[EmailStr]
    skills: List[str] = []
    experience: List[Experience] = []
    education: List[CandidateEducation] = []

class CandidateBase(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    job_id: UUID

class CandidateCreate(CandidateBase):
    pass

class Candidate(CandidateBase):
    id: UUID
    parsing_status: str
    overall_score: float
    created_at: datetime

    class Config:
        from_attributes = True
