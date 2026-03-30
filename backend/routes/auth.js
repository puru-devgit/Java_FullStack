const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const qrcode = require('qrcode');
const crypto = require('crypto');
const User = require('../models/User');
const Organization = require('../models/Organization');

// ================= REGISTER =================
router.post('/register', async (req, res) => {
  try {
    const { role, name, email, phone, password, orgName, purpose } = req.body;

    // Check if email exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role
    });

    let org = null;

    // If organization, create org + QR
    if (role === 'organization') {
      const qrToken = crypto.randomBytes(16).toString('hex');
      const qrData = `${process.env.CLIENT_URL}/join/${qrToken}`;
      const qrCode = await qrcode.toDataURL(qrData);

      org = await Organization.create({
        user: user._id,
        name: orgName,
        purpose,
        email,
        phone,
        qrCode,
        qrToken
      });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Final Response
    if (role === 'organization') {
      return res.status(201).json({
        token,
        role: user.role,
        name: user.name,
        userId: user._id,
        qrCode: org.qrCode
      });
    }

    res.status(201).json({
      token,
      role: user.role,
      name: user.name,
      userId: user._id
    });

  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      userId: user._id
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;