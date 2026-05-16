import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.story import ArcModel
from app.schemas.story import Arc, ArcCreate, ArcUpdate, LockRequest
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
        edges="[]",
        locked_by=None,
        locked_at=None
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
    
    # Simple Lock Check
    if db_arc.locked_by and user_id != db_arc.locked_by:
        raise HTTPException(status_code=423, detail=f"Arc is locked by another user: {db_arc.locked_by}")

    if arc_update.nodes is not None:
        db_arc.nodes = json.dumps(arc_update.nodes)
    if arc_update.edges is not None:
        db_arc.edges = json.dumps(arc_update.edges)
    
    # We NO LONGER auto-unlock on save here to prevent race conditions during long sessions.
    # The frontend will call /unlock explicitly or it will stay locked while they work.
    
    db.commit()
    db.refresh(db_arc)
    
    # Critical fix: Ensure returned data is parsed for the response model
    db_arc.nodes = json.loads(db_arc.nodes) if isinstance(db_arc.nodes, str) else db_arc.nodes
    db_arc.edges = json.loads(db_arc.edges) if isinstance(db_arc.edges, str) else db_arc.edges
    return db_arc

@router.post("/arcs/{arc_id}/lock")
def lock_arc(arc_id: str, req: LockRequest, db: Session = Depends(get_db)):
    db_arc = db.query(ArcModel).filter(ArcModel.id == arc_id).first()
    if not db_arc:
        raise HTTPException(status_code=404, detail="Arc not found")
    
    # Check if lock is expired (e.g. 1 hour)
    is_expired = False
    if db_arc.locked_at:
        delta = datetime.utcnow() - db_arc.locked_at
        if delta.total_seconds() > 3600:
            is_expired = True

    if db_arc.locked_by and db_arc.locked_by != req.user_id and not is_expired:
        return {"status": "denied", "locked_by": db_arc.locked_by}
    
    db_arc.locked_by = req.user_id
    db_arc.locked_at = datetime.utcnow()
    db.commit()
    return {"status": "acquired"}

@router.post("/arcs/{arc_id}/unlock")
def unlock_arc(arc_id: str, req: LockRequest, db: Session = Depends(get_db)):
    db_arc = db.query(ArcModel).filter(ArcModel.id == arc_id).first()
    if not db_arc:
        raise HTTPException(status_code=404, detail="Arc not found")
    
    if db_arc.locked_by == req.user_id:
        db_arc.locked_by = None
        db_arc.locked_at = None
        db.commit()
    
    return {"status": "released"}

@router.delete("/arcs/{arc_id}")
def delete_arc(arc_id: str, db: Session = Depends(get_db)):
    db_arc = db.query(ArcModel).filter(ArcModel.id == arc_id).first()
    if not db_arc:
        raise HTTPException(status_code=404, detail="Arc not found")
    db.delete(db_arc)
    db.commit()
    return {"message": "Arc deleted successfully"}
