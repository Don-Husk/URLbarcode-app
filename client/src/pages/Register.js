import React, { useState } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate for redirection
import '../styles/Register.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // State for loading
    const navigate = useNavigate(); // Hook to programmatically navigate

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true when request starts
        const userData = { email, password };

        console.log('User Data to send:', userData);

        try {
            const response = await registerUser(userData);
            console.log('User registered:', response);

            // Clear form fields after successful registration
            setEmail('');
            setPassword('');
            setMessage('User registered successfully!');

            // Redirect to login page after successful registration
            setTimeout(() => {
                navigate('/login'); // Delay the navigation slightly for UX
            }, 1500);
        } catch (error) {
            console.error('Error registering user:', error);

            // Display an error message
            if (error.message === 'User already exists') {
                setMessage('User already exists! Please try with a different email.');
            } else {
                setMessage('Error registering user. Please try again later.');
            }
        } finally {
            setLoading(false); // Ensure loading state is reset after request
        }
    };

    return (
        <div className="register">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading} // Disable input when loading
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading} // Disable input when loading
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'} {/* Display loading text */}
                </button>
            </form>

            {/* Display the message if there is one */}
            {message && <p className="message">{message}</p>}
            <p className="login-message">
                Already have an account? <Link to="/login">Log in here</Link>
            </p>
        </div>
    );
};

export default Register;
