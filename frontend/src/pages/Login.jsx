import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    BriefcaseBusiness,
    LoaderCircle,
} from "lucide-react";

import { loginUser } from "../services/authService";

function Login() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            const data = await loginUser(
                formData.email,
                formData.password
            );

            console.log("Login successful:", data);

            /*
              Store the JWT token temporarily.
              We will later move authentication
              into a proper AuthContext.
            */
            localStorage.setItem("access_token", data.access_token);

            navigate("/dashboard");
        } catch (err) {
            console.error("Login error:", err);

            if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError(
                    "Unable to connect to the server. Please try again."
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-background-shape shape-one"></div>
            <div className="auth-background-shape shape-two"></div>

            <div className="auth-container">
                {/* Left Section */}
                <section className="auth-intro">
                    <div className="brand">
                        <div className="brand-icon">
                            <BriefcaseBusiness size={25} />
                        </div>

                        <span>Smart Job Tracker</span>
                    </div>

                    <div className="intro-content">
                        <span className="intro-badge">
                            YOUR CAREER, ORGANIZED
                        </span>

                        <h1>
                            Track your job search.
                            <span> Build your career.</span>
                        </h1>

                        <p>
                            Manage your job opportunities, applications,
                            interviews and career progress from one simple
                            platform.
                        </p>

                        <div className="intro-points">
                            <div>
                                <span>✓</span>
                                <p>Organize all your job applications</p>
                            </div>

                            <div>
                                <span>✓</span>
                                <p>Track your application progress</p>
                            </div>

                            <div>
                                <span>✓</span>
                                <p>Understand your job-search performance</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Login Card */}
                <section className="auth-card-wrapper">
                    <div className="auth-card">
                        <div className="mobile-brand">
                            <div className="brand-icon">
                                <BriefcaseBusiness size={23} />
                            </div>

                            <span>Smart Job Tracker</span>
                        </div>

                        <div className="auth-header">
                            <h2>Welcome back 👋</h2>

                            <p>
                                Sign in to continue managing your job
                                applications.
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="auth-form"
                        >
                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="email">
                                    Email address
                                </label>

                                <div className="input-wrapper">
                                    <Mail size={19} />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="form-group">
                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="input-wrapper">
                                    <LockKeyhole size={19} />

                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) => !previous
                                            )
                                        }
                                        disabled={isLoading}
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="auth-button"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <LoaderCircle
                                            size={18}
                                            className="spinner"
                                        />

                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </form>

                        <div className="auth-divider">
                            <span></span>

                            <p>New to Smart Job Tracker?</p>

                            <span></span>
                        </div>

                        <Link
                            to="/register"
                            className="register-link"
                        >
                            Create an account
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Login;