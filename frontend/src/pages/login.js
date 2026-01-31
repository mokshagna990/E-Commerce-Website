import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { setWishlist } from '../redux/slices/wishlistSlice';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
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
            if (!response.ok) {
                throw new Error(data.message || 'Google login failed');
            }
    
            // Store user data and token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            
            // Dispatch login success
            dispatch({ type: 'auth/login/fulfilled', payload: data });
    
            // Navigate based on role
            if (data.isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            setError(error.message || 'Google login failed');
            console.error('Login error:', error);
        }
    };
    

    const handleGoogleError = () => {
        setError('Google login failed');
        console.log('Google Login Failed');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Dispatch login action
            const actionResult = await dispatch(login(formData)).unwrap();
            console.log('Login response:', actionResult);

            // Store user data and token
            localStorage.setItem('token', actionResult.token);
            localStorage.setItem('user', JSON.stringify(actionResult));

            try {
                const wishlistResponse = await fetch('http://localhost:5000/api/wishlist', {
                    headers: {
                        'Authorization': `Bearer ${actionResult.token}`
                    }
                });
                if (wishlistResponse.ok) {
                    const wishlistData = await wishlistResponse.json();
                    dispatch(setWishlist(wishlistData));
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            }
            // Redirect based on user role
            if (actionResult.isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }

        } catch (error) {
            setError(error.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>Login</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
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

                <button 
                    type="submit" 
                    className="auth-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
            </form>

            <div className="google-login-container" style={{ marginTop: '20px', textAlign: 'center' }}>
                <p>Or login with:</p>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                />
            </div>
        </div>
    );
};

export default Login;
