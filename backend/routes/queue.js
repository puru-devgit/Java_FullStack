const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Queue = require('../models/Queue');
const Organization = require('../models/Organization');
const User = require('../models/User');

// Join queue
router.post('/join/:orgId', auth, async (req, res) => {
  try {
    const org = await Organization.findById(req.params.orgId);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if already in queue
    const alreadyIn = await Queue.findOne({
      organization: org._id,
      client: req.user.userId,
      status: 'waiting'
    });
    if (alreadyIn) {
      const ahead = await Queue.countDocuments({
        organization: org._id,
        status: 'waiting',
        joinedAt: { $lt: alreadyIn.joinedAt }
      });
      return res.json({ message: 'Already in queue', position: ahead, entry: alreadyIn });
    }

    const entry = await Queue.create({
      organization: org._id,
      client: req.user.userId,
      clientName: user.name,
      clientEmail: user.email,
      clientPhone: user.phone,
    });

    const position = await Queue.countDocuments({
      organization: org._id,
      status: 'waiting',
      joinedAt: { $lt: entry.joinedAt }
    });

    // Emit to org room
    const io = req.app.get('io');
    const queue = await Queue.find({ organization: org._id, status: 'waiting' }).sort({ joinedAt: 1 });
    io.to(`org_${org._id}`).emit('queue_updated', { queue });

    // If client is #1 (position=0), notify them they're next
    if (position === 0 && queue.length === 1) {
      io.to(`client_${req.user.userId}`).emit('you_are_next');
    }

    res.json({ message: 'Joined queue', position, entry });
  } catch (err) {
    console.error('Queue join error:', err);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

// Get client's queue status
router.get('/status/:orgId', auth, async (req, res) => {
  try {
    const entry = await Queue.findOne({
      organization: req.params.orgId,
      client: req.user.userId,
      status: 'waiting'
    });

    if (!entry) return res.json({ inQueue: false });

    const position = await Queue.countDocuments({
      organization: req.params.orgId,
      status: 'waiting',
      joinedAt: { $lt: entry.joinedAt }
    });

    res.json({ inQueue: true, position, entry });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;