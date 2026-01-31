import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { applyLogging } from '../aspects/loggingAspect';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        isAdmin: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Create base methods without logging
    const baseHandleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const requestData = {
                name: formData.username,
                email: formData.email,
                password: formData.password,
                isAdmin: Boolean(formData.isAdmin)
            };

            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/login');
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: error.message
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/users/auth/google';
    };

    // Apply logging aspect to the methods
    const handleSubmit = applyLogging({ handleSubmit: baseHandleSubmit }, 'handleSubmit').handleSubmit;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'isAdmin') {
            setFormData(prev => ({
                ...prev,
                isAdmin: value === 'true'
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="isAdmin">Account Type:</label>
                    <select
                        id="isAdmin"
                        name="isAdmin"
                        value={formData.isAdmin}
                        onChange={handleChange}
                    >
                        <option value={false}>Regular User</option>
                        <option value={true}>Admin</option>
                    </select>
                </div>

                {errors.submit && (
                    <div className="error-message">
                        {errors.submit}
                    </div>
                )}

                <button 
                    type="submit" 
                    className="register-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>

                <div className="divider">
                    <span>OR</span>
                </div>

                <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    className="google-login-button"
                >
                    <img 
                        src="/google-icon.png" 
                        alt="Google" 
                        className="google-icon"
                    />
                    Register with Google
                </button>

                <p className="login-link">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </form>
        </div>
    );
};

export default Register;
