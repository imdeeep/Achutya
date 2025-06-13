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
  availableDates: [{
    date: {
      type: Date,
      required: true
    },
    maxBookings: {
      type: Number,
      default: 1 // How many people/groups can book this date
    },
    currentBookings: {
      type: Number,
      default: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    price: {
      type: Number // Optional: different price for different dates
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

// Method to get available dates (not fully booked)
tourSchema.methods.getAvailableDates = function() {
  return this.availableDates.filter(dateObj => 
    dateObj.isAvailable && 
    dateObj.currentBookings < dateObj.maxBookings &&
    dateObj.date >= new Date()
  );
};

// Method to book a date
tourSchema.methods.bookDate = function(dateId) {
  const dateObj = this.availableDates.id(dateId);
  if (!dateObj) {
    throw new Error('Date not found');
  }
  
  if (dateObj.currentBookings >= dateObj.maxBookings) {
    throw new Error('No slots available for this date');
  }
  
  dateObj.currentBookings += 1;
  
  // If fully booked, mark as unavailable
  if (dateObj.currentBookings >= dateObj.maxBookings) {
    dateObj.isAvailable = false;
  }
  
  return this.save();
};

tourSchema.set('toJSON', { virtuals: true });
tourSchema.set('toObject', { virtuals: true });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;