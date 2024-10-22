import React, { useEffect, useState } from 'react';
import '../styles/RecentBarcodes.css';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-url.com/api/barcodes/recent'
  : 'http://localhost:5000/api/barcodes/recent';

const RecentBarcodes = () => {
  const [recentBarcodes, setRecentBarcodes] = useState([]);

  useEffect(() => {
    const fetchRecentBarcodes = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setRecentBarcodes(data);
      } catch (error) {
        console.error('Error fetching recent barcodes:', error);
      }
    };

    fetchRecentBarcodes();
  }, []);

  return (
    <div className="recent-barcodes-section">
      <h2>Recent Barcodes</h2>
      {recentBarcodes.length > 0 ? (
        <div className="barcode-list">
          {recentBarcodes.map((barcode, index) => (
            <div key={index} className="barcode-item">
              <img src={barcode.imageUrl} alt={`Barcode ${index}`} style={{ maxWidth: '200px' }} />
              <p>URL: {barcode.url}</p>
              <p>Type: {barcode.type}</p>
              <p>Color: {barcode.color}</p>
              <p>Date: {new Date(barcode.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No recent barcodes found</p>
      )}
    </div>
  );
};

export default RecentBarcodes;
