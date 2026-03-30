const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  purpose: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  qrCode: { type: String }, // base64 QR image
  qrToken: { type: String, unique: true }, // unique token embedded in QR
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);