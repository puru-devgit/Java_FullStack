const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true
  },
  queueType: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  queueCode: {
    type: String,
    required: true
  },
  users: [
    {
      userId: String,
      joinedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model("Queue", queueSchema);