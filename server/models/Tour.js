const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  isFeatured: {
    type: Boolean,
    default: false
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
      required: false
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
    },
    // Recurring config for this date (optional)
    recurring: {
      type: String, // e.g., 'none', 'weekly', 'monthly'
      enum: ['none', 'weekly', 'monthly'],
      default: 'none'
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
  },
  // Tour types (multiple allowed)
  types: [{
    type: String,
    enum: [
      'International Trips',
      'India Trips',
      'Weekend Trips',
      'Group Tours',
      'Honeymoon Packages',
      'early-bird',
      'Gift Cards'
    ]
  }],
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

// Virtuals for slots left and total slots per date
// (not mongoose virtuals, but helper methods)
tourSchema.methods.getDateSlotsInfo = function(dateObj) {
  return {
    totalSlots: dateObj.availableSlots,
    slotsLeft: Math.max(0, dateObj.availableSlots - dateObj.bookedSlots)
  };
};

// Generate recurring dates for the next 3 months (if recurring is set)
tourSchema.methods.generateRecurringDates = function() {
  const now = new Date();
  const threeMonthsLater = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
  let recDates = [];
  this.availableDates.forEach(dateObj => {
    if (!dateObj.recurring || dateObj.recurring === 'none') return;
    let start = new Date(dateObj.startDate);
    let end = new Date(dateObj.endDate);
    while (start < threeMonthsLater) {
      // Only add if not already present in availableDates
      const exists = this.availableDates.some(d =>
        d.startDate.getTime() === start.getTime() && d.endDate.getTime() === end.getTime()
      );
      if (!exists) {
        recDates.push({
          ...dateObj.toObject(),
          startDate: new Date(start),
          endDate: new Date(end),
          isRecurringInstance: true
        });
      }
      // Increment
      if (dateObj.recurring === 'weekly') {
        start.setDate(start.getDate() + 7);
        end.setDate(end.getDate() + 7);
      } else if (dateObj.recurring === 'monthly') {
        start.setMonth(start.getMonth() + 1);
        end.setMonth(end.getMonth() + 1);
      } else {
        break;
      }
    }
  });
  return recDates;
};
tourSchema.set('toJSON', { virtuals: true });
tourSchema.set('toObject', { virtuals: true });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;