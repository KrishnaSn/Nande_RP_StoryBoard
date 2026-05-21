from pydantic import BaseModel, ConfigDict
from typing import List, Any, Optional
from datetime import datetime

class ArcBase(BaseModel):
    title: str
    description: str

class ArcCreate(ArcBase):
    id: str

class ArcUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    nodes: Optional[List[Any]] = None
    edges: Optional[List[Any]] = None

class Arc(ArcBase):
    id: str
    nodes: Any
    edges: Any
    model_config = ConfigDict(from_attributes=True)
