from datetime import date, datetime
from enum import Enum

from sqlalchemy import (
    String,
    Text,
    Integer,
    Date,
    DateTime,
    ForeignKey,
    Enum as SQLEnum
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database.database import Base


class ApplicationStatus(str, Enum):
    SAVED = "SAVED"
    APPLIED = "APPLIED"
    SHORTLISTED = "SHORTLISTED"
    ASSESSMENT = "ASSESSMENT"
    INTERVIEW = "INTERVIEW"
    OFFER = "OFFER"
    SELECTED = "SELECTED"
    REJECTED = "REJECTED"
    WITHDRAWN = "WITHDRAWN"


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    # Owner of the application
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # Related job
    job_id: Mapped[int] = mapped_column(
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # Current application status
    status: Mapped[ApplicationStatus] = mapped_column(
        SQLEnum(ApplicationStatus),
        default=ApplicationStatus.SAVED,
        nullable=False,
        index=True
    )

    # Date on which application was submitted
    application_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    # Recruiter information
    recruiter_name: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    recruiter_email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    # Expected salary
    expected_salary: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    # Additional notes
    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    # Timestamps
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
        back_populates="applications"
    )

    job = relationship(
        "Job",
        back_populates="applications"
    )