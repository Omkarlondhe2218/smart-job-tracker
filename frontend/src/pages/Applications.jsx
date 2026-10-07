import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    BriefcaseBusiness,
    ExternalLink,
    Pencil,
    Trash2,
    X,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    LoaderCircle,
    CalendarDays,
    IndianRupee,
    BadgeCheck,
    FileText,
} from "lucide-react";

import {
    getApplications,
    createApplication,
    updateApplication,
    deleteApplication,
} from "../services/applicationService";

import { getJobs } from "../services/jobService";

const STATUS_OPTIONS = [
    "SAVED",
    "APPLIED",
    "SHORTLISTED",
    "ASSESSMENT",
    "INTERVIEW",
    "OFFER",
    "SELECTED",
    "REJECTED",
    "WITHDRAWN",
];

const STATUS_LABELS = {
    SAVED: "Saved",
    APPLIED: "Applied",
    SHORTLISTED: "Shortlisted",
    ASSESSMENT: "Assessment",
    INTERVIEW: "Interview",
    OFFER: "Offer",
    SELECTED: "Selected",
    REJECTED: "Rejected",
    WITHDRAWN: "Withdrawn",
};

const emptyForm = {
    job_id: "",
    status: "APPLIED",
    application_date: "",
    expected_salary: "",
    notes: "",
};

function getTodayDate() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function Applications() {
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);

    const [statusFilter, setStatusFilter] = useState("");

    const [sortBy, setSortBy] = useState(
        "created_at"
    );

    const [sortOrder, setSortOrder] = useState(
        "desc"
    );

    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] = useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [editingApplication, setEditingApplication] =
        useState(null);

    const [formData, setFormData] =
        useState(emptyForm);

    const totalPages = Math.max(
        1,
        Math.ceil(total / limit)
    );

    /* =================================================
       LOAD JOBS
    ================================================= */

    const loadJobs = async () => {
        try {
            const data = await getJobs({
                page: 1,
                limit: 100,
                sort_by: "created_at",
                sort_order: "desc",
            });

            setJobs(data?.items ?? []);
        } catch (err) {
            console.error(
                "Jobs loading error:",
                err
            );
        }
    };

    /* =================================================
       LOAD APPLICATIONS
    ================================================= */

    const loadApplications = async () => {
        try {
            setIsLoading(true);
            setError("");

            const data = await getApplications({
                status_filter:
                    statusFilter || undefined,
                page,
                limit,
                sort_by: sortBy,
                sort_order: sortOrder,
            });

            console.log(
                "Applications response:",
                data
            );

            setApplications(
                data?.items ??
                data?.applications ??
                data?.results ??
                []
            );

            setTotal(
                data?.total ??
                data?.total_count ??
                data?.count ??
                0
            );
        } catch (err) {
            console.error(
                "Applications error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Unable to load applications."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, []);

    useEffect(() => {
        loadApplications();
    }, [
        page,
        statusFilter,
        sortBy,
        sortOrder,
    ]);

    /* =================================================
       SEARCH
       
       Search is handled on the already fetched page.
       It does not get sent to the backend because
       confirmed application API parameters are:
       status_filter, page, limit, sort_by, sort_order.
    ================================================= */

    const filteredApplications =
        applications.filter((application) => {
            const job = jobs.find(
                (item) =>
                    item.id ===
                    application.job_id
            );

            const company =
                job?.company_name ||
                application.company_name ||
                "";

            const title =
                job?.job_title ||
                application.job_title ||
                "";

            const searchText =
                `${company} ${title}`.toLowerCase();

            return searchText.includes(
                search.trim().toLowerCase()
            );
        });

    /* =================================================
       FORM
    ================================================= */

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    /* =================================================
       CREATE MODAL
    ================================================= */

    const openCreateModal = () => {
        setEditingApplication(null);

        setFormData({
            ...emptyForm,
            application_date: getTodayDate(),
        });

        setError("");
        setShowModal(true);
    };

    /* =================================================
       EDIT MODAL
    ================================================= */

    const openEditModal = (application) => {
        setEditingApplication(application);

        setFormData({
            job_id:
                application.job_id?.toString() ||
                "",
            status:
                application.status ||
                "APPLIED",
            application_date:
                application.application_date
                    ? application.application_date.slice(
                        0,
                        10
                    )
                    : "",
            expected_salary:
                application.expected_salary ??
                "",
            notes:
                application.notes ??
                "",
        });

        setError("");
        setShowModal(true);
    };

    /* =================================================
       CLOSE MODAL
    ================================================= */

    const closeModal = () => {
        if (isSubmitting) return;

        setShowModal(false);
        setEditingApplication(null);
        setFormData(emptyForm);
    };

    /* =================================================
       SUBMIT
    ================================================= */

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");

            if (!formData.job_id) {
                setError(
                    "Please select a job."
                );
                return;
            }

            const payload = {
                job_id: Number(
                    formData.job_id
                ),
                status: formData.status,

                application_date:
                    formData.application_date ||
                    null,

                expected_salary:
                    formData.expected_salary === ""
                        ? null
                        : Number(
                            formData.expected_salary
                        ),

                notes:
                    formData.notes.trim() ||
                    null,
            };

            if (editingApplication) {
                await updateApplication(
                    editingApplication.id,
                    payload
                );
            } else {
                await createApplication(
                    payload
                );
            }

            closeModal();

            await loadApplications();
        } catch (err) {
            console.error(
                "Save application error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Unable to save the application."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    /* =================================================
       DELETE
    ================================================= */

    const handleDelete = async (
        applicationId
    ) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this application?"
            );

        if (!confirmed) return;

        try {
            setError("");

            await deleteApplication(
                applicationId
            );

            await loadApplications();
        } catch (err) {
            console.error(
                "Delete application error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Unable to delete the application."
            );
        }
    };

    /* =================================================
       HELPERS
    ================================================= */

    const getJob = (application) => {
        return jobs.find(
            (job) =>
                job.id ===
                application.job_id
        );
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const formatSalary = (salary) => {
        if (
            salary === null ||
            salary === undefined
        ) {
            return "—";
        }

        return `₹${Number(
            salary
        ).toLocaleString("en-IN")}`;
    };

    const getStatusClass = (status) => {
        return `application-status application-status-${String(
            status || ""
        ).toLowerCase()}`;
    };

    return (
        <div className="applications-page">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="applications-header">

                <div>

                    <p className="page-eyebrow">
                        APPLICATION MANAGEMENT
                    </p>

                    <h1>
                        Applications
                    </h1>

                    <p>
                        Track and manage the jobs
                        you've applied for.
                    </p>

                </div>

                <button
                    className="primary-action-button"
                    onClick={
                        openCreateModal
                    }
                >
                    <Plus size={18} />
                    Add Application
                </button>

            </div>


            {/* =========================================
                ERROR
            ========================================= */}

            {error && (
                <div className="applications-error">

                    <span>{error}</span>

                    <button
                        onClick={() =>
                            setError("")
                        }
                    >
                        <X size={16} />
                    </button>

                </div>
            )}


            {/* =========================================
                FILTER TOOLBAR
            ========================================= */}

            <div className="applications-toolbar">

                <div className="search-box">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search company or job title..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                <select
                    value={statusFilter}
                    onChange={(event) => {
                        setStatusFilter(
                            event.target.value
                        );
                        setPage(1);
                    }}
                    className="filter-select"
                >
                    <option value="">
                        All statuses
                    </option>

                    {STATUS_OPTIONS.map(
                        (status) => (
                            <option
                                key={status}
                                value={status}
                            >
                                {
                                    STATUS_LABELS[
                                    status
                                    ]
                                }
                            </option>
                        )
                    )}
                </select>


                <select
                    value={sortBy}
                    onChange={(event) => {
                        setSortBy(
                            event.target.value
                        );
                        setPage(1);
                    }}
                    className="filter-select"
                >
                    <option value="created_at">
                        Recently Added
                    </option>

                    <option value="application_date">
                        Application Date
                    </option>

                    <option value="expected_salary">
                        Expected Salary
                    </option>
                </select>


                <select
                    value={sortOrder}
                    onChange={(event) => {
                        setSortOrder(
                            event.target.value
                        );
                        setPage(1);
                    }}
                    className="filter-select"
                >
                    <option value="desc">
                        Descending
                    </option>

                    <option value="asc">
                        Ascending
                    </option>
                </select>


                <button
                    className="clear-filter-button"
                    onClick={() => {
                        setSearch("");
                        setStatusFilter("");
                        setSortBy(
                            "created_at"
                        );
                        setSortOrder("desc");
                        setPage(1);
                    }}
                    title="Clear filters"
                >
                    <SlidersHorizontal size={17} />
                    Clear
                </button>

            </div>


            {/* =========================================
                LIST HEADER
            ========================================= */}

            <div className="applications-list-header">

                <div>

                    <strong>
                        {filteredApplications.length}{" "}
                        {filteredApplications.length ===
                            1
                            ? "Application"
                            : "Applications"}
                    </strong>

                    <span>
                        {search ||
                            statusFilter
                            ? " matching your filters"
                            : " in your tracker"}
                    </span>

                </div>

            </div>


            {/* =========================================
                CONTENT
            ========================================= */}

            {isLoading ? (

                <div className="applications-state">

                    <LoaderCircle
                        size={28}
                        className="spinner"
                    />

                    <p>
                        Loading applications...
                    </p>

                </div>

            ) : filteredApplications.length ===
                0 ? (

                <div className="applications-empty">

                    <div className="applications-empty-icon">
                        <ClipboardListIcon />
                    </div>

                    <h2>
                        No applications found
                    </h2>

                    <p>
                        Start tracking your job
                        applications by adding
                        your first application.
                    </p>

                    <button
                        className="primary-action-button"
                        onClick={
                            openCreateModal
                        }
                    >
                        <Plus size={18} />
                        Add your first application
                    </button>

                </div>

            ) : (

                <div className="applications-list">

                    {filteredApplications.map(
                        (application) => {

                            const job =
                                getJob(
                                    application
                                );

                            const company =
                                job?.company_name ||
                                application.company_name ||
                                "Unknown Company";

                            const title =
                                job?.job_title ||
                                application.job_title ||
                                "Job Position";

                            return (
                                <article
                                    className="application-card"
                                    key={
                                        application.id
                                    }
                                >

                                    <div className="application-company-icon">

                                        {company
                                            ?.charAt(
                                                0
                                            )
                                            .toUpperCase() ||
                                            "A"}

                                    </div>


                                    <div className="application-main">

                                        <div className="application-title-row">

                                            <div>

                                                <h2>
                                                    {title}
                                                </h2>

                                                <p className="application-company">
                                                    {company}
                                                </p>

                                            </div>

                                            <span
                                                className={getStatusClass(
                                                    application.status
                                                )}
                                            >
                                                <span className="application-status-dot" />

                                                {
                                                    STATUS_LABELS[
                                                    application.status
                                                    ] ||
                                                    application.status
                                                }
                                            </span>

                                        </div>


                                        <div className="application-meta">

                                            <span>
                                                <CalendarDays
                                                    size={14}
                                                />

                                                {
                                                    formatDate(
                                                        application.application_date
                                                    )
                                                }
                                            </span>

                                            <span>
                                                <IndianRupee
                                                    size={14}
                                                />

                                                {
                                                    formatSalary(
                                                        application.expected_salary
                                                    )
                                                }
                                            </span>

                                        </div>

                                    </div>


                                    <div className="application-actions">

                                        {job?.job_url && (
                                            <a
                                                href={
                                                    job.job_url
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="application-action-button"
                                                title="Open job posting"
                                            >
                                                <ExternalLink
                                                    size={17}
                                                />
                                            </a>
                                        )}

                                        <button
                                            className="application-action-button"
                                            onClick={() =>
                                                openEditModal(
                                                    application
                                                )
                                            }
                                            title="Edit application"
                                        >
                                            <Pencil
                                                size={17}
                                            />
                                        </button>

                                        <button
                                            className="application-action-button danger"
                                            onClick={() =>
                                                handleDelete(
                                                    application.id
                                                )
                                            }
                                            title="Delete application"
                                        >
                                            <Trash2
                                                size={17}
                                            />
                                        </button>

                                    </div>

                                </article>
                            );
                        }
                    )}

                </div>
            )}


            {/* =========================================
                PAGINATION
            ========================================= */}

            {!isLoading &&
                filteredApplications.length >
                0 && (
                    <div className="applications-pagination">

                        <button
                            disabled={
                                page <= 1
                            }
                            onClick={() =>
                                setPage(
                                    (
                                        previous
                                    ) =>
                                        previous -
                                        1
                                )
                            }
                        >
                            <ChevronLeft
                                size={17}
                            />
                            Previous
                        </button>

                        <span>
                            Page{" "}
                            <strong>
                                {page}
                            </strong>{" "}
                            of{" "}
                            <strong>
                                {totalPages}
                            </strong>
                        </span>

                        <button
                            disabled={
                                page >=
                                totalPages
                            }
                            onClick={() =>
                                setPage(
                                    (
                                        previous
                                    ) =>
                                        previous +
                                        1
                                )
                            }
                        >
                            Next
                            <ChevronRight
                                size={17}
                            />
                        </button>

                    </div>
                )}


            {/* =========================================
                ADD / EDIT APPLICATION MODAL
            ========================================= */}

            {showModal && (

                <div className="modal-backdrop">

                    <div className="job-modal">

                        <div className="modal-header">

                            <div>

                                <p className="page-eyebrow">
                                    APPLICATION
                                </p>

                                <h2>
                                    {editingApplication
                                        ? "Edit Application"
                                        : "Add New Application"}
                                </h2>

                                <p>
                                    {editingApplication
                                        ? "Update the application details."
                                        : "Add a new opportunity to your application tracker."}
                                </p>

                            </div>

                            <button
                                className="modal-close"
                                onClick={
                                    closeModal
                                }
                                disabled={
                                    isSubmitting
                                }
                            >
                                <X size={20} />
                            </button>

                        </div>


                        <form
                            className="job-form"
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="form-grid">

                                {/* JOB */}

                                <div className="job-form-group">

                                    <label>
                                        Job *
                                    </label>

                                    <div className="application-input-with-icon">

                                        <BriefcaseBusiness
                                            size={16}
                                        />

                                        <select
                                            name="job_id"
                                            value={
                                                formData.job_id
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            required
                                            disabled={
                                                isSubmitting
                                            }
                                        >
                                            <option value="">
                                                Select job
                                            </option>

                                            {jobs.map(
                                                (job) => (
                                                    <option
                                                        key={
                                                            job.id
                                                        }
                                                        value={
                                                            job.id
                                                        }
                                                    >
                                                        {
                                                            job.company_name
                                                        }{" "}
                                                        —{" "}
                                                        {
                                                            job.job_title
                                                        }
                                                    </option>
                                                )
                                            )}

                                        </select>

                                    </div>

                                </div>


                                {/* STATUS */}

                                <div className="job-form-group">

                                    <label>
                                        Application status
                                    </label>

                                    <div className="application-input-with-icon">

                                        <BadgeCheck
                                            size={16}
                                        />

                                        <select
                                            name="status"
                                            value={
                                                formData.status
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            disabled={
                                                isSubmitting
                                            }
                                        >
                                            {STATUS_OPTIONS.map(
                                                (
                                                    status
                                                ) => (
                                                    <option
                                                        key={
                                                            status
                                                        }
                                                        value={
                                                            status
                                                        }
                                                    >
                                                        {
                                                            STATUS_LABELS[
                                                            status
                                                            ]
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>

                                    </div>

                                </div>


                                {/* DATE */}

                                <div className="job-form-group">

                                    <label>
                                        Application date
                                    </label>

                                    <div className="application-input-with-icon">

                                        <CalendarDays
                                            size={16}
                                        />

                                        <input
                                            type="date"
                                            name="application_date"
                                            value={
                                                formData.application_date
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            disabled={
                                                isSubmitting
                                            }
                                        />

                                    </div>

                                </div>


                                {/* SALARY */}

                                <div className="job-form-group">

                                    <label>
                                        Expected salary
                                    </label>

                                    <div className="application-input-with-icon">

                                        <IndianRupee
                                            size={16}
                                        />

                                        <input
                                            type="number"
                                            name="expected_salary"
                                            value={
                                                formData.expected_salary
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            placeholder="e.g. 600000"
                                            min="0"
                                            disabled={
                                                isSubmitting
                                            }
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* NOTES */}

                            <div className="job-form-group">

                                <label>
                                    Notes
                                </label>

                                <div className="application-textarea">

                                    <FileText
                                        size={16}
                                    />

                                    <textarea
                                        name="notes"
                                        value={
                                            formData.notes
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="Add interview notes, recruiter details or follow-up information..."
                                        rows="5"
                                        disabled={
                                            isSubmitting
                                        }
                                    />

                                </div>

                            </div>


                            {/* ACTIONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-action-button"
                                    disabled={
                                        isSubmitting
                                    }
                                >
                                    {isSubmitting ? (
                                        <>
                                            <LoaderCircle
                                                size={17}
                                                className="spinner"
                                            />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Plus
                                                size={17}
                                            />

                                            {editingApplication
                                                ? "Update Application"
                                                : "Save Application"}
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}


/* Small reusable icon component */

function ClipboardListIcon() {
    return (
        <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect
                width="16"
                height="18"
                x="4"
                y="3"
                rx="2"
            />
            <path d="M9 3V2h6v1" />
            <path d="M8 8h8" />
            <path d="M8 12h8" />
            <path d="M8 16h5" />
        </svg>
    );
}

export default Applications;