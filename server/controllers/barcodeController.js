const Barcode = require('../models/barcode');

// Controller to save barcode data
const saveBarcode = async (req, res) => {
    const { url, type, color, imageUrl } = req.body;

    if (!url || !type || !color || !imageUrl) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newBarcode = new Barcode({ url, type, color, imageUrl });
        await newBarcode.save();
        res.status(201).json({ message: 'Barcode saved successfully' });
    } catch (error) {
        console.error('Error saving barcode:', error);
        res.status(500).json({ message: 'Error saving barcode' });
    }
};

// Controller to get recent barcodes
const getRecentBarcodes = async (req, res) => {
    try {
        const recentBarcodes = await Barcode.find().sort({ createdAt: -1 }).limit(5);
        res.json(recentBarcodes);
    } catch (error) {
        console.error('Error fetching recent barcodes:', error);
        res.status(500).json({ message: 'Error fetching recent barcodes' });
    }
};

module.exports = {
    saveBarcode,
    getRecentBarcodes,
};
