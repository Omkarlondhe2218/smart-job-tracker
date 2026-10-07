import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    UserRound,
    BriefcaseBusiness,
    LoaderCircle,
} from "lucide-react";

import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        setIsLoading(true);

        try {
            await api.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            setSuccess(
                "Account created successfully. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (err) {
            console.error("Registration error:", err);

            if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError(
                    "Unable to create your account. Please try again."
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
                            START YOUR JOURNEY
                        </span>

                        <h1>
                            Take control of your
                            <span> job search.</span>
                        </h1>

                        <p>
                            Create your account and bring your job search,
                            applications and career progress together in one
                            organized workspace.
                        </p>

                        <div className="intro-points">
                            <div>
                                <span>✓</span>
                                <p>Keep your opportunities organized</p>
                            </div>

                            <div>
                                <span>✓</span>
                                <p>Track every application stage</p>
                            </div>

                            <div>
                                <span>✓</span>
                                <p>Make better career decisions with your data</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Register Card */}
                <section className="auth-card-wrapper">
                    <div className="auth-card register-card">
                        <div className="mobile-brand">
                            <div className="brand-icon">
                                <BriefcaseBusiness size={23} />
                            </div>

                            <span>Smart Job Tracker</span>
                        </div>

                        <div className="auth-header">
                            <h2>Create your account 🚀</h2>

                            <p>
                                Start organizing your job search today.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="auth-success">
                                {success}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="auth-form"
                        >
                            {/* Name */}
                            <div className="form-group">
                                <label htmlFor="name">Full name</label>

                                <div className="input-wrapper">
                                    <UserRound size={19} />

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

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
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
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
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="form-group">
                                <label htmlFor="confirmPassword">
                                    Confirm password
                                </label>

                                <div className="input-wrapper">
                                    <LockKeyhole size={19} />

                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (previous) => !previous
                                            )
                                        }
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
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
                                        Creating account...
                                    </>
                                ) : (
                                    "Create account"
                                )}
                            </button>
                        </form>

                        <div className="auth-divider">
                            <span></span>

                            <p>Already have an account?</p>

                            <span></span>
                        </div>

                        <Link
                            to="/login"
                            className="register-link"
                        >
                            Sign in to your account
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Register;