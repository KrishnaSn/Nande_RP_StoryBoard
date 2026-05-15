from pydantic import BaseModel, ConfigDict
from typing import List, Any, Optional

class EpisodeBase(BaseModel):
    title: str
    description: str

class EpisodeCreate(EpisodeBase):
    id: str

class EpisodeUpdate(BaseModel):
    nodes: Optional[List[Any]] = None
    edges: Optional[List[Any]] = None

class Episode(EpisodeBase):
    id: str
    nodes: Any
    edges: Any
    model_config = ConfigDict(from_attributes=True)

class CharacterAsset(BaseModel):
    id: str
    name: str
    image: str
    model_config = ConfigDict(from_attributes=True)
