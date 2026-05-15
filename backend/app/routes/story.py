import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.story import EpisodeModel, CharacterAssetModel
from app.schemas.story import Episode, EpisodeCreate, EpisodeUpdate, CharacterAsset

router = APIRouter()

@router.get("/episodes", response_model=list[Episode])
def get_episodes(db: Session = Depends(get_db)):
    episodes = db.query(EpisodeModel).all()
    for ep in episodes:
        try:
            ep.nodes = json.loads(ep.nodes)
        except:
            ep.nodes = []
        try:
            ep.edges = json.loads(ep.edges)
        except:
            ep.edges = []
    return episodes

@router.post("/episodes", response_model=Episode)
def create_episode(ep: EpisodeCreate, db: Session = Depends(get_db)):
    db_ep = EpisodeModel(id=ep.id, title=ep.title, description=ep.description, nodes="[]", edges="[]")
    db.add(db_ep)
    db.commit()
    db.refresh(db_ep)
    db_ep.nodes = []
    db_ep.edges = []
    return db_ep

@router.put("/episodes/{episode_id}", response_model=Episode)
def update_episode(episode_id: str, ep_update: EpisodeUpdate, db: Session = Depends(get_db)):
    db_ep = db.query(EpisodeModel).filter(EpisodeModel.id == episode_id).first()
    if not db_ep:
        raise HTTPException(status_code=404, detail="Episode not found")
    if ep_update.nodes is not None:
        db_ep.nodes = json.dumps(ep_update.nodes)
    if ep_update.edges is not None:
        db_ep.edges = json.dumps(ep_update.edges)
    db.commit()
    db.refresh(db_ep)
    db_ep.nodes = json.loads(db_ep.nodes)
    db_ep.edges = json.loads(db_ep.edges)
    return db_ep

@router.get("/characters", response_model=list[CharacterAsset])
def get_characters(db: Session = Depends(get_db)):
    return db.query(CharacterAssetModel).all()

@router.post("/characters", response_model=CharacterAsset)
def create_character(char: CharacterAsset, db: Session = Depends(get_db)):
    db_char = CharacterAssetModel(id=char.id, name=char.name, image=char.image)
    db.add(db_char)
    db.commit()
    db.refresh(db_char)
    return db_char
