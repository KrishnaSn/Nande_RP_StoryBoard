from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from contextlib import asynccontextmanager
from app.database import engine, Base
from app.routes.story import router as story_router
from app.models.story import EpisodeModel, CharacterAssetModel

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables on startup
    Base.metadata.create_all(bind=engine)
    yield
    # Clean up on shutdown if needed

app = FastAPI(title="Nande RP StoryBoard API", lifespan=lifespan)

# Ensure uploads directory exists relative to app root
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
upload_dir = os.path.join(base_dir, "uploads")
if not os.path.exists(upload_dir):
    os.makedirs(upload_dir)

app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

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
    return {
        "status": "online",
        "message": "Nande RP StoryBoard Backend is running",
        "environment": os.getenv("ENVIRONMENT", "production")
    }

if __name__ == "__main__":
    import uvicorn
    # This part is a backup for local testing, Render uses the Start Command
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
