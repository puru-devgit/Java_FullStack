const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PushSubscription = require('../models/PushSubscription');

// Get VAPID public key
router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// Save push subscription
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { subscription } = req.body;
    await PushSubscription.findOneAndUpdate(
      { user: req.user.userId },
      { user: req.user.userId, subscription },
      { upsert: true, new: true }
    );
    res.json({ message: 'Subscribed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
