from sqlalchemy import Column, String, Text
from app.database import Base

class EpisodeModel(Base):
    __tablename__ = "episodes"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    nodes = Column(Text, default="[]")
    edges = Column(Text, default="[]")

class CharacterAssetModel(Base):
    __tablename__ = "character_assets"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    image = Column(String)
    role = Column(String, nullable=True)
    personality = Column(Text, nullable=True)
