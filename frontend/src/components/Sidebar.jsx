import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    BriefcaseBusiness,
    ClipboardList,
    BarChart3,
    Settings,
    LogOut,
    X,
} from "lucide-react";

function Sidebar({ mobileOpen, onClose }) {
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
    };

    const navItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Jobs",
            path: "/jobs",
            icon: BriefcaseBusiness,
        },
        {
            name: "Applications",
            path: "/applications",
            icon: ClipboardList,
        },
        {
            name: "Analytics",
            path: "/analytics",
            icon: BarChart3,
        },
    ];

    return (
        <>
            {mobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}

            <aside
                className={`app-sidebar ${mobileOpen ? "sidebar-open" : ""
                    }`}
            >
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <BriefcaseBusiness size={21} />
                    </div>

                    <div className="sidebar-brand-text">
                        <strong>Smart Job</strong>
                        <span>Tracker</span>
                    </div>

                    <button
                        className="sidebar-close"
                        onClick={onClose}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-navigation">
                    <p className="sidebar-section-title">
                        WORKSPACE
                    </p>

                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive ? "active" : ""
                                    }`
                                }
                            >
                                <Icon size={19} />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}

                    <p className="sidebar-section-title sidebar-settings-title">
                        ACCOUNT
                    </p>

                    <NavLink
                        to="/settings"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""
                            }`
                        }
                    >
                        <Settings size={19} />
                        <span>Settings</span>
                    </NavLink>
                </nav>

                <div className="sidebar-bottom">
                    <button
                        className="sidebar-logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={19} />
                        <span>Logout</span>
                    </button>

                    <div className="sidebar-version">
                        Smart Job Tracker v1.0
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;