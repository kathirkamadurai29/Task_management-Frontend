from pydantic import BaseModel, computed_field
from datetime import datetime
from typing import Optional
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: Optional[int] = None
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[int] = None
class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    creator_id: int
    creator_username: Optional[str] = None
    assigned_to: Optional[int]
    assigned_to_username: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True