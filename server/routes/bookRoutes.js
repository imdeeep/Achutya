const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const bookingController = require('../controllers/BookingController');

// Payment and booking creation routes
router.post('/create-payment-order', bookingController.createPaymentOrder);
router.post('/complete-booking',isAuthenticated, bookingController.completeBooking);

// Get all bookings (admin only)
router.get('/admin/all', isAdmin, bookingController.getAllBookings);

// Get user's bookings
router.get('/user/:userId', isAuthenticated, bookingController.getUserBookings);

// Get booking by ID
router.get('/:id', isAuthenticated, bookingController.getBooking);

// Update booking status
router.patch('/:id/status', isAuthenticated, bookingController.updateBookingStatus);

// Cancel booking
router.put('/:id/cancel', isAuthenticated, bookingController.cancelBooking);

// Get booking statistics (admin only)
router.get('/stats/overview', isAdmin, bookingController.getBookingStats);

module.exports = router; 