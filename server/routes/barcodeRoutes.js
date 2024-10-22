const express = require('express');
const { saveBarcode, getRecentBarcodes } = require('../controllers/barcodeController');

const router = express.Router();

// Route to save barcode
router.post('/save', saveBarcode);

// Route to get recent barcodes
router.get('/recent', getRecentBarcodes);

module.exports = router;
