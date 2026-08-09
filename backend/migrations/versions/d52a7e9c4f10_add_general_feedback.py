"""add general feedback

Revision ID: d52a7e9c4f10
Revises: b284d6703f51
"""

from alembic import op
import sqlalchemy as sa


revision = "d52a7e9c4f10"
down_revision = "b284d6703f51"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "general_feedback",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("category", sa.String(length=30), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=True),
        sa.Column("page_path", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    with op.batch_alter_table("general_feedback", schema=None) as batch_op:
        batch_op.create_index(
            batch_op.f("ix_general_feedback_user_id"), ["user_id"], unique=False
        )


def downgrade():
    with op.batch_alter_table("general_feedback", schema=None) as batch_op:
        batch_op.drop_index(batch_op.f("ix_general_feedback_user_id"))
    op.drop_table("general_feedback")
