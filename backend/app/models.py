from datetime import datetime, timezone

from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def isoformat(value: datetime | None) -> str | None:
    if value is None:
        return None
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.isoformat()


class TimestampMixin:
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )


class User(TimestampMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="student")

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "role": self.role,
            "created_at": isoformat(self.created_at),
        }


class PasswordResetToken(db.Model):
    __tablename__ = "password_reset_tokens"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    token_hash = db.Column(db.String(64), nullable=False, unique=True, index=True)
    expires_at = db.Column(db.DateTime(timezone=True), nullable=False)
    used_at = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)


class UserProfile(TimestampMixin, db.Model):
    __tablename__ = "user_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    home_campus = db.Column(db.String(160))
    avatar_filename = db.Column(db.String(255))
    comfort_level = db.Column(db.String(30))
    preferred_social_intensity = db.Column(db.Integer)
    noise_tolerance = db.Column(db.String(30))
    current_mood = db.Column(db.String(40))
    learning_goals = db.Column(db.JSON, nullable=False, default=list)
    interests = db.Column(db.JSON, nullable=False, default=list)
    accessibility_needs = db.Column(db.JSON, nullable=False, default=list)
    preferred_space_types = db.Column(db.JSON, nullable=False, default=list)
    preferred_amenities = db.Column(db.JSON, nullable=False, default=list)
    location_consent = db.Column(db.Boolean, nullable=False, default=False)
    leaderboard_visible = db.Column(db.Boolean, nullable=False, default=True)
    activity_visible = db.Column(db.Boolean, nullable=False, default=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "home_campus": self.home_campus,
            "avatar_url": "/api/profile/avatar" if self.avatar_filename else None,
            "comfort_level": self.comfort_level,
            "preferred_social_intensity": self.preferred_social_intensity,
            "noise_tolerance": self.noise_tolerance,
            "current_mood": self.current_mood,
            "learning_goals": self.learning_goals or [],
            "interests": self.interests or [],
            "accessibility_needs": self.accessibility_needs or [],
            "preferred_space_types": self.preferred_space_types or [],
            "preferred_amenities": self.preferred_amenities or [],
            "location_consent": self.location_consent,
            "leaderboard_visible": self.leaderboard_visible,
            "activity_visible": self.activity_visible,
            "updated_at": isoformat(self.updated_at),
        }


class Space(TimestampMixin, db.Model):
    __tablename__ = "spaces"

    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(180), nullable=False, unique=True, index=True)
    name = db.Column(db.String(160), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False, index=True)
    address = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    amenities = db.Column(db.JSON, nullable=False, default=list)
    atmosphere_tags = db.Column(db.JSON, nullable=False, default=list)
    social_intensity = db.Column(db.Integer, nullable=False, default=2)
    noise_level = db.Column(db.String(30), nullable=False, default="moderate")
    cost_level = db.Column(db.Integer, nullable=False, default=1)
    opening_hours = db.Column(db.JSON, nullable=False, default=dict)
    safety_notes = db.Column(db.Text)
    cultural_notes = db.Column(db.Text)
    accessibility_features = db.Column(db.JSON, nullable=False, default=list)
    image_url = db.Column(db.String(2048))
    image_alt = db.Column(db.String(255))
    rating = db.Column(db.Float)
    is_active = db.Column(db.Boolean, nullable=False, default=True, index=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "slug": self.slug,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "address": self.address,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "amenities": self.amenities or [],
            "atmosphere_tags": self.atmosphere_tags or [],
            "social_intensity": self.social_intensity,
            "noise_level": self.noise_level,
            "cost_level": self.cost_level,
            "opening_hours": self.opening_hours or {},
            "safety_notes": self.safety_notes,
            "cultural_notes": self.cultural_notes,
            "accessibility_features": self.accessibility_features or [],
            "image_url": self.image_url,
            "image_alt": self.image_alt,
            "rating": self.rating,
            "is_active": self.is_active,
        }


class Visit(db.Model):
    __tablename__ = "visits"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    space_id = db.Column(
        db.Integer, db.ForeignKey("spaces.id", ondelete="CASCADE"), nullable=False, index=True
    )
    visited_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)
    verification_method = db.Column(db.String(30), nullable=False, default="manual")
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "space_id": self.space_id,
            "visited_at": isoformat(self.visited_at),
            "verification_method": self.verification_method,
        }


class Reflection(db.Model):
    __tablename__ = "reflections"
    __table_args__ = (
        db.UniqueConstraint("visit_id", name="uq_reflections_visit_id"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    space_id = db.Column(
        db.Integer, db.ForeignKey("spaces.id", ondelete="CASCADE"), nullable=False, index=True
    )
    visit_id = db.Column(
        db.Integer, db.ForeignKey("visits.id", ondelete="SET NULL"), index=True
    )
    comfort_rating = db.Column(db.Integer, nullable=False)
    social_rating = db.Column(db.Integer)
    learning_value_rating = db.Column(db.Integer)
    mood_before = db.Column(db.String(40))
    mood_after = db.Column(db.String(40))
    reflection_text = db.Column(db.Text)
    would_return = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "space_id": self.space_id,
            "visit_id": self.visit_id,
            "comfort_rating": self.comfort_rating,
            "social_rating": self.social_rating,
            "learning_value_rating": self.learning_value_rating,
            "mood_before": self.mood_before,
            "mood_after": self.mood_after,
            "reflection_text": self.reflection_text,
            "would_return": self.would_return,
            "created_at": isoformat(self.created_at),
        }


class Recommendation(db.Model):
    __tablename__ = "recommendations"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    space_id = db.Column(
        db.Integer, db.ForeignKey("spaces.id", ondelete="CASCADE"), nullable=False, index=True
    )
    score = db.Column(db.Float, nullable=False)
    reason = db.Column(db.Text, nullable=False)
    input_context = db.Column(db.JSON, nullable=False, default=dict)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "space_id": self.space_id,
            "score": self.score,
            "reason": self.reason,
            "input_context": self.input_context or {},
            "created_at": isoformat(self.created_at),
        }


class Achievement(db.Model):
    __tablename__ = "achievements"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), nullable=False, unique=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    points = db.Column(db.Integer, nullable=False, default=0)
    criteria = db.Column(db.JSON, nullable=False, default=dict)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "code": self.code,
            "name": self.name,
            "description": self.description,
            "points": self.points,
            "criteria": self.criteria or {},
        }


class UserAchievement(db.Model):
    __tablename__ = "user_achievements"
    __table_args__ = (
        db.UniqueConstraint("user_id", "achievement_id", name="uq_user_achievement"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    achievement_id = db.Column(
        db.Integer, db.ForeignKey("achievements.id", ondelete="CASCADE"), nullable=False
    )
    awarded_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)

    def to_dict(self, achievement: Achievement | None = None) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "achievement_id": self.achievement_id,
            "awarded_at": isoformat(self.awarded_at),
            "achievement": achievement.to_dict() if achievement else None,
        }
