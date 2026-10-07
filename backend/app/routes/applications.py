from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.application import (
    Application,
    ApplicationStatus
)
from app.models.job import Job
from app.models.user import User

from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationResponse,
    ApplicationPaginationResponse
)

from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/api/v1/applications",
    tags=["Applications"]
)


# ============================================================
# CREATE APPLICATION
# ============================================================

@router.post(
    "",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED
)
def create_application(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # --------------------------------------------------------
    # Verify that the job exists and belongs to current user
    # --------------------------------------------------------

    job = (
        db.query(Job)
        .filter(
            Job.id == application_data.job_id,
            Job.user_id == current_user.id
        )
        .first()
    )

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    # --------------------------------------------------------
    # Prevent duplicate application
    # --------------------------------------------------------

    existing_application = (
        db.query(Application)
        .filter(
            Application.job_id == application_data.job_id,
            Application.user_id == current_user.id
        )
        .first()
    )

    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Application already exists for this job"
        )

    # --------------------------------------------------------
    # Create application
    # --------------------------------------------------------

    new_application = Application(
        user_id=current_user.id,
        job_id=application_data.job_id,
        status=application_data.status,
        application_date=application_data.application_date,
        recruiter_name=application_data.recruiter_name,
        recruiter_email=application_data.recruiter_email,
        expected_salary=application_data.expected_salary,
        notes=application_data.notes
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application


# ============================================================
# GET APPLICATIONS
# FILTER + SORT + PAGINATION
# ============================================================

@router.get(
    "",
    response_model=ApplicationPaginationResponse
)
def get_applications(
    status_filter: str | None = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # --------------------------------------------------------
    # Validate pagination
    # --------------------------------------------------------

    if page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Page must be greater than or equal to 1"
        )

    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit must be between 1 and 100"
        )

    # --------------------------------------------------------
    # Allowed sorting fields
    # --------------------------------------------------------

    allowed_sort_fields = {
        "created_at": Application.created_at,
        "updated_at": Application.updated_at,
        "application_date": Application.application_date,
        "expected_salary": Application.expected_salary,
        "status": Application.status
    }

    # --------------------------------------------------------
    # Validate sort_by
    # --------------------------------------------------------

    if sort_by not in allowed_sort_fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid sort_by. Allowed values: "
                "created_at, updated_at, application_date, "
                "expected_salary, status"
            )
        )

    # --------------------------------------------------------
    # Validate sort_order
    # --------------------------------------------------------

    sort_order = sort_order.lower()

    if sort_order not in {"asc", "desc"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid sort_order. Allowed values: asc, desc"
        )

    # --------------------------------------------------------
    # Base query
    # Only return current user's applications
    # --------------------------------------------------------

    query = (
        db.query(Application)
        .filter(
            Application.user_id == current_user.id
        )
    )

    # --------------------------------------------------------
    # Validate and filter by status
    # --------------------------------------------------------

    if status_filter is not None:
        try:
            status_value = ApplicationStatus(
                status_filter.upper()
            )
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid application status"
            )

        query = query.filter(
            Application.status == status_value
        )

    # --------------------------------------------------------
    # Get total BEFORE pagination
    # --------------------------------------------------------

    total = query.count()

    # --------------------------------------------------------
    # Calculate total pages
    # --------------------------------------------------------

    pages = (total + limit - 1) // limit

    # --------------------------------------------------------
    # Apply sorting
    # --------------------------------------------------------

    sort_column = allowed_sort_fields[sort_by]

    if sort_order == "asc":
        query = query.order_by(
            sort_column.asc()
        )
    else:
        query = query.order_by(
            sort_column.desc()
        )

    # --------------------------------------------------------
    # Calculate offset
    # --------------------------------------------------------

    offset = (page - 1) * limit

    # --------------------------------------------------------
    # Fetch paginated applications
    # --------------------------------------------------------

    applications = (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )

    # --------------------------------------------------------
    # Return paginated response
    # --------------------------------------------------------

    return {
        "items": applications,
        "page": page,
        "limit": limit,
        "total": total,
        "pages": pages
    }


# ============================================================
# GET APPLICATION BY ID
# ============================================================

@router.get(
    "/{application_id}",
    response_model=ApplicationResponse
)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = (
        db.query(Application)
        .filter(
            Application.id == application_id,
            Application.user_id == current_user.id
        )
        .first()
    )

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    return application


# ============================================================
# UPDATE APPLICATION
# ============================================================

@router.put(
    "/{application_id}",
    response_model=ApplicationResponse
)
def update_application(
    application_id: int,
    application_data: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = (
        db.query(Application)
        .filter(
            Application.id == application_id,
            Application.user_id == current_user.id
        )
        .first()
    )

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    # --------------------------------------------------------
    # Update only fields provided by user
    # --------------------------------------------------------

    update_data = application_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(application, field, value)

    db.commit()
    db.refresh(application)

    return application


# ============================================================
# DELETE APPLICATION
# ============================================================

@router.delete(
    "/{application_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = (
        db.query(Application)
        .filter(
            Application.id == application_id,
            Application.user_id == current_user.id
        )
        .first()
    )

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    db.delete(application)
    db.commit()

    return None