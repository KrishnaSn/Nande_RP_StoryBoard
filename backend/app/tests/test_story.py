import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

# Use a separate test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_storyboard.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"
    assert "Nande RP StoryBoard" in response.json()["message"]

def test_create_arc():
    response = client.post(
        "/api/arcs",
        json={"id": "test-arc-1", "title": "Test Arc", "description": "Test Description"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "test-arc-1"
    assert data["title"] == "Test Arc"
    assert data["nodes"] == []
    assert data["edges"] == []

def test_get_arcs():
    client.post(
        "/api/arcs",
        json={"id": "test-arc-1", "title": "Test Arc", "description": "Test Description"}
    )
    response = client.get("/api/arcs")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == "test-arc-1"

def test_update_arc():
    client.post(
        "/api/arcs",
        json={"id": "test-arc-1", "title": "Test Arc", "description": "Test Description"}
    )
    response = client.put(
        "/api/arcs/test-arc-1",
        json={"nodes": [{"id": "node-1", "type": "scene"}], "edges": []}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["nodes"]) == 1
    assert data["nodes"][0]["id"] == "node-1"

def test_delete_arc():
    # Create arc
    client.post(
        "/api/arcs",
        json={"id": "delete-me", "title": "To Delete", "description": "Desc"}
    )
    # Delete it
    response = client.delete("/api/arcs/delete-me")
    assert response.status_code == 200
    assert response.json()["message"] == "Arc deleted successfully"
    # Verify it's gone
    get_res = client.get("/api/arcs")
    arcs = get_res.json()
    assert not any(ep["id"] == "delete-me" for ep in arcs)
