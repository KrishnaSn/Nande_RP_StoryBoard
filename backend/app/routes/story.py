import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.story import ArcModel
from app.schemas.story import Arc, ArcCreate, ArcUpdate
from datetime import datetime
from typing import Optional

router = APIRouter()

@router.get("/arcs", response_model=list[Arc])
def get_arcs(db: Session = Depends(get_db)):
    arcs = db.query(ArcModel).all()
    for arc in arcs:
        try:
            arc.nodes = json.loads(arc.nodes)
        except:
            arc.nodes = []
        try:
            arc.edges = json.loads(arc.edges)
        except:
            arc.edges = []
    return arcs

@router.post("/arcs", response_model=Arc)
def create_arc(arc: ArcCreate, db: Session = Depends(get_db)):
    db_arc = ArcModel(
        id=arc.id, 
        title=arc.title, 
        description=arc.description, 
        nodes="[]", 
        edges="[]"
    )
    db.add(db_arc)
    db.commit()
    db.refresh(db_arc)
    db_arc.nodes = []
    db_arc.edges = []
    return db_arc

@router.put("/arcs/{arc_id}", response_model=Arc)
def update_arc(arc_id: str, arc_update: ArcUpdate, user_id: Optional[str] = None, db: Session = Depends(get_db)):
    db_arc = db.query(ArcModel).filter(ArcModel.id == arc_id).first()
    if not db_arc:
        raise HTTPException(status_code=404, detail="Arc not found")
    
    # Update metadata
    if arc_update.title is not None:
        db_arc.title = arc_update.title
    if arc_update.description is not None:
        db_arc.description = arc_update.description

    # Update graph data
    if arc_update.nodes is not None:
        db_arc.nodes = json.dumps(arc_update.nodes)
    if arc_update.edges is not None:
        db_arc.edges = json.dumps(arc_update.edges)
    
    db.commit()
    db.refresh(db_arc)
    
    # Critical fix: Ensure returned data is parsed for the response model
    db_arc.nodes = json.loads(db_arc.nodes) if isinstance(db_arc.nodes, str) else db_arc.nodes
    db_arc.edges = json.loads(db_arc.edges) if isinstance(db_arc.edges, str) else db_arc.edges
    return db_arc

@router.delete("/arcs/{arc_id}")
def delete_arc(arc_id: str, db: Session = Depends(get_db)):
    db_arc = db.query(ArcModel).filter(ArcModel.id == arc_id).first()
    if not db_arc:
        raise HTTPException(status_code=404, detail="Arc not found")
    db.delete(db_arc)
    db.commit()
    return {"message": "Arc deleted successfully"}
