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
    enum: ['Available', 'Filling Fast', 'Sold Out', 'Cancelled'],
    default: 'Available'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Updating status based on availability
tourDateSchema.pre('save', function(next) {
  const remainingSlots = this.availableSlots - this.bookedSlots;
  
  if (remainingSlots <= 0) {
    this.status = 'Sold Out';
  } else if (remainingSlots <= 3) {
    this.status = 'Filling Fast';
  } else {
    this.status = 'Available';
  }
  
  next();
});

const TourDate = mongoose.model('TourDate', tourDateSchema);

module.exports = TourDate;