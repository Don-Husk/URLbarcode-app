// src/App.js
import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'; // Use NavLink for active state
import Register from './pages/Register';
import Home from './pages/Home';
import Login from './pages/Login';
import Generator from './pages/Generator';
import RecentBarcodes from './pages/RecentBarcodes';
import { AuthProvider, AuthContext } from './context/AuthContext';
import './App.css'; // Import the new CSS file for styling

const App = () => {
    const [url, setUrl] = useState('');  // URL for barcode generation
    const [barcodeType, setBarcodeType] = useState('qr');  // Barcode type (QR or others)
    const [barcodeColor, setBarcodeColor] = useState('#000000');  // Color of the barcode
    const [recentBarcodes, setRecentBarcodes] = useState([]);  // List of recent generated barcodes
    const [generatedBarcode, setGeneratedBarcode] = useState(null);  // Holds the latest generated barcode

    // Function to add barcode data to recent barcodes list
    const addToRecentBarcodes = (barcodeData) => {
        setRecentBarcodes([...recentBarcodes, barcodeData]);
    };

    return (
        <AuthProvider>
            <Router>
                <AuthContext.Consumer>
                    {({ isAuthenticated, logout }) => (
                        <>
                            {isAuthenticated && (
                                <nav className="navbar">
                                    <div className="navbar-container">
                                        {/* NavLink used for navigation with active state */}
                                        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
                                        <NavLink to="/qrpage" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>QR Page</NavLink>
                                        <NavLink to="/recent" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Recent</NavLink>
                                        <button onClick={logout} className="logout-button">Logout</button>
                                    </div>
                                </nav>
                            )}

                            <Routes>
                                {/* If not authenticated, show Login/Register routes */}
                                {!isAuthenticated ? (
                                    <>
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/register" element={<Register />} />
                                        <Route path="/" element={<Login />} />
                                    </>
                                ) : (
                                    <>
                                        {/* If authenticated, show protected routes */}
                                        <Route path="/" element={<Home />} />
                                        <Route path="/qrpage" element={
                                            <Generator 
                                                setUrl={setUrl}
                                                setBarcodeType={setBarcodeType}
                                                setBarcodeColor={setBarcodeColor}
                                                setGeneratedBarcode={setGeneratedBarcode}
                                                addToRecentBarcodes={addToRecentBarcodes}  // Passing method to update recent barcodes
                                            />
                                        } />
                                        <Route path="/recent" element={<RecentBarcodes recentBarcodes={recentBarcodes} />} />
                            
                                    </>
                                )}
                            </Routes>
                        </>
                    )}
                </AuthContext.Consumer>
            </Router>
        </AuthProvider>
    );
};

export default App;
