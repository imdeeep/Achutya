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
      : userDetailsStr;

    try {
      // Here you would typically save to your database
      // For example:
      /*
      const booking = await Booking.create({
        bookingId: `B${Date.now()}`,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: req.body.amount, // Pass this from frontend if needed
        currency: 'INR',
        status: 'confirmed',
        userDetails,
        itineraryId,
        travelDate: date,
        guests: parseInt(guests, 10) || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      */

      
      // For now, we'll generate a booking ID
      const bookingId = `B${Date.now()}`;
      
      // Here you would typically send a confirmation email
      // await sendConfirmationEmail(userDetails.email, bookingId);

      res.json({
        success: true,
        bookingId,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        message: 'Payment verified and booking confirmed',
        redirectUrl: `/bookings?bookingId=${bookingId}`
      });
      
    } catch (dbError) {
      console.error('Database error during booking:', dbError);
      // Even if database fails, we should still confirm payment to Razorpay
      // but log the error for manual reconciliation
      res.json({
        success: true,
        bookingId: `TEMP_${Date.now()}`,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        message: 'Payment verified but there was an issue saving booking details. Please contact support.',
        warning: 'Database error occurred',
        redirectUrl: `/booking/confirmation?bookingId=TEMP_${Date.now()}&warning=1`
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