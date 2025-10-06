from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class IdeaBase(BaseModel):
    title: str
    description: Optional[str] = ''
    tags: Optional[List[str]] = []
    custom_fields: Optional[Dict] = {}

class IdeaCreate(IdeaBase):
    position: Optional[int] = None

class IdeaUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    tags: Optional[List[str]]
    custom_fields: Optional[Dict]
    archived: Optional[bool]
    position: Optional[int]

class Idea(IdeaBase):
    id: int
    archived: bool
    position: Optional[int]
    created_at: Optional[datetime]

    class Config:
        orm_mode = True
