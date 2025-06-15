const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
// const auth = require('../middleware/auth'); 

// Step 1: Create payment orders
router.post('/create-payment-order', bookingController.createPaymentOrder);

// Step 2: Complete booking after payment
router.post('/complete-booking', bookingController.completeBooking);

// Get single booking by bookingId
router.get('/:bookingId', bookingController.getBooking);

// Cancel booking
router.put('/:bookingId/cancel', bookingController.cancelBooking);

// User specific routes
router.get('/user/:userId', bookingController.getUserBookings);

// Admin routes
router.get('/admin/all', bookingController.getAllBookings);

module.exports = router;