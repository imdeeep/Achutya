const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const bookingController = require('../controllers/BookingController');

// Payment and booking creation routes
router.post('/create-payment-order',isAuthenticated, bookingController.createPaymentOrder);
router.post('/complete-booking',isAuthenticated, bookingController.completeBooking);

// Get all bookings (admin only)
router.get('/admin/all', isAdmin, bookingController.getAllBookings);

// Get user's bookings
router.get('/user/:userId', isAuthenticated, bookingController.getUserBookings);

// Get booking by ID
router.get('/:bookingId',isAuthenticated, bookingController.getBooking);

// Update booking status
router.patch('/:id/status',isAdmin, bookingController.updateBookingStatus);

// Cancel booking
router.put('/:bookingId/cancel',isAuthenticated, bookingController.cancelBooking);


module.exports = router; 