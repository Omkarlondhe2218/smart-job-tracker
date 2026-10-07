import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    MapPin,
    BriefcaseBusiness,
    ExternalLink,
    Pencil,
    Trash2,
    X,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    LoaderCircle,
} from "lucide-react";

import {
    getJobs,
    createJob,
    updateJob,
    deleteJob,
} from "../services/jobService";

const emptyForm = {
    company_name: "",
    job_title: "",
    location: "",
    job_url: "",
    description: "",
    salary_min: "",
    salary_max: "",
    employment_type: "",
};

function Jobs() {
    const [jobs, setJobs] = useState([]);

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [employmentType, setEmploymentType] = useState("");

    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");

    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    const [formData, setFormData] = useState(emptyForm);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    const loadJobs = async () => {
        try {
            setIsLoading(true);
            setError("");

            const data = await getJobs({
                search: search || undefined,
                location: location || undefined,
                employment_type: employmentType || undefined,
                page,
                limit,
                sort_by: sortBy,
                sort_order: sortOrder,
            });

            console.log("Jobs response:", data);

            /*
             * Supports both:
             * { items: [], total: 0 }
             * and direct array responses.
             */
            if (Array.isArray(data)) {
                setJobs(data);
                setTotal(data.length);
            } else {
                setJobs(
                    data.items ||
                    data.jobs ||
                    data.results ||
                    []
                );

                setTotal(
                    data.total ??
                    data.total_count ??
                    data.count ??
                    0
                );
            }
        } catch (err) {
            console.error("Jobs error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to load jobs."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, [
        page,
        sortBy,
        sortOrder,
        search,
        location,
        employmentType,
    ]);

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const openCreateModal = () => {
        setEditingJob(null);
        setFormData(emptyForm);
        setShowModal(true);
    };

    const openEditModal = (job) => {
        setEditingJob(job);

        setFormData({
            company_name: job.company_name || "",
            job_title: job.job_title || "",
            location: job.location || "",
            job_url: job.job_url || "",
            description: job.description || "",
            salary_min: job.salary_min ?? "",
            salary_max: job.salary_max ?? "",
            employment_type: job.employment_type || "",
        });

        setShowModal(true);
    };

    const closeModal = () => {
        if (isSubmitting) return;

        setShowModal(false);
        setEditingJob(null);
        setFormData(emptyForm);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");

            const payload = {
                company_name: formData.company_name,
                job_title: formData.job_title,
                location: formData.location || null,
                job_url: formData.job_url || null,
                description: formData.description || null,
                salary_min:
                    formData.salary_min === ""
                        ? null
                        : Number(formData.salary_min),
                salary_max:
                    formData.salary_max === ""
                        ? null
                        : Number(formData.salary_max),
                employment_type:
                    formData.employment_type || null,
            };

            if (editingJob) {
                await updateJob(editingJob.id, payload);
            } else {
                await createJob(payload);
            }

            closeModal();

            await loadJobs();
        } catch (err) {
            console.error("Save job error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to save the job."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (jobId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmed) return;

        try {
            setDeleteId(jobId);
            setError("");

            await deleteJob(jobId);

            await loadJobs();
        } catch (err) {
            console.error("Delete job error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to delete the job."
            );
        } finally {
            setDeleteId(null);
        }
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
        setPage(1);
    };

    const handleEmploymentChange = (event) => {
        setEmploymentType(event.target.value);
        setPage(1);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        setPage(1);
    };

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
        setPage(1);
    };

    const clearFilters = () => {
        setSearch("");
        setLocation("");
        setEmploymentType("");
        setSortBy("created_at");
        setSortOrder("desc");
        setPage(1);
    };

    return (
        <div className="jobs-page">

            {/* HEADER */}

            <div className="jobs-header">

                <div>
                    <p className="page-eyebrow">
                        JOB MANAGEMENT
                    </p>

                    <h1>Jobs</h1>

                    <p>
                        Organize and manage the opportunities you're
                        interested in.
                    </p>
                </div>

                <button
                    className="primary-action-button"
                    onClick={openCreateModal}
                >
                    <Plus size={18} />
                    Add Job
                </button>

            </div>


            {/* ERROR */}

            {error && (
                <div className="jobs-error">
                    {error}

                    <button onClick={() => setError("")}>
                        <X size={16} />
                    </button>
                </div>
            )}


            {/* FILTERS */}

            <div className="jobs-toolbar">

                <div className="search-box">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search company or job title..."
                        value={search}
                        onChange={handleSearchChange}
                    />

                </div>


                <div className="filter-control">

                    <MapPin size={16} />

                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={handleLocationChange}
                    />

                </div>


                <select
                    value={employmentType}
                    onChange={handleEmploymentChange}
                    className="filter-select"
                >
                    <option value="">
                        All employment types
                    </option>

                    <option value="Full-time">
                        Full-time
                    </option>

                    <option value="Part-time">
                        Part-time
                    </option>

                    <option value="Internship">
                        Internship
                    </option>

                    <option value="Contract">
                        Contract
                    </option>
                </select>


                <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="filter-select"
                >
                    <option value="created_at">
                        Recently Added
                    </option>

                    <option value="salary_max">
                        Highest Salary
                    </option>

                    <option value="company_name">
                        Company Name
                    </option>
                </select>


                <select
                    value={sortOrder}
                    onChange={handleSortOrderChange}
                    className="filter-select sort-order-select"
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
                    onClick={clearFilters}
                    title="Clear filters"
                >
                    <SlidersHorizontal size={17} />
                    Clear
                </button>

            </div>


            {/* JOB COUNT */}

            <div className="jobs-list-header">

                <div>
                    <strong>
                        {total} {total === 1 ? "Job" : "Jobs"}
                    </strong>

                    <span>
                        {search ||
                            location ||
                            employmentType
                            ? " matching your filters"
                            : " in your tracker"}
                    </span>
                </div>

            </div>


            {/* CONTENT */}

            {isLoading ? (
                <div className="jobs-state">

                    <LoaderCircle
                        size={28}
                        className="spinner"
                    />

                    <p>Loading jobs...</p>

                </div>
            ) : jobs.length === 0 ? (
                <div className="jobs-empty">

                    <div className="jobs-empty-icon">
                        <BriefcaseBusiness size={28} />
                    </div>

                    <h2>No jobs found</h2>

                    <p>
                        Start building your job tracker by adding
                        your first opportunity.
                    </p>

                    <button
                        className="primary-action-button"
                        onClick={openCreateModal}
                    >
                        <Plus size={18} />
                        Add your first job
                    </button>

                </div>
            ) : (
                <div className="jobs-list">

                    {jobs.map((job) => (
                        <article
                            className="job-card"
                            key={job.id}
                        >

                            <div className="job-company-icon">
                                {job.company_name
                                    ?.charAt(0)
                                    .toUpperCase() || "J"}
                            </div>


                            <div className="job-main">

                                <div className="job-title-row">

                                    <div>
                                        <h2>{job.job_title}</h2>

                                        <p className="job-company">
                                            {job.company_name}
                                        </p>
                                    </div>

                                </div>


                                <div className="job-meta">

                                    {job.location && (
                                        <span>
                                            <MapPin size={14} />
                                            {job.location}
                                        </span>
                                    )}

                                    {job.employment_type && (
                                        <span>
                                            <BriefcaseBusiness size={14} />
                                            {job.employment_type}
                                        </span>
                                    )}

                                    {(job.salary_min ||
                                        job.salary_max) && (
                                            <span>
                                                ₹{" "}
                                                {job.salary_min ?? 0}
                                                {" - "}
                                                ₹{" "}
                                                {job.salary_max ?? 0}
                                            </span>
                                        )}

                                </div>

                            </div>


                            <div className="job-actions">

                                {job.job_url && (
                                    <a
                                        href={job.job_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="job-action-button"
                                        title="Open job posting"
                                    >
                                        <ExternalLink size={17} />
                                    </a>
                                )}

                                <button
                                    className="job-action-button"
                                    onClick={() => openEditModal(job)}
                                    title="Edit job"
                                >
                                    <Pencil size={17} />
                                </button>

                                <button
                                    className="job-action-button danger"
                                    onClick={() => handleDelete(job.id)}
                                    disabled={deleteId === job.id}
                                    title="Delete job"
                                >
                                    {deleteId === job.id ? (
                                        <LoaderCircle
                                            size={17}
                                            className="spinner"
                                        />
                                    ) : (
                                        <Trash2 size={17} />
                                    )}
                                </button>

                            </div>

                        </article>
                    ))}

                </div>
            )}


            {/* PAGINATION */}

            {!isLoading && jobs.length > 0 && (
                <div className="jobs-pagination">

                    <button
                        disabled={page <= 1}
                        onClick={() =>
                            setPage((previous) => previous - 1)
                        }
                    >
                        <ChevronLeft size={17} />
                        Previous
                    </button>

                    <span>
                        Page <strong>{page}</strong> of{" "}
                        <strong>{totalPages}</strong>
                    </span>

                    <button
                        disabled={page >= totalPages}
                        onClick={() =>
                            setPage((previous) => previous + 1)
                        }
                    >
                        Next
                        <ChevronRight size={17} />
                    </button>

                </div>
            )}


            {/* ADD / EDIT MODAL */}

            {showModal && (
                <div className="modal-backdrop">

                    <div className="job-modal">

                        <div className="modal-header">

                            <div>
                                <h2>
                                    {editingJob
                                        ? "Edit Job"
                                        : "Add New Job"}
                                </h2>

                                <p>
                                    {editingJob
                                        ? "Update the opportunity details."
                                        : "Add a new opportunity to your tracker."}
                                </p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={closeModal}
                                disabled={isSubmitting}
                            >
                                <X size={20} />
                            </button>

                        </div>


                        <form
                            className="job-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="form-grid">

                                <div className="job-form-group">
                                    <label>Company name *</label>

                                    <input
                                        name="company_name"
                                        value={formData.company_name}
                                        onChange={handleFormChange}
                                        placeholder="e.g. Deloitte"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>


                                <div className="job-form-group">
                                    <label>Job title *</label>

                                    <input
                                        name="job_title"
                                        value={formData.job_title}
                                        onChange={handleFormChange}
                                        placeholder="e.g. Data Analyst"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>


                                <div className="job-form-group">
                                    <label>Location</label>

                                    <input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleFormChange}
                                        placeholder="e.g. Pune"
                                        disabled={isSubmitting}
                                    />
                                </div>


                                <div className="job-form-group">
                                    <label>Employment type</label>

                                    <select
                                        name="employment_type"
                                        value={formData.employment_type}
                                        onChange={handleFormChange}
                                        disabled={isSubmitting}
                                    >
                                        <option value="">
                                            Select type
                                        </option>

                                        <option value="Full-time">
                                            Full-time
                                        </option>

                                        <option value="Part-time">
                                            Part-time
                                        </option>

                                        <option value="Internship">
                                            Internship
                                        </option>

                                        <option value="Contract">
                                            Contract
                                        </option>
                                    </select>

                                </div>


                                <div className="job-form-group">
                                    <label>Minimum salary</label>

                                    <input
                                        type="number"
                                        name="salary_min"
                                        value={formData.salary_min}
                                        onChange={handleFormChange}
                                        placeholder="e.g. 400000"
                                        min="0"
                                        disabled={isSubmitting}
                                    />
                                </div>


                                <div className="job-form-group">
                                    <label>Maximum salary</label>

                                    <input
                                        type="number"
                                        name="salary_max"
                                        value={formData.salary_max}
                                        onChange={handleFormChange}
                                        placeholder="e.g. 700000"
                                        min="0"
                                        disabled={isSubmitting}
                                    />
                                </div>

                            </div>


                            <div className="job-form-group">
                                <label>Job URL</label>

                                <input
                                    type="url"
                                    name="job_url"
                                    value={formData.job_url}
                                    onChange={handleFormChange}
                                    placeholder="https://company.com/job"
                                    disabled={isSubmitting}
                                />
                            </div>


                            <div className="job-form-group">
                                <label>Description</label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    placeholder="Add notes or the job description..."
                                    rows="5"
                                    disabled={isSubmitting}
                                />
                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-action-button"
                                    disabled={isSubmitting}
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
                                            <Plus size={17} />

                                            {editingJob
                                                ? "Update Job"
                                                : "Save Job"}
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

export default Jobs;