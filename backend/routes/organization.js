const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Organization = require('../models/Organization');
const Queue = require('../models/Queue');
const PushSubscription = require('../models/PushSubscription');

// Get org info by QR token
router.get('/by-token/:token', async (req, res) => {
  try {
    const org = await Organization.findOne({ qrToken: req.params.token });
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    res.json({ orgId: org._id, name: org.name, purpose: org.purpose });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get org dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const org = await Organization.findOne({ user: req.user.userId });
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    const queue = await Queue.find({ organization: org._id, status: 'waiting' }).sort({ joinedAt: 1 });

    res.json({ org, queue, totalInQueue: queue.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve next client
router.post('/serve', auth, async (req, res) => {
  try {
    const org = await Organization.findOne({ user: req.user.userId });
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    const next = await Queue.findOne({ organization: org._id, status: 'waiting' }).sort({ joinedAt: 1 });
    if (!next) return res.status(404).json({ message: 'Queue is empty' });

    next.status = 'served';
    await next.save();

    const queue = await Queue.find({ organization: org._id, status: 'waiting' }).sort({ joinedAt: 1 });

    const io = req.app.get('io');
    io.to(`org_${org._id}`).emit('queue_updated', { queue });

    // Notify the new first person they're next
    if (queue.length > 0) {
      const nextClientId = queue[0].client;
      io.to(`client_${nextClientId}`).emit('you_are_next');

      // Send push notification
      const webpush = req.app.get('webpush');
      const pushSub = await PushSubscription.findOne({ user: nextClientId });
      if (pushSub) {
        webpush.sendNotification(pushSub.subscription, JSON.stringify({
          title: '🎉 You are next!',
          body: 'Please proceed to the counter now.',
        })).catch(() => {});
      }
    }

    res.json({ message: 'Served', queue, totalInQueue: queue.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
