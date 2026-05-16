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

def test_upload_image():
    # Create a dummy file for testing
    import io
    file_content = b"fake image content"
    file = io.BytesIO(file_content)
    
    response = client.post(
        "/api/upload",
        files={"file": ("test image.jpg", file, "image/jpeg")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "url" in data
    # Ensure filename was cleaned (space replaced by underscore)
    assert "test_image.jpg" in data["url"]

def test_create_episode():
    response = client.post(
        "/api/episodes",
        json={"id": "test-ep-1", "title": "Test Episode", "description": "Test Description"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "test-ep-1"
    assert data["title"] == "Test Episode"
    assert data["nodes"] == []
    assert data["edges"] == []

def test_get_episodes():
    client.post(
        "/api/episodes",
        json={"id": "test-ep-1", "title": "Test Episode", "description": "Test Description"}
    )
    response = client.get("/api/episodes")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == "test-ep-1"

def test_update_episode():
    client.post(
        "/api/episodes",
        json={"id": "test-ep-1", "title": "Test Episode", "description": "Test Description"}
    )
    response = client.put(
        "/api/episodes/test-ep-1",
        json={"nodes": [{"id": "node-1", "type": "scene"}], "edges": []}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["nodes"]) == 1
    assert data["nodes"][0]["id"] == "node-1"

def test_delete_episode():
    # Create episode
    client.post(
        "/api/episodes",
        json={"id": "delete-me", "title": "To Delete", "description": "Desc"}
    )
    # Delete it
    response = client.delete("/api/episodes/delete-me")
    assert response.status_code == 200
    assert response.json()["message"] == "Episode deleted successfully"
    # Verify it's gone
    get_res = client.get("/api/episodes")
    episodes = get_res.json()
    assert not any(ep["id"] == "delete-me" for ep in episodes)

def test_create_character():
    response = client.post(
        "/api/characters",
        json={
            "id": "char-1", 
            "name": "Test Char", 
            "image": "test.jpg",
            "role": "Protagonist",
            "personality": "Brave and loyal"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Char"
    assert data["role"] == "Protagonist"
    assert data["personality"] == "Brave and loyal"

def test_get_characters():
    client.post(
        "/api/characters",
        json={"id": "char-1", "name": "Test Char", "image": "test.jpg"}
    )
    response = client.get("/api/characters")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Test Char"
