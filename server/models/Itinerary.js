const mongoose = require('mongoose');

const itineraryDaySchema = new mongoose.Schema({
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
    type: String,
    required: true
  }],
  distance: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: ''
  },
  accommodation: {
    type: String,
    required: true
  },
  meals: {
    type: String,
    required: true
  }
});

const itinerarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  groupType: {
    type: String,
    required: true,
    enum: ['Group', 'Private', 'Custom']
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  highlights: [{
    type: String,
    required: true
  }],
  inclusions: [{
    type: String,
    required: true
  }],
  exclusions: [{
    type: String,
    required: true
  }],
  essentials: [{
    type: String,
    required: true
  }],
  notes: [{
    type: String,
    required: true
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
  itinerary: [itineraryDaySchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
itinerarySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Itinerary', itinerarySchema); 