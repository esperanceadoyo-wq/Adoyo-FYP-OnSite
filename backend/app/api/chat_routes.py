from flask import Blueprint, jsonify, request, session

from ..extensions import db
from ..models import User
from ..services.chat_service import INTENTS, answer_question

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")
INTENT_KEYS = {intent.key for intent in INTENTS}


@chat_bp.post("")
def chat():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Request body must be a JSON object."}), 400

    message = payload.get("message")
    if not isinstance(message, str) or not message.strip():
        return jsonify({"error": "message must be a non-empty string."}), 400
    message = message.strip()
    if len(message) > 500:
        return jsonify({"error": "message cannot exceed 500 characters."}), 400

    context_intent = payload.get("context_intent")
    if context_intent is not None and (
        not isinstance(context_intent, str) or context_intent not in INTENT_KEYS
    ):
        return jsonify({"error": "context_intent is not recognized."}), 400

    page_path = payload.get("page_path")
    if page_path is not None and (
        not isinstance(page_path, str) or len(page_path) > 255
    ):
        return jsonify({"error": "page_path must be a short string."}), 400

    user_id = session.get("user_id")
    user = db.session.get(User, user_id) if user_id else None
    if user_id and user is None:
        session.clear()

    return jsonify(
        answer_question(
            message,
            context_intent=context_intent,
            page_path=page_path,
            user=user,
        )
    )
