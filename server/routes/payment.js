const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_pQLbxWbQ5iwwZe',
  key_secret: 'htb3dEruoc4vtPVNr6Pvu7i0',
});

// Create payment order
router.post('/create-payment', async (req, res) => {
  try {
    const { amount, currency, receipt, userDetails, itineraryId } = req.body;

    console.log('Received amount:', { amount, type: typeof amount });

    // Convert amount to number and validate
    const amountInPaise = Math.round(Number(amount) * 100);

      console.log('Converted to paise:', amountInPaise);

    
    // Validate amount (Razorpay's max is 5,00,000)
    if (amountInPaise > 50000000) { // 5,00,000 INR in paise
      return res.status(400).json({ 
        error: 'Amount exceeds maximum allowed limit of ₹5,00,000',
        code: 'AMOUNT_LIMIT_EXCEEDED'
      });
    }

    // Validate minimum amount (100 paise = 1 INR)
    if (amountInPaise < 100) {
      return res.status(400).json({ 
        error: 'Amount must be at least ₹1',
        code: 'AMOUNT_TOO_SMALL'
      });
    }

    const options = {
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
      notes: {
        userDetails: JSON.stringify(userDetails || {}),
        itineraryId: itineraryId || 'unknown',
        date: new Date().toISOString()
      },
    };

    const order = await razorpay.orders.create(options);
    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      status: order.status
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ 
      error: error.error?.description || 'Failed to create payment',
      code: error.error?.code || 'PAYMENT_ERROR'
    });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userDetails: userDetailsStr,
      itineraryId,
      date,
      guests
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', 'htb3dEruoc4vtPVNr6Pvu7i0')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid signature',
        code: 'INVALID_SIGNATURE'
      });
    }

    // Parse user details if it's a string
    const userDetails = typeof userDetailsStr === 'string' 
      ? JSON.parse(userDetailsStr) 
      : userDetailsStr || {};

    try {
      // Create booking data
      const bookingData = {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: amount ? Number(amount) : 0,
        currency,
        status: 'confirmed',
        guests: parseInt(guests, 10) || 1,
        itinerary: {
          id: itineraryId || 'itinerary-123',
          title: 'Sample Tour Package',
          destination: 'Goa, India',
          duration: '5 Days / 4 Nights',
          startDate: date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date(new Date(date).getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        userDetails: {
          name: userDetails.name || 'Guest User',
          email: userDetails.email || '',
          phone: userDetails.phone || ''
        }
      };

      // Save booking to database
      const booking = await saveBookingToDatabase(bookingData);
      
      // In a real app, you would send a confirmation email here
      // await sendConfirmationEmail(userDetails.email, booking.id);

      // Return success response with booking details
      res.json({
        success: true,
        bookingId: booking.id,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        message: 'Payment verified and booking confirmed',
        redirectUrl: `/bookings?bookingId=${booking.id}&payment_success=true&payment_id=${razorpay_payment_id}&order_id=${razorpay_order_id}`
      });
      
    } catch (dbError) {
      console.error('Database error during booking:', dbError);
      // Even if database fails, we should still confirm payment to Razorpay
      // but log the error for manual reconciliation
      const tempBookingId = `TEMP_${Date.now()}`;
      res.json({
        success: true,
        bookingId: tempBookingId,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        message: 'Payment verified but there was an issue saving booking details. Please contact support.',
        warning: 'Database error occurred',
        redirectUrl: `/bookings?bookingId=${tempBookingId}&payment_success=true&payment_id=${razorpay_payment_id}&order_id=${razorpay_order_id}&warning=1`
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to verify payment',
      code: 'VERIFICATION_ERROR'
    });
  }
});

module.exports = router; 