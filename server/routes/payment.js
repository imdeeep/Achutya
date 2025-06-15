const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const {
  createPaymentOrder,
  verifyPayment,
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByBooking,
  updatePaymentStatus,
  getPaymentStats
} = require('../controllers/paymentController');

// Public routes
router.post('/create-payment', createPaymentOrder);
router.post('/verify-payment', verifyPayment);

// Protected routes
router.route('/')
  .post(isAuthenticated, createPayment)
  .get(isAdmin, getAllPayments);

router.route('/stats/overview')
  .get(isAdmin, getPaymentStats);

router.route('/booking/:bookingId')
  .get(isAuthenticated, getPaymentsByBooking);

router.route('/:id')
  .get(isAuthenticated, getPaymentById)
  .patch(isAdmin, updatePaymentStatus);

module.exports = router; 