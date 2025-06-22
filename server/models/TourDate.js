const mongoose = require('mongoose');

const tourDateSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  availableSlots: {
    type: Number,
    required: true,
    default: 16
  },
  bookedSlots: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Booked', 'Sold Out', 'Cancelled'],
    default: 'Available'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Additional fields for better tracking
  bookingId: {
    type: String, // Reference to the booking that booked this date
    default: null
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  bookedAt: {
    type: Date,
    default: null
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

// Updating status based on booking logic
// Since we allow only one booking per date, status is either Available or Booked/Sold Out
tourDateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // For this business logic: one booking takes the entire date
  if (this.bookedSlots > 0) {
    this.status = 'Sold Out'; // or 'Booked' - you can choose
  } else {
    this.status = 'Available';
  }
  
  next();
});

// Method to check if date is available for booking
tourDateSchema.methods.isAvailableForBooking = function() {
  return this.bookedSlots === 0 && this.isActive && this.status === 'Available';
};

// Method to book this date
tourDateSchema.methods.bookDate = function(bookingId, userId, numberOfGuests) {
  if (!this.isAvailableForBooking()) {
    throw new Error('This date is not available for booking');
  }
  
  this.bookedSlots = numberOfGuests;
  this.bookingId = bookingId;
  this.bookedBy = userId;
  this.bookedAt = new Date();
  this.status = 'Sold Out';
  
  return this.save();
};

// Method to cancel booking and make date available again
tourDateSchema.methods.cancelBooking = function() {
  this.bookedSlots = 0;
  this.bookingId = null;
  this.bookedBy = null;
  this.bookedAt = null;
  this.status = 'Available';
  
  return this.save();
};

// Index for better query performance
tourDateSchema.index({ tour: 1, startDate: 1 });
tourDateSchema.index({ status: 1, isActive: 1 });

const TourDate = mongoose.model('TourDate', tourDateSchema);

module.exports = TourDate;