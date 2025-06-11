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

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      notes: {
        userDetails: JSON.stringify(userDetails),
        itineraryId,
      },
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userDetails,
      itineraryId,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', 'htb3dEruoc4vtPVNr6Pvu7i0')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Here you would typically:
      // 1. Save the booking details to your database
      // 2. Send confirmation email to the user
      // 3. Update inventory/availability if needed

      // For now, we'll just return a success response
      res.json({
        success: true,
        bookingId: `booking_${Date.now()}`,
        message: 'Payment verified successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router; 