from pydantic import BaseModel


class ApplicationStatusSummary(BaseModel):
    saved: int
    applied: int
    shortlisted: int
    assessment: int
    interview: int
    offer: int
    selected: int
    rejected: int
    withdrawn: int


class DashboardMetrics(BaseModel):
    interview_rate: float
    offer_rate: float
    selection_rate: float
    rejection_rate: float


class DashboardSummaryResponse(BaseModel):
    total_jobs: int
    total_applications: int

    applications_by_status: ApplicationStatusSummary

    interview_count: int
    offer_count: int
    selected_count: int
    rejected_count: int

    metrics: DashboardMetrics