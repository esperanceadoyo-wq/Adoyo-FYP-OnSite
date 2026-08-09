import sys
from pathlib import Path

import pytest

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

from app import create_app
from app.extensions import db
from app.seed import seed_database


@pytest.fixture()
def app(tmp_path):
    application = create_app(
        {
            "TESTING": True,
            "SECRET_KEY": "test-key",
            "SQLALCHEMY_DATABASE_URI": "sqlite://",
            "AVATAR_UPLOAD_DIRECTORY": str(tmp_path / "avatars"),
        }
    )
    with application.app_context():
        db.create_all()
        seed_database()
        yield application
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def authenticated_client(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "demo@onsite.local", "password": "DemoPass123!"},
    )
    assert response.status_code == 200
    return client
