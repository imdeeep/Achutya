const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Online', 'Cash', 'Bank Transfer', 'UPI','Razorpay'],
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed // Store gateway response
  },
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed', 'Cancelled'],
    default: 'Pending'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  },
  
  // Payment breakdown for transparency
  paymentBreakdown: {
    baseAmount: {
      type: Number,
      required: false
    },
    gstAmount: {
      type: Number,
      required: false
    },
    gatewayFee: {
      type: Number,
      required: false
    },
    totalAmount: {
      type: Number,
      required: false
    }
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;