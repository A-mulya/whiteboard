const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username: name, email, password: hashed });

    await user.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });

    return res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;