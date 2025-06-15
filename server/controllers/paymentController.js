const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper function to save booking to database
const saveBookingToDatabase = async (bookingData) => {
  const booking = new Booking({
    user: bookingData.userDetails._id || null,
    paymentId: bookingData.paymentId,
    orderId: bookingData.orderId,
    amount: bookingData.amount,
    currency: bookingData.currency,
    status: bookingData.status,
    numberOfGuests: bookingData.guests,
    itinerary: bookingData.itinerary.id,
    primaryContact: {
      name: bookingData.userDetails.name,
      email: bookingData.userDetails.email,
      phone: bookingData.userDetails.phone
    }
  });

  return await booking.save();
};

// Create payment order
const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, userDetails, itineraryId } = req.body;

    // Convert amount to number and validate
    const amountInPaise = Math.round(Number(amount) * 100);

    // Validate amount (Razorpay's max is 5,00,000)
    if (amountInPaise > 50000000) {
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
      payment_capture: 1,
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
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userDetails: userDetailsStr,
      itineraryId,
      date,
      guests,
      amount,
      currency
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
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
        currency: currency || 'INR',
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
};

// Create a new payment
const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod, transactionId, gatewayResponse } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Verify booking belongs to user or user is admin
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const payment = new Payment({
      booking: bookingId,
      amount,
      paymentMethod,
      transactionId,
      gatewayResponse,
      status: 'Success'
    });

    await payment.save();

    // Update booking payment status
    booking.paidAmount += amount;
    booking.paymentStatus = booking.paidAmount >= booking.totalAmount ? 'Completed' : 'Partial';
    await booking.save();

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all payments (admin only)
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'booking',
        populate: [
          { path: 'user', select: 'name email' },
          { path: 'tour', select: 'title' },
          { path: 'itinerary', select: 'title' }
        ]
      });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: 'booking',
        populate: [
          { path: 'user', select: 'name email' },
          { path: 'tour', select: 'title' },
          { path: 'itinerary', select: 'title' }
        ]
      });

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    // Verify payment belongs to user or user is admin
    if (payment.booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get payments for a booking
const getPaymentsByBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Verify booking belongs to user or user is admin
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const payments = await Payment.find({ booking: req.params.bookingId });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update payment status (admin only)
const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    payment.status = status;
    await payment.save();

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get payment statistics (admin only)
const getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const successfulPayments = await Payment.countDocuments({ status: 'Success' });
    const totalAmount = await Payment.aggregate([
      { $match: { status: 'Success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalPayments,
        successfulPayments,
        totalAmount: totalAmount[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByBooking,
  updatePaymentStatus,
  getPaymentStats
}; 