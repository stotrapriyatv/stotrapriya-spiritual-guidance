"""Add place to guidance requests

Revision ID: 0002_add_place_to_guidance_requests
Revises: 0001
Create Date: 2026-09-23
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "guidance_requests",
        sa.Column("place", sa.String(length=200), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("guidance_requests", "place")