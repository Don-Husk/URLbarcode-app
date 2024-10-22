const mongoose = require('mongoose');

const barcodeSchema = new mongoose.Schema({
    url: { type: String, required: true },
    type: { type: String, required: true },
    color: { type: String, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Barcode = mongoose.model('Barcode', barcodeSchema);

module.exports = Barcode;
