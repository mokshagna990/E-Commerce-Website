import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { GoogleLogin } from '@react-oauth/google';

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

    const handleSubmit = async (e) => {
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
            console.log('Sending registration data:', {
                ...requestData,
                password: '[HIDDEN]'
            });
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

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // Update this URL to match your backend route
            const response = await fetch('http://localhost:5000/api/users/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    credential: credentialResponse.credential,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                dispatch(login(data));
                navigate('/');
            } else {
                setErrors(prev => ({
                    ...prev,
                    submit: data.message || 'Google registration failed'
                }));
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: 'Google registration failed'
            }));
            console.error('Registration error:', error);
        }
    };
    

    return (
        <div className="auth-container">
            <h1>Register</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="auth-input"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="auth-input"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="auth-input"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <select
                        name="isAdmin"
                        value={String(formData.isAdmin)}
                        onChange={handleChange}
                        className="auth-input"
                        disabled={isLoading}
                    >
                        <option value="false">Customer</option>
                        <option value="true">Admin</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    className="auth-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>

                {errors.submit && (
                    <div className="error-message">
                        {errors.submit}
                    </div>
                )}
            </form>

            {/* Add Google Sign-In Button */}
            <div className="google-login-container" style={{ marginTop: '20px', textAlign: 'center' }}>
                <p>Or sign up with:</p>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        console.log('Sign Up Failed');
                        setErrors(prev => ({
                            ...prev,
                            submit: 'Google sign up failed'
                        }));
                    }}
                    useOneTap
                />
            </div>
        </div>
    );
};

export default Register;
