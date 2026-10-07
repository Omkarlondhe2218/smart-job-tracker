from datetime import datetime
from pydantic import BaseModel, ConfigDict


class JobBase(BaseModel):
    company_name: str
    job_title: str
    location: str | None = None
    job_url: str | None = None
    description: str | None = None
    salary_min: int | None = None
    salary_max: int | None = None
    employment_type: str | None = None


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    company_name: str | None = None
    job_title: str | None = None
    location: str | None = None
    job_url: str | None = None
    description: str | None = None
    salary_min: int | None = None
    salary_max: int | None = None
    employment_type: str | None = None


class JobResponse(JobBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class JobPaginationResponse(BaseModel):
    items: list[JobResponse]
    page: int
    limit: int
    total: int
    pages: int