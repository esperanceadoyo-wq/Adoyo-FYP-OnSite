from app.config import BACKEND_ROOT, Config


def test_default_database_path_is_anchored_to_backend(monkeypatch):
    monkeypatch.delenv("DATABASE_URL", raising=False)

    expected_path = (BACKEND_ROOT / "instance" / "onsite.db").as_posix()

    assert Config.database_uri() == f"sqlite:///{expected_path}"


def test_configured_database_url_takes_precedence(monkeypatch):
    database_url = "sqlite:///custom-onsite.db"
    monkeypatch.setenv("DATABASE_URL", database_url)

    assert Config.database_uri() == database_url
