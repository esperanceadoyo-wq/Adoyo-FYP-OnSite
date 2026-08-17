from .admin_routes import admin_bp
from .auth_routes import auth_bp
from .chat_routes import chat_bp
from .feedback_routes import feedback_bp
from .profile_routes import profile_bp
from .progress_routes import progress_bp
from .recommendation_routes import recommendations_bp
from .saved_space_routes import saved_spaces_bp
from .space_routes import spaces_bp

BLUEPRINTS = (
    auth_bp,
    chat_bp,
    admin_bp,
    profile_bp,
    spaces_bp,
    recommendations_bp,
    saved_spaces_bp,
    feedback_bp,
    progress_bp,
)
