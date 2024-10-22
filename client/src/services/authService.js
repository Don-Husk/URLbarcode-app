import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (userData) => {
    try {
        // Send a POST request to the register endpoint
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData), // Ensure this is valid JSON
        });

        // Check if response is ok, otherwise throw an error
        if (!response.ok) {
            const errorData = await response.json(); // Try to extract error from response
            console.error('Server error response:', errorData); // Log the actual error from the backend
            throw new Error(errorData.message || 'Registration failed');
        }

        return await response.json(); // Parse the response data if successful
    } catch (error) {
        console.error('Error registering user:', error.message); // Log the error message
        throw error; // Re-throw error to be handled in the calling function
    }
};


// Updated login function with error handling
export const loginUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            // Check if response is JSON, if not, provide a default error message
            let errorData;
            try {
                errorData = await response.json();
            } catch (err) {
                throw new Error('Unexpected error during login');
            }
            throw new Error(errorData.message || 'Login failed');
        }

        return await response.json(); // Parse and return the response if successful
    } catch (error) {
        console.error('Error logging in:', error.message);
        throw error; // Re-throw for further handling
    }
};
