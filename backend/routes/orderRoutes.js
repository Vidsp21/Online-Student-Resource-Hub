const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getOrder
} = require('../controllers/orderController');

// All routes are protected
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);

module.exports = router;
