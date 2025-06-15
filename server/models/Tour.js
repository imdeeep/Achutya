const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  heroImage: {
    required: true,
    type: String
  },
  duration: {
    type: String,
    required: true // e.g., "6N - 7D"
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  discount: {
    type: Number,
    default: 0
  },
  groupType: {
    type: String,
    enum: ['Group', 'Individual', 'Private'],
    default: 'Group'
  },
  maxGroupSize: {
    type: Number,
    default: 16
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging', 'Difficult'],
    default: 'Moderate'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  country: {
    type: String,
    required: true,
    enum: ['India', 'International']
  },
  city: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },

  // Additional destinations for multi-destination tours
  additionalDestinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  }],
  
  // AVAILABLE DATES - When this tour can be offered
  // This is simplified - just the basic date info
  availableDates: [{
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    availableSlots: {
      type: Number,
      default: 16
    },
    bookedSlots: {
      type: Number,
      default: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    notes: {
      type: String // Optional: special notes for this date
    }
  }],
  
  // Detailed tour information
  highlights: [{
    type: String
  }],
  
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    activities: [{
      type: String
    }],
    distance: String,
    duration: String,
    accommodation: String,
    meals: String
  }],
  
  inclusions: [{
    type: String
  }],
  
  exclusions: [{
    type: String
  }],
  
  essentials: [{
    type: String
  }],
  
  notes: [{
    type: String
  }],
  
  features: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  
  // Tour status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // SEO and metadata
  slug: {
    type: String,
    unique: true,
    required: true
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

// Middleware to update updatedAt
tourSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Creating slug from title
tourSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Method to get available dates (not booked)
tourSchema.methods.getAvailableDates = function() {
  const currentDate = new Date();
  return this.availableDates.filter(dateObj => 
    dateObj.isAvailable && 
    dateObj.bookedSlots === 0 && // Changed: must be completely unbooked
    dateObj.startDate >= currentDate
  );
};

// Method to check if a date is available for booking
tourSchema.methods.isDateAvailable = function(dateId) {
  const dateObj = this.availableDates.id(dateId);
  if (!dateObj) return false;
  
  return dateObj.isAvailable && dateObj.bookedSlots === 0;
};

// Method to book a date (marks entire date as booked)
tourSchema.methods.bookDate = function(dateId, numberOfGuests) {
  const dateObj = this.availableDates.id(dateId);
  if (!dateObj) {
    throw new Error('Date not found');
  }
  
  if (dateObj.bookedSlots > 0 || !dateObj.isAvailable) {
    throw new Error('This date is already booked');
  }
  
  // Book the entire date for this group
  dateObj.bookedSlots = numberOfGuests;
  dateObj.isAvailable = false; // Mark as unavailable since it's now booked
  
  return this.save();
};

// Method to cancel a booking and make date available again
tourSchema.methods.cancelDateBooking = function(dateId) {
  const dateObj = this.availableDates.id(dateId);
  if (!dateObj) {
    throw new Error('Date not found');
  }
  
  // Reset the date availability
  dateObj.bookedSlots = 0;
  dateObj.isAvailable = true;
  
  return this.save();
};

// Method to get booking status for a date
tourSchema.methods.getDateBookingStatus = function(dateId) {
  const dateObj = this.availableDates.id(dateId);
  if (!dateObj) return null;
  
  return {
    dateId: dateId,
    startDate: dateObj.startDate,
    endDate: dateObj.endDate,
    price: dateObj.price,
    bookedSlots: dateObj.bookedSlots,
    isAvailable: dateObj.isAvailable,
    status: dateObj.bookedSlots > 0 ? 'Booked' : 'Available'
  };
};
tourSchema.set('toJSON', { virtuals: true });
tourSchema.set('toObject', { virtuals: true });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;