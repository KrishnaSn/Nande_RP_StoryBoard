import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DB_DIR = os.path.dirname(os.path.abspath(__file__))
# Default to local SQLite if DATABASE_URL is not set
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(DB_DIR, 'storyboard.db')}")

# Postgres connection URL might need specific arguments compared to SQLite
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
