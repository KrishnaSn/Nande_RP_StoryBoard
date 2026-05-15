from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes.story import router as story_router
from app.models.story import EpisodeModel, CharacterAssetModel

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nande RP StoryBoard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(story_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "FiveM Story Engine Backend Running"}
