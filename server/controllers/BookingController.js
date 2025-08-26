const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Tour = require('../models/Tour');
const TourDate = require('../models/TourDate');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendMail } = require('../utils/mailer');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_pQLbxWbQ5iwwZe',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'htb3dEruoc4vtPVNr6Pvu7i0',
});

const bookingController = { 
  // Create payment order (Step 1)
  createPaymentOrder: async (req, res) => {
    try {
      const { tourId, tourDateId, numberOfGuests, userDetails, amount, baseAmount, gstAmount, gatewayFee } = req.body;
      
      // Validate required fields
      if (!tourId || !tourDateId || !numberOfGuests || !userDetails || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: tourId, tourDateId, numberOfGuests, userDetails, amount'
        });
      }

      // Validate user details
      if (!userDetails.name || !userDetails.email || !userDetails.phone || !userDetails.address) {
        return res.status(400).json({
          success: false,
          message: 'Missing required user details: name, email, phone, address'
        });
      }

      // Validate tour and date
      const tour = await Tour.findById(tourId);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      // Find the tour date in the tour's availableDates array
      const tourDate = tour.availableDates.id(tourDateId);
      if (!tourDate) {
        return res.status(404).json({
          success: false,
          message: 'Tour date not found'
        });
      }

      // Check if date is available and has slots
      if (!tourDate.isAvailable || (tourDate.slotsLeft ?? (tourDate.availableSlots - tourDate.bookedSlots)) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'This date is not available or has no slots left'
        });
      }

      // Calculate expected amount for validation
      const expectedBaseAmount = tour.price * numberOfGuests;
      const expectedGstAmount = Math.round(expectedBaseAmount * 0.05); // 5% GST
      const expectedGatewayFee = Math.round(expectedBaseAmount * 0.02); // 2% Payment Gateway Fee
      const expectedTotalAmount = expectedBaseAmount + expectedGstAmount + expectedGatewayFee;

      // Validate amount (allow small rounding differences)
      if (Math.abs(amount - expectedTotalAmount) > 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid amount. Expected: ₹${expectedTotalAmount}, Received: ₹${amount}`,
          expected: expectedTotalAmount,
          received: amount
        });
      }

      // Create Razorpay order
      const amountInPaise = Math.round(amount * 100);

      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
        notes: {
          tourId: tourId,
          tourDateId: tourDateId,
          numberOfGuests: numberOfGuests.toString(),
          userDetails: JSON.stringify(userDetails),
          baseAmount: baseAmount.toString(),
          gstAmount: gstAmount.toString(),
          gatewayFee: gatewayFee.toString(),
          totalAmount: amount.toString()
        }
      };

      const order = await razorpay.orders.create(options);
      
      res.json({
        success: true,
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          tourDetails: {
            title: tour.title,
            startDate: tourDate.startDate,
            endDate: tourDate.endDate,
            price: tour.price,
            numberOfGuests: numberOfGuests,
            baseAmount: baseAmount,
            gstAmount: gstAmount,
            gatewayFee: gatewayFee,
            totalAmount: amount
          }
        }
      });
    } catch (error) {
      console.error('Error creating payment order:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating payment order',
        error: error.message
      });
    }
  },

  // Complete booking after payment verification (Step 2)
  completeBooking: async (req, res) => {
    try {
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        tourId,
        tourDateId,
        numberOfGuests,
        userDetails,
        amount,
        baseAmount,
        gstAmount,
        gatewayFee
      } = req.body;

      // Log the received data for debugging
      console.log('Payment verification request:', {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature: razorpay_signature ? 'present' : 'missing',
        tourId,
        tourDateId,
        numberOfGuests,
        amount
      });

      // Validate required fields
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Missing payment verification details',
          error: 'razorpay_payment_id, razorpay_order_id, and razorpay_signature are required'
        });
      }

      if (!tourId || !tourDateId || !numberOfGuests || !userDetails || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Missing booking details',
          error: 'tourId, tourDateId, numberOfGuests, userDetails, and amount are required'
        });
      }

      // Verify payment signature with better error handling
      try {
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'htb3dEruoc4vtPVNr6Pvu7i0')
          .update(body)
          .digest('hex');

        console.log('Signature verification:', {
          body,
          expectedSignature: expectedSignature.substring(0, 10) + '...',
          receivedSignature: razorpay_signature.substring(0, 10) + '...',
          match: expectedSignature === razorpay_signature
        });

        if (expectedSignature !== razorpay_signature) {
          return res.status(400).json({
            success: false,
            message: 'Payment signature verification failed',
            error: 'Invalid payment signature',
            orderId: razorpay_order_id
          });
        }
      } catch (signatureError) {
        console.error('Signature verification error:', signatureError);
        return res.status(400).json({
          success: false,
          message: 'Payment signature verification error',
          error: signatureError.message,
          orderId: razorpay_order_id
        });
      }

      // Verify payment with Razorpay API
      try {
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        console.log('Razorpay payment verification:', {
          paymentId: payment.id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency
        });

        if (payment.status !== 'captured') {
          return res.status(400).json({
            success: false,
            message: 'Payment not captured',
            error: `Payment status is ${payment.status}`,
            orderId: razorpay_order_id
          });
        }

        // Verify amount matches
        const expectedAmount = Math.round(amount * 100); // Convert to paise
        if (payment.amount !== expectedAmount) {
          return res.status(400).json({
            success: false,
            message: 'Payment amount mismatch',
            error: `Expected: ${expectedAmount} paise, Received: ${payment.amount} paise`,
            orderId: razorpay_order_id
          });
        }
      } catch (razorpayError) {
        console.error('Razorpay payment verification error:', razorpayError);
        return res.status(400).json({
          success: false,
          message: 'Payment verification with Razorpay failed',
          error: razorpayError.message,
          orderId: razorpay_order_id
        });
      }

      const tour = await Tour.findById(tourId);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found',
          error: 'Tour ID not found in database'
        });
      }

      // Find the tour date in the tour's availableDates array
      const tourDate = tour.availableDates.id(tourDateId);
      if (!tourDate) {
        return res.status(404).json({
          success: false,
          message: 'Tour date not found',
          error: 'Tour date ID not found in tour data'
        });
      }

      // Check if date is already booked (double-check for race conditions)
      if (tourDate.bookedSlots > 0 || !tourDate.isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'This date has already been booked by another group',
          error: 'Tour date is no longer available'
        });
      }

      // Create or update TourDate document
      let tourDateDoc = await TourDate.findOne({ 
        tour: tourId, 
        startDate: tourDate.startDate 
      });

      if (!tourDateDoc) {
        // Create new TourDate document
        tourDateDoc = new TourDate({
          tour: tourId,
          startDate: tourDate.startDate,
          endDate: tourDate.endDate,
          price: tour.price,
          availableSlots: tourDate.availableSlots,
          bookedSlots: numberOfGuests,
          status: 'Sold Out'
        });
        await tourDateDoc.save();
      } else {
        // Update existing TourDate document
        tourDateDoc.bookedSlots = numberOfGuests;
        tourDateDoc.status = 'Sold Out';
        await tourDateDoc.save();
      }

      // Create booking
      const booking = new Booking({
        user: userDetails._id || null,
        tour: tourId,
        tourDate: tourDateDoc._id,
        numberOfGuests: numberOfGuests,
        totalAmount: amount,
        pricePerPerson: tour.price,
        primaryContact: {
          name: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone,
          address: userDetails.address
        },
        status: 'Confirmed',
        paymentStatus: 'Completed',
        transactionId: razorpay_payment_id,
        paidAmount: amount,
        confirmationDate: new Date(),
        paymentBreakdown: {
          baseAmount: baseAmount,
          gstAmount: gstAmount,
          gatewayFee: gatewayFee,
          totalAmount: amount
        }
      });

      await booking.save();

      // Update the tour date's bookedSlots in the embedded document
      tourDate.bookedSlots = numberOfGuests;
      tourDate.isAvailable = false;
      await tour.save();

      // Create payment record
      const paymentRecord = new Payment({
        booking: booking._id,
        amount: amount,
        currency: 'INR',
        paymentMethod: 'Razorpay',
        status: 'Success',
        transactionId: razorpay_payment_id,
        orderId: razorpay_order_id,
        paymentDate: new Date(),
        paymentBreakdown: {
          baseAmount: baseAmount,
          gstAmount: gstAmount,
          gatewayFee: gatewayFee,
          totalAmount: amount
        }
      });

      await paymentRecord.save();

      // Send confirmation email
      try {
        await sendMail({
          to: userDetails.email,
          subject: `Booking Confirmed: ${tour.title}`,
          html: `<h2>Booking Confirmed!</h2>
            <p>Dear ${userDetails.name},</p>
            <p>Your booking for <b>${tour.title}</b> is confirmed.</p>
            <ul>
              <li><b>Date:</b> ${new Date(tourDate.startDate).toLocaleDateString()} - ${new Date(tourDate.endDate).toLocaleDateString()}</li>
              <li><b>Guests:</b> ${numberOfGuests}</li>
              <li><b>Base Amount:</b> ₹${baseAmount}</li>
              <li><b>GST (5%):</b> ₹${gstAmount}</li>
              <li><b>Gateway Fee (2%):</b> ₹${gatewayFee}</li>
              <li><b>Total Amount:</b> ₹${amount}</li>
            </ul>
            <p>Thank you for booking with Achyutya Travel!</p>`
        });
      } catch (mailErr) {
        console.error('Error sending confirmation email:', mailErr);
      }

      console.log('Booking completed successfully:', {
        bookingId: booking._id,
        paymentId: paymentRecord._id,
        orderId: razorpay_order_id
      });

      res.json({
        success: true,
        message: 'Booking completed successfully',
        data: {
          booking: booking,
          payment: paymentRecord
        }
      });
    } catch (error) {
      console.error('Error completing booking:', error);
      res.status(500).json({
        success: false,
        message: 'Error completing booking',
        error: error.message
      });
    }
  },

  // Get user bookings
  getUserBookings: async (req, res) => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      const filter = { user: userId };
      if (status) {
        filter.status = status;
      }

      const skip = (page - 1) * limit;

      const bookings = await Booking.find(filter)
        .populate('tour', 'title image duration location')
        .populate('tourDate', 'startDate endDate price')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Booking.countDocuments(filter);

      res.json({
        success: true,
        data: bookings,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching bookings',
        error: error.message
      });
    }
  },

  // Get single booking
  getBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.findOne({ bookingId: bookingId })
        .populate('tour')
        .populate('tourDate')
        .populate('user', 'name email');

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Get payment details
      const payment = await Payment.findOne({ booking: booking._id });

      res.json({
        success: true,
        data: {
          booking: booking,
          payment: payment
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching booking',
        error: error.message
      });
    }
  },

  // Cancel booking
  cancelBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { cancellationReason } = req.body;

      const booking = await Booking.findOne({ bookingId: bookingId })
        .populate('tourDate')
        .populate('tour');

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      if (booking.status === 'Cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Booking already cancelled'
        });
      }

      // Check if cancellation is allowed (e.g., 24 hours before tour)
      const tourStartDate = new Date(booking.tourDate.startDate);
      const currentDate = new Date();
      const hoursDiff = (tourStartDate - currentDate) / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        return res.status(400).json({
          success: false,
          message: 'Cancellation not allowed within 24 hours of tour start'
        });
      }

      // Calculate refund amount
      let refundPercentage = 0;
      if (hoursDiff > 48) {
        refundPercentage = 100;
      } else if (hoursDiff > 24) {
        refundPercentage = 50;
      }

      const refundAmount = (booking.totalAmount * refundPercentage) / 100;

      // Update booking
      booking.status = 'Cancelled';
      booking.cancellationDate = new Date();
      booking.cancellationReason = cancellationReason;
      booking.refundAmount = refundAmount;
      booking.paymentStatus = refundAmount > 0 ? 'Refunded' : 'Completed';

      await booking.save();

      // Restore tour date availability in TourDate document
      const tourDateDoc = await TourDate.findById(booking.tourDate._id);
      if (tourDateDoc) {
        tourDateDoc.bookedSlots = 0; // Reset since we allow only one booking per date
        tourDateDoc.status = 'Available';
        await tourDateDoc.save();
      }

      // Restore availability in Tour's embedded availableDates
      const tour = booking.tour;
      const tourDate = tour.availableDates.find(date => 
        date.startDate.getTime() === booking.tourDate.startDate.getTime()
      );
      if (tourDate) {
        tourDate.bookedSlots = 0; // Reset to 0
        tourDate.isAvailable = true; // Make available again
        await tour.save();
      }

      // Send cancellation email
      try {
        await sendMail({
          to: booking.primaryContact.email,
          subject: `Booking Cancelled: ${tour.title}`,
          html: `<h2>Booking Cancelled</h2>
            <p>Dear ${booking.primaryContact.name},</p>
            <p>Your booking for <b>${tour.title}</b> has been cancelled.</p>
            <ul>
              <li><b>Date:</b> ${new Date(booking.tourDate.startDate).toLocaleDateString()} - ${new Date(booking.tourDate.endDate).toLocaleDateString()}</li>
              <li><b>Guests:</b> ${booking.numberOfGuests}</li>
              <li><b>Refund Amount:</b> ₹${booking.refundAmount}</li>
            </ul>
            <p>If you have any questions, please contact us.</p>`
        });
      } catch (mailErr) {
        console.error('Error sending cancellation email:', mailErr);
      }

      res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: {
          refundAmount: refundAmount,
          refundPercentage: refundPercentage
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error cancelling booking',
        error: error.message
      });
    }
  },

  // Admin: Get all bookings
  getAllBookings: async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        tourId,
        dateFrom,
        dateTo 
      } = req.query;

      const filter = {};
      if (status) filter.status = status;
      if (tourId) filter.tour = tourId;
      if (dateFrom || dateTo) {
        filter.bookingDate = {};
        if (dateFrom) filter.bookingDate.$gte = new Date(dateFrom);
        if (dateTo) filter.bookingDate.$lte = new Date(dateTo);
      }

      const skip = (page - 1) * limit;

      const bookings = await Booking.find(filter)
        .populate('tour', 'title location')
        .populate('tourDate', 'startDate endDate')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Booking.countDocuments(filter);

      // Get stats
      const stats = await Booking.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' }
          }
        }
      ]);

      res.json({
        success: true,
        data: bookings,
        stats: stats,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching bookings',
        error: error.message
      });
    }
  },

  // Update booking status
  updateBookingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      booking.status = status;
      await booking.save();

      res.json({
        success: true,
        message: 'Booking status updated successfully',
        data: booking
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating booking status',
        error: error.message
      });
    }
  },

  // Get booking statistics
  getBookingStats: async (req, res) => {
    try {
      const stats = await Booking.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' }
          }
        }
      ]);

      const totalBookings = await Booking.countDocuments();
      const totalRevenue = await Booking.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]);

      res.json({
        success: true,
        data: {
          stats,
          totalBookings,
          totalRevenue: totalRevenue[0]?.total || 0
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching booking statistics',
        error: error.message
      });
    }
  }
};

module.exports = bookingController;