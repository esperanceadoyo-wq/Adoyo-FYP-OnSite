"""add profile privacy preferences

Revision ID: 7f4a9d2c1b30
Revises: e3b2a904f581
"""

from alembic import op
import sqlalchemy as sa


revision = "7f4a9d2c1b30"
down_revision = "e3b2a904f581"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("user_profiles", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                "leaderboard_visible",
                sa.Boolean(),
                nullable=False,
                server_default=sa.true(),
            )
        )
        batch_op.add_column(
            sa.Column(
                "activity_visible",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
            )
        )


def downgrade():
    with op.batch_alter_table("user_profiles", schema=None) as batch_op:
        batch_op.drop_column("activity_visible")
        batch_op.drop_column("leaderboard_visible")
