import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_ROOT / ".env")


class Config:
    BACKEND_PORT = int(os.getenv("BACKEND_PORT", "5001"))
    SECRET_KEY = os.getenv("SECRET_KEY", "onsite-local-development-key")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    JSON_SORT_KEYS = False
    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
    EXPOSE_PASSWORD_RESET_TOKEN = os.getenv(
        "EXPOSE_PASSWORD_RESET_TOKEN", "true"
    ).lower() in {"1", "true", "yes"}
    VISIT_VERIFICATION_RADIUS_METERS = float(
        os.getenv("VISIT_VERIFICATION_RADIUS_METERS", "150")
    )
    MAX_VISIT_ACCURACY_METERS = float(
        os.getenv("MAX_VISIT_ACCURACY_METERS", "250")
    )
    VISIT_DUPLICATE_WINDOW_HOURS = int(
        os.getenv("VISIT_DUPLICATE_WINDOW_HOURS", "6")
    )
    CHECK_IN_DISTANCE_EXEMPT_SLUGS = frozenset(
        slug.strip()
        for slug in os.getenv(
            "CHECK_IN_DISTANCE_EXEMPT_SLUGS",
            "cyberjaya-community-library",
        ).split(",")
        if slug.strip()
    )

    @staticmethod
    def database_uri(instance_path: str) -> str:
        configured_uri = os.getenv("DATABASE_URL")
        if configured_uri:
            return configured_uri

        database_path = Path(instance_path) / "onsite.db"
        return f"sqlite:///{database_path.as_posix()}"
