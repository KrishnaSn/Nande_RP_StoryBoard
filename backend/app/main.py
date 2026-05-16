from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.database import engine, Base
from app.routes.story import router as story_router
from app.models.story import EpisodeModel, CharacterAssetModel

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nande RP StoryBoard API")

# Ensure uploads directory exists
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://nande-storyboard.netlify.app",
        "https://nande-rp-storyboard.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(story_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "FiveM Story Engine Backend Running"}
