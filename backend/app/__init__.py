import os

import click
from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import event
from sqlalchemy.engine import Engine

from .api import BLUEPRINTS
from .config import Config
from .extensions import db
from .seed import seed_database


@event.listens_for(Engine, "connect")
def enable_sqlite_foreign_keys(connection, _connection_record):
    cursor = connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


def create_app(test_config: dict | None = None) -> Flask:
    app = Flask(__name__, instance_relative_config=True)
    os.makedirs(app.instance_path, exist_ok=True)
    app.config.from_object(Config)
    app.config["SQLALCHEMY_DATABASE_URI"] = Config.database_uri(app.instance_path)
    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    CORS(
        app,
        origins=[app.config["FRONTEND_ORIGIN"]],
        supports_credentials=True,
    )

    for blueprint in BLUEPRINTS:
        app.register_blueprint(blueprint)

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "onsite-api"})

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": "Endpoint not found."}), 404

    @app.errorhandler(500)
    def internal_error(_error):
        db.session.rollback()
        return jsonify({"error": "An unexpected server error occurred."}), 500

    @app.cli.command("init-db")
    def init_db_command():
        db.create_all()
        click.echo("Initialized the OnSite database.")

    @app.cli.command("seed")
    def seed_command():
        db.create_all()
        seed_database()
        click.echo("Seeded demo spaces, achievements, and user.")

    return app
