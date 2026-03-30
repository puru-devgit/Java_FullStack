const mongoose = require('mongoose');

const queueEntrySchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: { type: String },
  clientEmail: { type: String },
  clientPhone: { type: String },
  position: { type: Number },
  status: { type: String, enum: ['waiting', 'served'], default: 'waiting' },
  joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Queue', queueEntrySchema);