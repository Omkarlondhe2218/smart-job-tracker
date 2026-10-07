import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { getCurrentUser } from "../services/authService";

function AppLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error("Unable to load user:", error);
            }
        };

        loadUser();
    }, []);

    return (
        <div className="app-layout">

            <Sidebar
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            <div className="app-main">

                <Topbar
                    user={user}
                    onMenuClick={() => setMobileOpen(true)}
                />

                <main className="app-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default AppLayout;