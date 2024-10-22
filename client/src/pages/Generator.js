import React, { useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import QRious from 'qrious';
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF download
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSms } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import '../styles/Generator.css';
import '../styles/Preview.css';

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://your-production-url.com/api/barcodes/save'
    : 'http://localhost:5000/api/barcodes/save';

function Generator({ setUrl, setBarcodeType, setBarcodeColor, setGeneratedBarcode, addToRecentBarcodes }) {
  const urlInput = useRef();
  const barcodeTypeInput = useRef();
  const colorInput = useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBarcode, setGeneratedBarcodeState] = useState(null); // State for barcode image URL

  const generateBarcode = async () => {
    const url = urlInput.current.value;
    const barcodeType = barcodeTypeInput.current.value;
    const color = colorInput.current.value;

    if (!url || !isValidUrl(url)) {
      alert('Please enter a valid URL (starting with http:// or https://)');
      return;
    }

    setUrl(url);
    setBarcodeType(barcodeType);
    setBarcodeColor(color);

    let imageUrl;

    if (barcodeType === 'qr') {
      const qr = new QRious({ value: url, size: 300, foreground: color });
      imageUrl = qr.toDataURL();
    } else if (barcodeType === 'code128') {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, url, { format: 'CODE128', lineColor: color, width: 2, height: 100, displayValue: false });
      imageUrl = canvas.toDataURL();
    }

    setGeneratedBarcodeState(imageUrl);
    setGeneratedBarcode(imageUrl); // Update the global state as well

    const barcodeData = { url, type: barcodeType, color, imageUrl };

    try {
      setIsGenerating(true);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(barcodeData), // Sending the barcode data as JSON
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to save barcode data. Status: ${response.status}. Message: ${errorDetails}`);
      }

      // Add the barcode data to recent barcodes
      addToRecentBarcodes(barcodeData);
    } catch (error) {
      console.error('Error saving barcode:', error);
      alert('Error saving barcode. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isValidUrl = (string) => {
    const res = string.match(/(http|https):\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(:[0-9]{1,5})?(\/.*)?/);
    return res !== null;
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Check out this barcode');
    const body = encodeURIComponent(`Here is a barcode: ${urlInput.current.value}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(`Check out this barcode: ${urlInput.current.value}`);
    window.open(`https://wa.me/?text=${message}`);
  };

  const shareViaSMS = () => {
    const message = encodeURIComponent(`Check out this barcode: ${urlInput.current.value}`);
    window.open(`sms:?body=${message}`);
  };

  // Barcode download functions
  const downloadImage = (format) => {
    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.addImage(generatedBarcode, 'JPEG', 10, 10, 100, 100); // Add barcode image to PDF
      doc.save('barcode.pdf'); // Download as PDF
    } else {
      const link = document.createElement('a');
      link.href = generatedBarcode; // Assuming generatedBarcode is the URL of the image
      link.download = `barcode.${format}`; // Set the download attribute with the desired format
      document.body.appendChild(link);
      link.click(); // Trigger the download
      document.body.removeChild(link); // Clean up
    }
  };

  return (
    <div className="generator-section">
      <h2>Generate Barcode from URL</h2>
      <div className="input-group">
        <label htmlFor="urlInput">Enter URL here:</label>
        <input id="urlInput" type="text" ref={urlInput} placeholder="Enter URL here" />
      </div>
      <div className="options">
        <label htmlFor="barcodeType">Barcode Type:</label>
        <select id="barcodeType" ref={barcodeTypeInput}>
          <option value="qr">QR Code</option>
          <option value="code128">Code 128</option>
        </select>
        <label htmlFor="colorInput">Color:</label>
        <input id="colorInput" type="color" ref={colorInput} defaultValue="#000000" />
        <button onClick={generateBarcode} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Barcode'}
        </button>
      </div>

      {/* Barcode Preview and Download */}
      {generatedBarcode && (
        <div className="preview-section">
          <h3>Barcode Preview</h3>
          <img src={generatedBarcode} alt="Generated Barcode" style={{ maxWidth: '300px' }} />
          <div className="button-container">
            <button onClick={() => downloadImage('png')}>Download as PNG</button>
            <button onClick={() => downloadImage('jpg')}>Download as JPG</button>
            <button onClick={() => downloadImage('pdf')}>Download as PDF</button>
          </div>
        </div>
      )}

      {/* Share options */}
      <div className="share-options">
        <h4>Share:</h4>
        <button onClick={shareViaEmail}>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
        <button onClick={shareViaWhatsApp}>
          <FontAwesomeIcon icon={faWhatsapp} />
        </button>
        <button onClick={shareViaSMS}>
          <FontAwesomeIcon icon={faSms} />
        </button>
      </div>
    </div>
  );
}

export default Generator;
