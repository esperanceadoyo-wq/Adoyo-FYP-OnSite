"""Prevent duplicate visit reflections

Revision ID: a81c6f74de20
Revises: 3806d2ad9b8c
Create Date: 2026-08-06 03:30:00.000000

"""
from alembic import op


revision = "a81c6f74de20"
down_revision = "3806d2ad9b8c"
branch_labels = None
depends_on = None


def upgrade():
    op.execute(
        "DELETE FROM reflections "
        "WHERE visit_id IS NOT NULL "
        "AND id NOT IN ("
        "SELECT MIN(id) FROM reflections "
        "WHERE visit_id IS NOT NULL GROUP BY visit_id"
        ")"
    )
    with op.batch_alter_table("reflections", schema=None) as batch_op:
        batch_op.create_unique_constraint("uq_reflections_visit_id", ["visit_id"])


def downgrade():
    with op.batch_alter_table("reflections", schema=None) as batch_op:
        batch_op.drop_constraint("uq_reflections_visit_id", type_="unique")
