import { useEffect, useMemo, useState } from "react";
import {
    RefreshCw,
    TrendingUp,
    BriefcaseBusiness,
    ClipboardList,
    CalendarDays,
    BadgeCheck,
    Target,
    CircleX,
} from "lucide-react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

import {
    getAnalyticsSummary,
    getAnalyticsApplications,
} from "../services/analyticsService";

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

function Analytics() {
    const [summary, setSummary] = useState(null);
    const [applications, setApplications] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAnalytics = async () => {
        try {
            setIsLoading(true);
            setError("");

            const [
                summaryData,
                applicationsData,
            ] = await Promise.all([
                getAnalyticsSummary(),
                getAnalyticsApplications(),
            ]);

            console.log(
                "Analytics summary:",
                summaryData
            );

            console.log(
                "Analytics applications:",
                applicationsData
            );

            setSummary(summaryData);

            setApplications(
                applicationsData?.items ??
                applicationsData?.applications ??
                applicationsData?.results ??
                []
            );
        } catch (err) {
            console.error(
                "Analytics error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Unable to load analytics."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, []);

    /* =========================================
       SUMMARY VALUES
    ========================================= */

    const totalJobs =
        summary?.total_jobs ?? 0;

    const totalApplications =
        summary?.total_applications ?? 0;

    const interviews =
        summary?.interview_count ?? 0;

    const offers =
        summary?.offer_count ?? 0;

    const selected =
        summary?.selected_count ?? 0;

    const rejected =
        summary?.rejected_count ?? 0;

    const metrics =
        summary?.metrics ?? {};

    const interviewRate =
        metrics.interview_rate ?? 0;

    const offerRate =
        metrics.offer_rate ?? 0;

    const selectionRate =
        metrics.selection_rate ?? 0;

    const rejectionRate =
        metrics.rejection_rate ?? 0;

    /* =========================================
       STATUS DATA
    ========================================= */

    const statusData = useMemo(() => {
        const source =
            summary?.applications_by_status ??
            {};

        return Object.entries(source)
            .map(
                ([status, count]) => ({
                    name:
                        STATUS_LABELS[
                        status.toUpperCase()
                        ] ||
                        status,
                    value: Number(count) || 0,
                    status,
                })
            )
            .filter(
                (item) =>
                    item.value > 0
            );
    }, [summary]);

    /* =========================================
       STATUS BAR DATA
    ========================================= */

    const funnelData = useMemo(() => {
        const source =
            summary?.applications_by_status ??
            {};

        return [
            "SAVED",
            "APPLIED",
            "SHORTLISTED",
            "ASSESSMENT",
            "INTERVIEW",
            "OFFER",
            "SELECTED",
        ].map((status) => ({
            name:
                STATUS_LABELS[status],
            value:
                Number(
                    source[status.toLowerCase()]
                ) || 0,
        }));
    }, [summary]);

    /* =========================================
       COMPANY DATA
    ========================================= */

    const companyData = useMemo(() => {
        const counts = {};

        applications.forEach(
            (application) => {
                const company =
                    application.company_name ||
                    "Unknown";

                counts[company] =
                    (counts[company] || 0) +
                    1;
            }
        );

        return Object.entries(counts)
            .map(
                ([company, count]) => ({
                    company,
                    applications: count,
                })
            )
            .sort(
                (a, b) =>
                    b.applications -
                    a.applications
            )
            .slice(0, 7);
    }, [applications]);

    /* =========================================
       INSIGHT
    ========================================= */

    const topStatus = useMemo(() => {
        if (!statusData.length) {
            return null;
        }

        return [...statusData].sort(
            (a, b) =>
                b.value - a.value
        )[0];
    }, [statusData]);

    if (isLoading) {
        return (
            <div className="analytics-page">

                <div className="analytics-loading">

                    <RefreshCw
                        size={30}
                        className="analytics-spinner"
                    />

                    <h2>
                        Loading analytics...
                    </h2>

                    <p>
                        Preparing your application
                        insights.
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="analytics-page">

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="analytics-header">

                <div>

                    <p className="page-eyebrow">
                        PERFORMANCE ANALYTICS
                    </p>

                    <h1>
                        Analytics
                    </h1>

                    <p>
                        Understand your job search
                        performance and application
                        progress.
                    </p>

                </div>

                <button
                    className="primary-action-button"
                    onClick={loadAnalytics}
                >
                    <RefreshCw size={17} />
                    Refresh Analytics
                </button>

            </div>


            {/* =====================================
                ERROR
            ===================================== */}

            {error && (
                <div className="analytics-error">

                    <span>{error}</span>

                    <button
                        onClick={() =>
                            setError("")
                        }
                    >
                        <CircleX size={17} />
                    </button>

                </div>
            )}


            {/* =====================================
                TOP METRICS
            ===================================== */}

            <div className="analytics-metrics">

                <div className="analytics-metric-card">

                    <div className="analytics-metric-icon">
                        <BriefcaseBusiness size={19} />
                    </div>

                    <div>
                        <span>
                            Total Jobs
                        </span>

                        <strong>
                            {totalJobs}
                        </strong>
                    </div>

                </div>


                <div className="analytics-metric-card">

                    <div className="analytics-metric-icon">
                        <ClipboardList size={19} />
                    </div>

                    <div>
                        <span>
                            Applications
                        </span>

                        <strong>
                            {totalApplications}
                        </strong>
                    </div>

                </div>


                <div className="analytics-metric-card">

                    <div className="analytics-metric-icon">
                        <CalendarDays size={19} />
                    </div>

                    <div>
                        <span>
                            Interviews
                        </span>

                        <strong>
                            {interviews}
                        </strong>
                    </div>

                </div>


                <div className="analytics-metric-card">

                    <div className="analytics-metric-icon">
                        <BadgeCheck size={19} />
                    </div>

                    <div>
                        <span>
                            Selected
                        </span>

                        <strong>
                            {selected}
                        </strong>
                    </div>

                </div>

            </div>


            {/* =====================================
                ANALYTICS GRID
            ===================================== */}

            <div className="analytics-grid">

                {/* STATUS DISTRIBUTION */}

                <section className="analytics-card analytics-chart-card">

                    <div className="analytics-card-header">

                        <div>

                            <h2>
                                Application Distribution
                            </h2>

                            <p>
                                Current applications
                                by status.
                            </p>

                        </div>

                        <div className="analytics-header-icon">
                            <ClipboardList size={18} />
                        </div>

                    </div>


                    {statusData.length > 0 ? (
                        <div className="analytics-pie-layout">

                            <div className="analytics-pie-chart">

                                <ResponsiveContainer
                                    width="100%"
                                    height={240}
                                >
                                    <PieChart>

                                        <Pie
                                            data={
                                                statusData
                                            }
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={95}
                                            paddingAngle={3}
                                        >
                                            {statusData.map(
                                                (
                                                    entry,
                                                    index
                                                ) => (
                                                    <Cell
                                                        key={
                                                            `${entry.status}-${index}`
                                                        }
                                                        fill={
                                                            [
                                                                "#4f46e5",
                                                                "#6366f1",
                                                                "#818cf8",
                                                                "#a78bfa",
                                                                "#8b5cf6",
                                                                "#10b981",
                                                                "#16a34a",
                                                                "#ef4444",
                                                            ][
                                                            index %
                                                            8
                                                            ]
                                                        }
                                                    />
                                                )
                                            )}
                                        </Pie>

                                        <Tooltip />

                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="analytics-pie-center">

                                    <strong>
                                        {
                                            totalApplications
                                        }
                                    </strong>

                                    <span>
                                        Applications
                                    </span>

                                </div>

                            </div>


                            <div className="analytics-legend">

                                {statusData.map(
                                    (item) => (
                                        <div
                                            className="analytics-legend-item"
                                            key={
                                                item.status
                                            }
                                        >

                                            <span>
                                                {
                                                    item.name
                                                }
                                            </span>

                                            <strong>
                                                {
                                                    item.value
                                                }
                                            </strong>

                                        </div>
                                    )
                                )}

                            </div>

                        </div>
                    ) : (

                        <div className="analytics-no-data">
                            No application data available yet.
                        </div>

                    )}

                </section>


                {/* PERFORMANCE */}

                <section className="analytics-card">

                    <div className="analytics-card-header">

                        <div>

                            <h2>
                                Conversion Metrics
                            </h2>

                            <p>
                                Your current application
                                funnel performance.
                            </p>

                        </div>

                        <div className="analytics-header-icon">
                            <TrendingUp size={18} />
                        </div>

                    </div>


                    <div className="analytics-performance">

                        <MetricBar
                            label="Interview Rate"
                            value={
                                interviewRate
                            }
                        />

                        <MetricBar
                            label="Offer Rate"
                            value={
                                offerRate
                            }
                        />

                        <MetricBar
                            label="Selection Rate"
                            value={
                                selectionRate
                            }
                        />

                        <MetricBar
                            label="Rejection Rate"
                            value={
                                rejectionRate
                            }
                        />

                    </div>


                    <div className="analytics-performance-footer">

                        <Target size={17} />

                        <span>
                            Focus on improving your
                            application-to-interview
                            conversion.
                        </span>

                    </div>

                </section>


                {/* APPLICATION FUNNEL */}

                <section className="analytics-card analytics-wide-card">

                    <div className="analytics-card-header">

                        <div>

                            <h2>
                                Application Funnel
                            </h2>

                            <p>
                                Track how applications
                                progress through each stage.
                            </p>

                        </div>

                    </div>


                    <div className="analytics-bar-chart">

                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <BarChart
                                data={funnelData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -15,
                                    bottom: 5,
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e2e8f0"
                                />

                                <XAxis
                                    dataKey="name"
                                    tick={{
                                        fill: "#64748b",
                                        fontSize: 11,
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    allowDecimals={false}
                                    tick={{
                                        fill: "#64748b",
                                        fontSize: 11,
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="value"
                                    fill="#4f46e5"
                                    radius={[
                                        6,
                                        6,
                                        0,
                                        0,
                                    ]}
                                    barSize={34}
                                />

                            </BarChart>
                        </ResponsiveContainer>

                    </div>

                </section>


                {/* COMPANY BREAKDOWN */}

                <section className="analytics-card">

                    <div className="analytics-card-header">

                        <div>

                            <h2>
                                Applications by Company
                            </h2>

                            <p>
                                Companies receiving
                                the most attention.
                            </p>

                        </div>

                        <div className="analytics-header-icon">
                            <BriefcaseBusiness size={18} />
                        </div>

                    </div>


                    {companyData.length > 0 ? (

                        <div className="analytics-company-list">

                            {companyData.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <div
                                        className="analytics-company-row"
                                        key={
                                            item.company
                                        }
                                    >

                                        <div className="analytics-company-rank">
                                            {index + 1}
                                        </div>

                                        <div className="analytics-company-info">

                                            <strong>
                                                {
                                                    item.company
                                                }
                                            </strong>

                                            <div className="analytics-company-progress">

                                                <span
                                                    style={{
                                                        width: `${Math.min(
                                                            (item.applications /
                                                                Math.max(
                                                                    ...companyData.map(
                                                                        (
                                                                            company
                                                                        ) =>
                                                                            company.applications
                                                                    )
                                                                )) *
                                                            100,
                                                            100
                                                        )
                                                            }%`,
                                                    }}
                                                />

                                            </div>

                                        </div>

                                        <strong className="analytics-company-count">
                                            {
                                                item.applications
                                            }
                                        </strong>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="analytics-no-data">
                            No company data available yet.
                        </div>

                    )}

                </section>


                {/* SEARCH INSIGHT */}

                <section className="analytics-card analytics-insight-card">

                    <div className="analytics-insight-icon">
                        <Target size={21} />
                    </div>

                    <div>

                        <p>
                            YOUR CURRENT INSIGHT
                        </p>

                        <h2>
                            {topStatus
                                ? `${topStatus.name} is currently your largest application stage.`
                                : "Start adding applications to see personalized insights."}
                        </h2>

                        <span>
                            {totalApplications > 0
                                ? `${totalApplications} applications are currently being tracked in your workspace.`
                                : "Once you add applications, this section will help summarize your job-search activity."}
                        </span>

                    </div>

                </section>

            </div>

        </div>
    );
}


/* =========================================
   METRIC BAR
========================================= */

function MetricBar({
    label,
    value,
}) {
    const safeValue = Math.min(
        100,
        Math.max(
            0,
            Number(value) || 0
        )
    );

    return (
        <div className="analytics-metric-row">

            <div className="analytics-metric-label">

                <span>
                    {label}
                </span>

                <strong>
                    {safeValue}%
                </strong>

            </div>

            <div className="analytics-progress-track">

                <div
                    className="analytics-progress-fill"
                    style={{
                        width: `${safeValue}%`,
                    }}
                />

            </div>

        </div>
    );
}

export default Analytics;