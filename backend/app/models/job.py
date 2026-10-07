from datetime import datetime

from sqlalchemy import (
    String,
    Text,
    Integer,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    company_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    job_title: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    location: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    job_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    salary_min: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    salary_max: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    employment_type: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # --------------------------------------------------------
    # Relationships
    # --------------------------------------------------------

    user = relationship(
        "User",
        back_populates="jobs"
    )

    applications = relationship(
        "Application",
        back_populates="job",
        cascade="all, delete-orphan"
    )