const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const User = require('../models/User');

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

router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      orderItems,
      total,
      paymentMethod = 'cash_on_delivery',
      paymentStatus = 'pending',
      trackingStatus = 'placed',
      deliveryDetails = {},
    } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || !total) {
      return res.status(400).json({ message: 'Order items and total are required' });
    }

    const order = await Order.create({
      userId: req.user.id,
      orderItems,
      total,
      paymentMethod,
      paymentStatus,
      trackingStatus,
      deliveryDetails,
      status: trackingStatus,
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Order placement failed', error: error.message });
  }
});

router.get('/history', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order history', error: error.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

module.exports = router;
