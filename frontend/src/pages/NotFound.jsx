import {
    AlertCircle,
    ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">

            <div className="not-found-card">

                <div className="not-found-icon">
                    <AlertCircle size={30} />
                </div>

                <p className="page-eyebrow">
                    PAGE NOT FOUND
                </p>

                <h1>
                    404
                </h1>

                <h2>
                    We couldn't find that page.
                </h2>

                <p>
                    The page you're looking for may
                    have been moved, deleted, or the
                    URL may be incorrect.
                </p>

                <button
                    className="primary-action-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    <ArrowLeft size={17} />
                    Back to Dashboard
                </button>

            </div>

        </div>
    );
}

export default NotFound;