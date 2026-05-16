from pydantic import BaseModel, ConfigDict
from typing import List, Any, Optional
from datetime import datetime

class ArcBase(BaseModel):
    title: str
    description: str

class ArcCreate(ArcBase):
    id: str

class ArcUpdate(BaseModel):
    nodes: Optional[List[Any]] = None
    edges: Optional[List[Any]] = None

class Arc(ArcBase):
    id: str
    nodes: Any
    edges: Any
    locked_by: Optional[str] = None
    locked_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class LockRequest(BaseModel):
    user_id: str
