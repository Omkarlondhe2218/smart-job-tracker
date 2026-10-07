from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.user import User
from app.models.job import Job
from app.models.application import Application, ApplicationStatus

from app.schemas.dashboard import DashboardSummaryResponse

from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/api/v1/dashboard",
    tags=["Dashboard"]
)


# ============================================================
# DASHBOARD SUMMARY
# ============================================================

@router.get(
    "/summary",
    response_model=DashboardSummaryResponse
)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # --------------------------------------------------------
    # Total Jobs
    # --------------------------------------------------------

    total_jobs = (
        db.query(func.count(Job.id))
        .filter(
            Job.user_id == current_user.id
        )
        .scalar()
    )

    # --------------------------------------------------------
    # Total Applications
    # --------------------------------------------------------

    total_applications = (
        db.query(func.count(Application.id))
        .filter(
            Application.user_id == current_user.id
        )
        .scalar()
    )

    # --------------------------------------------------------
    # Applications grouped by status
    # --------------------------------------------------------

    status_counts = (
        db.query(
            Application.status,
            func.count(Application.id)
        )
        .filter(
            Application.user_id == current_user.id
        )
        .group_by(
            Application.status
        )
        .all()
    )

    # Convert query result into dictionary
    status_map = {
        status: count
        for status, count in status_counts
    }

    # --------------------------------------------------------
    # Applications by Status
    # --------------------------------------------------------

    applications_by_status = {
        "saved": status_map.get(
            ApplicationStatus.SAVED,
            0
        ),

        "applied": status_map.get(
            ApplicationStatus.APPLIED,
            0
        ),

        "shortlisted": status_map.get(
            ApplicationStatus.SHORTLISTED,
            0
        ),

        "assessment": status_map.get(
            ApplicationStatus.ASSESSMENT,
            0
        ),

        "interview": status_map.get(
            ApplicationStatus.INTERVIEW,
            0
        ),

        "offer": status_map.get(
            ApplicationStatus.OFFER,
            0
        ),

        "selected": status_map.get(
            ApplicationStatus.SELECTED,
            0
        ),

        "rejected": status_map.get(
            ApplicationStatus.REJECTED,
            0
        ),

        "withdrawn": status_map.get(
            ApplicationStatus.WITHDRAWN,
            0
        )
    }

    # --------------------------------------------------------
    # Important Counts
    # --------------------------------------------------------

    interview_count = applications_by_status["interview"]

    offer_count = applications_by_status["offer"]

    selected_count = applications_by_status["selected"]

    rejected_count = applications_by_status["rejected"]

    # --------------------------------------------------------
    # Dashboard Metrics
    # --------------------------------------------------------

    if total_applications > 0:

        interview_rate = (
            interview_count /
            total_applications
        ) * 100

        offer_rate = (
            offer_count /
            total_applications
        ) * 100

        selection_rate = (
            selected_count /
            total_applications
        ) * 100

        rejection_rate = (
            rejected_count /
            total_applications
        ) * 100

    else:

        interview_rate = 0.0
        offer_rate = 0.0
        selection_rate = 0.0
        rejection_rate = 0.0

    # --------------------------------------------------------
    # Return Dashboard Response
    # --------------------------------------------------------

    return {
        "total_jobs": total_jobs,

        "total_applications": total_applications,

        "applications_by_status": applications_by_status,

        "interview_count": interview_count,

        "offer_count": offer_count,

        "selected_count": selected_count,

        "rejected_count": rejected_count,

        "metrics": {
            "interview_rate": round(
                interview_rate,
                2
            ),

            "offer_rate": round(
                offer_rate,
                2
            ),

            "selection_rate": round(
                selection_rate,
                2
            ),

            "rejection_rate": round(
                rejection_rate,
                2
            )
        }
    }