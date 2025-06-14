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
    required:true,
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
    type: String, // e.g., "Delhi - Delhi"
    required: true
  },
  
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

// middleware to update updatedAt
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

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour


