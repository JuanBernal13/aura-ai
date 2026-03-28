from typing import Optional, List, Union
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class JobBase(BaseModel):
    title: str
    description: Optional[str]
    requirements: Optional[List[Union[str, dict]]] = []

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: UUID
    org_id: UUID
    created_by: UUID
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
