"""add saved spaces

Revision ID: b284d6703f51
Revises: 7f4a9d2c1b30
"""

from alembic import op
import sqlalchemy as sa


revision = "b284d6703f51"
down_revision = "7f4a9d2c1b30"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "saved_spaces",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("space_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["space_id"], ["spaces.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "space_id", name="uq_saved_space_user_space"),
    )
    with op.batch_alter_table("saved_spaces", schema=None) as batch_op:
        batch_op.create_index(
            batch_op.f("ix_saved_spaces_space_id"), ["space_id"], unique=False
        )
        batch_op.create_index(
            batch_op.f("ix_saved_spaces_user_id"), ["user_id"], unique=False
        )


def downgrade():
    with op.batch_alter_table("saved_spaces", schema=None) as batch_op:
        batch_op.drop_index(batch_op.f("ix_saved_spaces_user_id"))
        batch_op.drop_index(batch_op.f("ix_saved_spaces_space_id"))
    op.drop_table("saved_spaces")
