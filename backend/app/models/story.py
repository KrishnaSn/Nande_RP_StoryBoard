from sqlalchemy import Column, String, Text
from app.database import Base

class ArcModel(Base):
    __tablename__ = "arcs"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    nodes = Column(Text, default="[]")
    edges = Column(Text, default="[]")
