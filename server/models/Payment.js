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
    enum: ['Online', 'Cash', 'Bank Transfer', 'UPI'],
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;