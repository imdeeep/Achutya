const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
uuidv4();

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    default : uuidv4,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour'
  },
  itinerary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary'
  },
  tourDate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourDate'
  },
  
  // Booking details
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 16 // Maximum guests per booking
  },
  totalAmount: {
    type: Number,
    required: true
  },
  pricePerPerson: {
    type: Number,
    required: true
  },
  
  primaryContact: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String
    }
  },
  
  // Booking status
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'Refunded'],
    default: 'Pending'
  },
  
  // Payment information
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partial', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  transactionId: {
    type: String
  },
  paidAmount: {
    type: Number,
    default: 0
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
  
  // Timestamps
  bookingDate: {
    type: Date,
    default: Date.now
  },
  confirmationDate: {
    type: Date
  },
  cancellationDate: {
    type: Date
  },
  
  // Cancellation details
  cancellationReason: {
    type: String
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generating unique booking ID
// bookingSchema.pre('save', function(next) {
//   if (!this.bookingId) {
//     const timestamp = Date.now().toString(36);
//     const randomStr = Math.random().toString(36).substr(2, 5);
//     this.bookingId = `WO${timestamp}${randomStr}`.toUpperCase();
//   }
//   this.updatedAt = Date.now();
//   next();
// });

// Validate that either tour or itinerary is present
bookingSchema.pre('save', function(next) {
  if (!this.tour && !this.itinerary) {
    next(new Error('Either tour or itinerary must be specified'));
  }
  if (this.tour && this.itinerary) {
    next(new Error('Cannot specify both tour and itinerary'));
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;