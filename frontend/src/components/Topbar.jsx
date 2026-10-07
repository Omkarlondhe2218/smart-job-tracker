import { Menu, Bell } from "lucide-react";

function Topbar({ onMenuClick, user }) {
    return (
        <header className="app-topbar">

            <button
                className="mobile-menu-button"
                onClick={onMenuClick}
                aria-label="Open menu"
            >
                <Menu size={22} />
            </button>

            <div className="topbar-spacer" />

            <button
                className="notification-button"
                aria-label="Notifications"
            >
                <Bell size={19} />

                <span className="notification-dot" />
            </button>

            <div className="topbar-user">

                <div className="topbar-avatar">
                    {user?.name
                        ? user.name.charAt(0).toUpperCase()
                        : "U"}
                </div>

                <div className="topbar-user-info">
                    <strong>
                        {user?.name || "User"}
                    </strong>

                    <span>
                        {user?.email || "Account"}
                    </span>
                </div>

            </div>

        </header>
    );
}

export default Topbar;