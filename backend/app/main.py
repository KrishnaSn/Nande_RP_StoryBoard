from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from contextlib import asynccontextmanager
from app.database import engine, Base
from app.routes.story import router as story_router
from app.models.story import ArcModel

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Temporarily drop all to sync schema changes (locking system)
    Base.metadata.drop_all(bind=engine) 
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="Nande RP StoryBoard API", lifespan=lifespan)

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
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
