const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const {
  createBooking,
  getAllBookings,
  getBookingById,
  getUserBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
} = require('../controllers/bookingController');

// Create a new booking
router.post('/', isAuthenticated, createBooking);

// Get all bookings (admin only)
router.get('/', isAdmin, getAllBookings);

// Get user's bookings
router.get('/my-bookings', isAuthenticated, getUserBookings);

// Get booking by ID
router.get('/:id', isAuthenticated, getBookingById);

// Update booking status
router.patch('/:id/status', isAuthenticated, updateBookingStatus);

// Cancel booking
router.post('/:id/cancel', isAuthenticated, cancelBooking);

// Get booking statistics (admin only)
router.get('/stats/overview', isAdmin, getBookingStats);

module.exports = router; 