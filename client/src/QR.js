// QRCodeComponent.jsx
import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QR = ({ url }) => {
  return (
    <div>
      <QRCodeCanvas
        value={url} // The URL that the QR code should point to
        size={256}  // Size of the QR code (in pixels)
        bgColor={"#ffffff"}  // Background color
        fgColor={"#000000"}  // Foreground (QR) color
        level={"L"}  // Error correction level (L, M, Q, H)
        includeMargin={true}  // Adds margin around the QR code
      />
      <p>Scan the QR code or click <a href={url}>here</a> to visit the URL.</p>
    </div>
  );
}

export default QR;
