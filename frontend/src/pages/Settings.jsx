import { useEffect, useState } from "react";
import {
    User,
    Mail,
    ShieldCheck,
    Database,
    Server,
    LogOut,
    CheckCircle2,
} from "lucide-react";

import { getCurrentUser } from "../services/authService";

function Settings() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser =
                    await getCurrentUser();

                setUser(currentUser);
            } catch (error) {
                console.error(
                    "Unable to load account:",
                    error
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem(
            "access_token"
        );

        window.location.href = "/login";
    };

    if (isLoading) {
        return (
            <div className="settings-page">

                <div className="settings-loading">
                    Loading settings...
                </div>

            </div>
        );
    }

    return (
        <div className="settings-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="settings-header">

                <div>

                    <p className="page-eyebrow">
                        ACCOUNT SETTINGS
                    </p>

                    <h1>Settings</h1>

                    <p>
                        Manage your account and review
                        your application configuration.
                    </p>

                </div>

            </div>


            {/* =========================
                CONTENT
            ========================= */}

            <div className="settings-grid">

                {/* ACCOUNT */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-card-icon">
                            <User size={19} />
                        </div>

                        <div>

                            <h2>
                                Account Information
                            </h2>

                            <p>
                                Your authenticated
                                account details.
                            </p>

                        </div>

                    </div>


                    <div className="settings-account-profile">

                        <div className="settings-avatar">
                            {user?.name
                                ?.charAt(0)
                                .toUpperCase() ||
                                "U"}
                        </div>

                        <div>

                            <strong>
                                {user?.name ||
                                    "User"}
                            </strong>

                            <span>
                                {user?.email ||
                                    "No email available"}
                            </span>

                        </div>

                    </div>


                    <div className="settings-details">

                        <div className="settings-detail-row">

                            <div className="settings-detail-icon">
                                <User size={16} />
                            </div>

                            <div>
                                <span>
                                    Full Name
                                </span>

                                <strong>
                                    {user?.name ||
                                        "—"}
                                </strong>
                            </div>

                        </div>


                        <div className="settings-detail-row">

                            <div className="settings-detail-icon">
                                <Mail size={16} />
                            </div>

                            <div>
                                <span>
                                    Email Address
                                </span>

                                <strong>
                                    {user?.email ||
                                        "—"}
                                </strong>
                            </div>

                        </div>


                        <div className="settings-detail-row">

                            <div className="settings-detail-icon">
                                <ShieldCheck size={16} />
                            </div>

                            <div>
                                <span>
                                    Authentication
                                </span>

                                <strong>
                                    JWT Protected
                                </strong>
                            </div>

                        </div>

                    </div>

                </section>


                {/* SYSTEM */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-card-icon">
                            <Server size={19} />
                        </div>

                        <div>

                            <h2>
                                System
                            </h2>

                            <p>
                                Application architecture
                                and connection status.
                            </p>

                        </div>

                    </div>


                    <div className="settings-status-list">

                        <div className="settings-status-row">

                            <div className="settings-status-left">

                                <div className="settings-status-icon">
                                    <Server
                                        size={16}
                                    />
                                </div>

                                <div>

                                    <strong>
                                        Backend API
                                    </strong>

                                    <span>
                                        FastAPI REST API
                                    </span>

                                </div>

                            </div>

                            <span className="settings-online">
                                <CheckCircle2
                                    size={14}
                                />
                                Connected
                            </span>

                        </div>


                        <div className="settings-status-row">

                            <div className="settings-status-left">

                                <div className="settings-status-icon">
                                    <Database
                                        size={16}
                                    />
                                </div>

                                <div>

                                    <strong>
                                        Database
                                    </strong>

                                    <span>
                                        PostgreSQL
                                    </span>

                                </div>

                            </div>

                            <span className="settings-online">
                                <CheckCircle2
                                    size={14}
                                />
                                Connected
                            </span>

                        </div>

                    </div>

                </section>


                {/* SECURITY */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-card-icon">
                            <ShieldCheck size={19} />
                        </div>

                        <div>

                            <h2>
                                Security
                            </h2>

                            <p>
                                Authentication and
                                session information.
                            </p>

                        </div>

                    </div>


                    <div className="settings-security-box">

                        <ShieldCheck size={21} />

                        <div>

                            <strong>
                                Your session is protected
                            </strong>

                            <span>
                                Protected API requests
                                automatically include your
                                JWT access token.
                            </span>

                        </div>

                    </div>

                </section>


                {/* LOGOUT */}

                <section className="settings-card settings-danger-card">

                    <div className="settings-card-header">

                        <div className="settings-card-icon settings-danger-icon">
                            <LogOut size={19} />
                        </div>

                        <div>

                            <h2>
                                Session
                            </h2>

                            <p>
                                Sign out of your Smart
                                Job Tracker account.
                            </p>

                        </div>

                    </div>


                    <button
                        className="settings-logout-button"
                        onClick={handleLogout}
                    >
                        <LogOut size={17} />
                        Sign Out
                    </button>

                </section>

            </div>

        </div>
    );
}

export default Settings;