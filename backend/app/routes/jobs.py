from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.job import Job
from app.models.user import User

from app.schemas.job import (
    JobCreate,
    JobUpdate,
    JobResponse,
    JobPaginationResponse
)

from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/api/v1/jobs",
    tags=["Jobs"]
)


# ============================================================
# CREATE JOB
# ============================================================

@router.post(
    "",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED
)
def create_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_job = Job(
        user_id=current_user.id,
        company_name=job_data.company_name,
        job_title=job_data.job_title,
        location=job_data.location,
        job_url=job_data.job_url,
        description=job_data.description,
        salary_min=job_data.salary_min,
        salary_max=job_data.salary_max,
        employment_type=job_data.employment_type
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


# ============================================================
# GET JOBS
# SEARCH + FILTER + SORT + PAGINATION
# ============================================================

@router.get(
    "",
    response_model=JobPaginationResponse
)
def get_jobs(
    search: str | None = None,
    location: str | None = None,
    employment_type: str | None = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # --------------------------------------------------------
    # Validate pagination parameters
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
        "created_at": Job.created_at,
        "updated_at": Job.updated_at,
        "company_name": Job.company_name,
        "job_title": Job.job_title,
        "salary_min": Job.salary_min,
        "salary_max": Job.salary_max
    }

    # --------------------------------------------------------
    # Validate sort_by
    # --------------------------------------------------------

    if sort_by not in allowed_sort_fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid sort_by. Allowed values: "
                "created_at, updated_at, company_name, "
                "job_title, salary_min, salary_max"
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
    # Only return jobs belonging to current user
    # --------------------------------------------------------

    query = (
        db.query(Job)
        .filter(
            Job.user_id == current_user.id
        )
    )

    # --------------------------------------------------------
    # Search by company name OR job title
    # --------------------------------------------------------

    if search:
        search_term = f"%{search}%"

        query = query.filter(
            (Job.company_name.ilike(search_term)) |
            (Job.job_title.ilike(search_term))
        )

    # --------------------------------------------------------
    # Filter by location
    # --------------------------------------------------------

    if location:
        query = query.filter(
            Job.location.ilike(
                f"%{location}%"
            )
        )

    # --------------------------------------------------------
    # Filter by employment type
    # --------------------------------------------------------

    if employment_type:
        query = query.filter(
            Job.employment_type.ilike(
                f"%{employment_type}%"
            )
        )

    # --------------------------------------------------------
    # Get total records BEFORE pagination
    # --------------------------------------------------------

    total = query.count()

    # --------------------------------------------------------
    # Calculate total pages
    #
    # Example:
    # total = 25
    # limit = 10
    #
    # pages = 3
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
    # Fetch paginated jobs
    # --------------------------------------------------------

    jobs = (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )

    # --------------------------------------------------------
    # Return paginated response
    # --------------------------------------------------------

    return {
        "items": jobs,
        "page": page,
        "limit": limit,
        "total": total,
        "pages": pages
    }


# ============================================================
# GET JOB BY ID
# ============================================================

@router.get(
    "/{job_id}",
    response_model=JobResponse
)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.user_id == current_user.id
        )
        .first()
    )

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    return job


# ============================================================
# UPDATE JOB
# ============================================================

@router.put(
    "/{job_id}",
    response_model=JobResponse
)
def update_job(
    job_id: int,
    job_data: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
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
    # Only update fields provided by the client
    # --------------------------------------------------------

    update_data = job_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)

    return job


# ============================================================
# DELETE JOB
# ============================================================

@router.delete(
    "/{job_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.user_id == current_user.id
        )
        .first()
    )

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    db.delete(job)
    db.commit()

    return None