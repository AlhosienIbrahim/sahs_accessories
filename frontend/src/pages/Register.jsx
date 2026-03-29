import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                setLoading(false);
                if (data.error) {
                    setError(data.error);
                    return;
                }
                navigate('/login');
            })
            .catch(function() {
                setLoading(false);
                setError('Something went wrong. Try again.');
            });
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-5">
                    <div className="card p-4">
                        <h3 className="mb-3">Register</h3>

                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value); }}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Choose a password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); }}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                                {loading ? 'Creating account...' : 'Register'}
                            </button>
                        </form>

                        <p className="text-center mt-3 mb-0">
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;