"""
create guidance tables

Revision ID: 0001
Revises:
Create Date: 2026-09-22
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


REQUEST_STATUS_VALUES = (
    "NEW",
    "UNDER_REVIEW",
    "CONTACTED",
    "GUIDANCE_SCHEDULED",
    "COMPLETED",
    "NO_FURTHER_ACTION",
)


def upgrade() -> None:
    bind = op.get_bind()

    # Create the PostgreSQL enum only if it does not already exist.
    request_status_enum = postgresql.ENUM(
        *REQUEST_STATUS_VALUES,
        name="request_status",
    )

    request_status_enum.create(bind, checkfirst=True)

    # Admin users
    op.create_table(
        "admin_users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column(
            "is_active",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
        sa.UniqueConstraint("email"),
    )

    op.create_index(
        "ix_admin_users_email",
        "admin_users",
        ["email"],
    )

    # Guidance requests
    # create_type=False is important because the enum already exists.
    request_status_column_type = postgresql.ENUM(
        *REQUEST_STATUS_VALUES,
        name="request_status",
        create_type=False,
    )

    op.create_table(
        "guidance_requests",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "reference_number",
            sa.String(length=32),
            nullable=False,
        ),
        sa.Column(
            "full_name",
            sa.String(length=200),
            nullable=False,
        ),
        sa.Column(
            "mobile_number",
            sa.String(length=20),
            nullable=False,
        ),
        sa.Column(
            "male_deity",
            sa.String(length=200),
            nullable=False,
        ),
        sa.Column(
            "female_deity",
            sa.String(length=200),
            nullable=False,
        ),
        sa.Column(
            "status",
            request_status_column_type,
            nullable=False,
            server_default="NEW",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
        sa.UniqueConstraint("reference_number"),
    )

    op.create_index(
        "ix_guidance_requests_reference_number",
        "guidance_requests",
        ["reference_number"],
    )

    # Request activity
    op.create_table(
        "request_activity",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "request_id",
            sa.Integer(),
            sa.ForeignKey(
                "guidance_requests.id",
                ondelete="CASCADE",
            ),
            nullable=False,
        ),
        sa.Column(
            "admin_id",
            sa.Integer(),
            sa.ForeignKey(
                "admin_users.id",
                ondelete="SET NULL",
            ),
            nullable=True,
        ),
        sa.Column(
            "action",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
    )


def downgrade() -> None:
    op.drop_table("request_activity")

    op.drop_index(
        "ix_guidance_requests_reference_number",
        table_name="guidance_requests",
    )

    op.drop_table("guidance_requests")

    op.drop_index(
        "ix_admin_users_email",
        table_name="admin_users",
    )

    op.drop_table("admin_users")

    request_status_enum = postgresql.ENUM(
        *REQUEST_STATUS_VALUES,
        name="request_status",
    )

    request_status_enum.drop(op.get_bind(), checkfirst=True)