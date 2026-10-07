import { useEffect, useState } from "react";
import {
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    XCircle,
    Send,
    TrendingUp,
    RefreshCw,
    Award,
    BarChart3,
} from "lucide-react";

import { getCurrentUser } from "../services/authService";
import { getDashboardSummary } from "../services/dashboardService";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [summary, setSummary] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setIsLoading(true);
            setError("");

            const [currentUser, dashboardData] = await Promise.all([
                getCurrentUser(),
                getDashboardSummary(),
            ]);

            console.log("Current User:", currentUser);
            console.log("Dashboard Summary:", dashboardData);

            setUser(currentUser);
            setSummary(dashboardData);
        } catch (err) {
            console.error("Dashboard error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to load your dashboard."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="dashboard-loader">
                    <RefreshCw size={24} className="spinner" />
                </div>

                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error-page">
                <div className="dashboard-error-icon">
                    <XCircle size={32} />
                </div>

                <h2>Something went wrong</h2>

                <p>{error}</p>

                <button onClick={loadDashboard}>
                    <RefreshCw size={17} />
                    Try again
                </button>
            </div>
        );
    }

    const totalJobs = summary?.total_jobs ?? 0;
    const totalApplications = summary?.total_applications ?? 0;
    const interviews = summary?.interview_count ?? 0;
    const offers = summary?.offer_count ?? 0;
    const selected = summary?.selected_count ?? 0;
    const rejected = summary?.rejected_count ?? 0;

    const metrics = summary?.metrics ?? {};

    const interviewRate = metrics.interview_rate ?? 0;
    const offerRate = metrics.offer_rate ?? 0;
    const selectionRate = metrics.selection_rate ?? 0;
    const rejectionRate = metrics.rejection_rate ?? 0;

    const statusData = summary?.applications_by_status ?? {};

    return (
        <div className="dashboard-page">

            {/* HEADER */}

            <header className="dashboard-header">

                <div>
                    <p className="dashboard-eyebrow">
                        SMART JOB TRACKER
                    </p>

                    <h1>
                        Welcome back, {user?.name || "there"} 👋
                    </h1>

                    <p className="dashboard-subtitle">
                        Here's an overview of your job search progress.
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={loadDashboard}
                >
                    <RefreshCw size={18} />
                    <span>Refresh</span>
                </button>

            </header>


            {/* STATISTICS */}

            <section className="dashboard-stats">

                <div className="stat-card">
                    <div className="stat-icon">
                        <BriefcaseBusiness size={21} />
                    </div>

                    <div>
                        <p>Total Jobs</p>
                        <h2>{totalJobs}</h2>
                        <span>Saved opportunities</span>
                    </div>
                </div>


                <div className="stat-card">
                    <div className="stat-icon">
                        <Send size={21} />
                    </div>

                    <div>
                        <p>Applications</p>
                        <h2>{totalApplications}</h2>
                        <span>Total applications</span>
                    </div>
                </div>


                <div className="stat-card">
                    <div className="stat-icon">
                        <Clock3 size={21} />
                    </div>

                    <div>
                        <p>Interviews</p>
                        <h2>{interviews}</h2>
                        <span>Interview stage</span>
                    </div>
                </div>


                <div className="stat-card">
                    <div className="stat-icon">
                        <CheckCircle2 size={21} />
                    </div>

                    <div>
                        <p>Selected</p>
                        <h2>{selected}</h2>
                        <span>Successful applications</span>
                    </div>
                </div>

            </section>


            {/* SECONDARY STATISTICS */}

            <section className="dashboard-secondary-stats">

                <div className="secondary-stat-card">

                    <div className="secondary-stat-icon">
                        <Award size={20} />
                    </div>

                    <div>
                        <span>Offers</span>
                        <strong>{offers}</strong>
                    </div>

                </div>


                <div className="secondary-stat-card">

                    <div className="secondary-stat-icon">
                        <XCircle size={20} />
                    </div>

                    <div>
                        <span>Rejected</span>
                        <strong>{rejected}</strong>
                    </div>

                </div>


                <div className="secondary-stat-card">

                    <div className="secondary-stat-icon">
                        <BarChart3 size={20} />
                    </div>

                    <div>
                        <span>Interview Rate</span>
                        <strong>{interviewRate}%</strong>
                    </div>

                </div>

            </section>


            {/* MAIN CONTENT */}

            <section className="dashboard-grid">


                {/* APPLICATION STATUS */}

                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>
                            <h2>Application Status</h2>

                            <p>
                                Breakdown of your current applications.
                            </p>
                        </div>

                        <TrendingUp size={21} />

                    </div>


                    <div className="status-list">

                        <StatusRow
                            label="Saved"
                            value={statusData.saved ?? 0}
                        />

                        <StatusRow
                            label="Applied"
                            value={statusData.applied ?? 0}
                        />

                        <StatusRow
                            label="Shortlisted"
                            value={statusData.shortlisted ?? 0}
                        />

                        <StatusRow
                            label="Assessment"
                            value={statusData.assessment ?? 0}
                        />

                        <StatusRow
                            label="Interview"
                            value={statusData.interview ?? 0}
                        />

                        <StatusRow
                            label="Offer"
                            value={statusData.offer ?? 0}
                        />

                        <StatusRow
                            label="Selected"
                            value={statusData.selected ?? 0}
                        />

                        <StatusRow
                            label="Rejected"
                            value={statusData.rejected ?? 0}
                        />

                    </div>

                </div>


                {/* PERFORMANCE */}

                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>
                            <h2>Performance</h2>

                            <p>
                                Your application conversion metrics.
                            </p>
                        </div>

                    </div>


                    <Metric
                        label="Interview Rate"
                        value={interviewRate}
                    />

                    <Metric
                        label="Offer Rate"
                        value={offerRate}
                    />

                    <Metric
                        label="Selection Rate"
                        value={selectionRate}
                    />

                    <Metric
                        label="Rejection Rate"
                        value={rejectionRate}
                    />

                </div>

            </section>

        </div>
    );
}


/* STATUS ROW */

function StatusRow({ label, value }) {
    return (
        <div className="status-row">

            <span>{label}</span>

            <div className="status-row-right">

                <div className="status-progress">
                    <div
                        className="status-progress-fill"
                        style={{
                            width: `${value > 0 ? Math.min(value * 10, 100) : 0}%`,
                        }}
                    />
                </div>

                <strong>{value}</strong>

            </div>

        </div>
    );
}


/* METRIC */

function Metric({ label, value }) {
    return (
        <div className="metric">

            <div className="metric-header">

                <span>{label}</span>

                <strong>{value}%</strong>

            </div>

            <div className="metric-bar">

                <div
                    className="metric-fill"
                    style={{
                        width: `${Math.min(value, 100)}%`,
                    }}
                />

            </div>

        </div>
    );
}


export default Dashboard;