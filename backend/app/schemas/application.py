from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from app.models.application import ApplicationStatus


# ==============================
# CREATE APPLICATION
# ==============================

class ApplicationCreate(BaseModel):
    job_id: int
    status: ApplicationStatus = ApplicationStatus.SAVED
    application_date: date | None = None
    recruiter_name: str | None = None
    recruiter_email: str | None = None
    expected_salary: int | None = None
    notes: str | None = None


# ==============================
# UPDATE APPLICATION
# ==============================

class ApplicationUpdate(BaseModel):
    status: ApplicationStatus | None = None
    application_date: date | None = None
    recruiter_name: str | None = None
    recruiter_email: str | None = None
    expected_salary: int | None = None
    notes: str | None = None


# ==============================
# APPLICATION RESPONSE
# ==============================

class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    job_id: int
    status: ApplicationStatus
    application_date: date | None
    recruiter_name: str | None
    recruiter_email: str | None
    expected_salary: int | None
    notes: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==============================
# PAGINATION RESPONSE
# ==============================

class ApplicationPaginationResponse(BaseModel):
    items: list[ApplicationResponse]
    page: int
    limit: int
    total: int
    pages: int