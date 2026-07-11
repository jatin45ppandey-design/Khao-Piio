const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'khao-pio-super-secret';

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = `order_${Date.now()}` } = req.body;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        message: 'Razorpay environment keys are missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the backend .env file.',
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Valid amount is required to create a Razorpay order.' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt,
    });

    res.json({
      order: {
        ...order,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create Razorpay order', error: error.message });
  }
});

router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay secret key is missing.' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${order_id}|${payment_id}`)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: 'Payment signature verification failed.' });
    }

    res.json({ valid: true, message: 'Payment verified successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to verify Razorpay payment', error: error.message });
  }
});

module.exports = router;
