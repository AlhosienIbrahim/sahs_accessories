import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: username, password: password }),
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            setLoading(false);
            if (data.error) {
            setError(data.error);
            return;
            }
            localStorage.setItem("username", data.username);
            navigate("/");
            window.location.reload();
        })
        .catch(() => {
            setLoading(false);
            setError("Something went wrong. Try again.");
        });
    }

    return (
        <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-12 col-sm-8 col-md-5">
            <div className="card p-4">
                <h3 className="mb-3">Login</h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your username"
                    value={username}
                    onChange={function (e) {
                        setUsername(e.target.value);
                    }}
                    required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={function (e) {
                        setPassword(e.target.value);
                    }}
                    required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-dark w-100"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                </form>

                <p className="text-center mt-3 mb-0">
                Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
            </div>
        </div>
        </div>
    );
}

export default Login;
