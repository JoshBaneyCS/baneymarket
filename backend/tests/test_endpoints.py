import pytest
from fastapi.testclient import TestClient
from app.main import app
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db import Base, get_db

# Setup a test database (e.g., SQLite in-memory) for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency override to use the test DB session
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create the database schema in the test DB
Base.metadata.create_all(bind=engine)

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_register():
    response = client.post("/auth/register", json={
        "first_name": "John",
        "last_name": "Doe",
        "username": "johndoe",
        "email": "johndoe@example.com",
        "cell_number": "1234567890",
        "password": "password123",
        "date_of_birth": "1990-01-01",
        "address": "123 Main St",
        "country": "USA",
        "theme_preference": True
    })
    assert response.status_code == 200
    assert response.json()["message"] == "User registered successfully"

def test_login():
    # Login with the user created above
    response = client.post("/auth/login", json={
        "identifier": "johndoe",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_get_user_me():
    # Get token
    login_resp = client.post("/auth/login", json={
        "identifier": "johndoe",
        "password": "password123"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/user/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "johndoe"

def test_update_user_me():
    # Get token
    login_resp = client.post("/auth/login", json={
        "identifier": "johndoe",
        "password": "password123"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Update user info
    update_resp = client.patch("/user/me", json={"address": "456 Park Ave", "theme_preference": False}, headers=headers)
    assert update_resp.status_code == 200
    assert update_resp.json()["message"] == "User updated successfully"

    # Verify changes
    user_resp = client.get("/user/me", headers=headers)
    assert user_resp.status_code == 200
    data = user_resp.json()
    assert data["address"] == "456 Park Ave"
    assert data["theme_preference"] == False
