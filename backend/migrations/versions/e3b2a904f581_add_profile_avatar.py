"""Add profile avatar

Revision ID: e3b2a904f581
Revises: c6e28d541a7f
Create Date: 2026-08-08 14:15:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = "e3b2a904f581"
down_revision = "c6e28d541a7f"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("user_profiles", schema=None) as batch_op:
        batch_op.add_column(sa.Column("avatar_filename", sa.String(length=255), nullable=True))


def downgrade():
    with op.batch_alter_table("user_profiles", schema=None) as batch_op:
        batch_op.drop_column("avatar_filename")
