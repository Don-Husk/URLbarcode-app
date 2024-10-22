// src/pages/Login.js
import React, { useState, useContext } from 'react';
import { loginUser } from '../services/authService'; // API call for logging in
import { useNavigate,Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Access login method from AuthContext
import '../styles/Login.css'; // Styles for the login page

const Login = () => {
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [message, setMessage] = useState(''); // State for error or redirect messages
    const navigate = useNavigate(); // Hook to programmatically navigate
    const { login } = useContext(AuthContext); // Access login method from AuthContext

    const handleLogin = async (e) => {
        e.preventDefault();
        const userData = { email, password }; // Prepare login data

        try {
            const response = await loginUser(userData); // Call loginUser service
            console.log('User logged in:', response);
            alert("User logged in successfully");
            login(); // Update authentication status in context
            navigate('/'); // Redirect to home page
        } catch (error) {
            console.error('Error logging in user:', error);
            if (error.message.includes('User not found')) {
                setMessage('User not registered. Redirecting to registration page...');
                setTimeout(() => {
                    navigate('/register'); // Redirect to register page after 2 seconds
                }, 2000);
            } else {
                console.log("Login failed");
                alert('Login failed. Please check your credentials.');
            }
        }
    };

    return (
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && <p className="message">{message}</p>} {/* Display message if set */}
            <p className="signup-message">
                Don't have an account? <Link to="/register">Sign up here</Link>
            </p>
        </div>
    );
};

export default Login;
