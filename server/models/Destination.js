const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  country: {
    type: String,
    required: true,
    enum: ['India', 'International']
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
  highlights: [{
    type: String
  }],
  bestTimeToVisit: {
    type: String
  },
  climate: {
    type: String
  },
  currency: {
    type: String
  },
  language: {
    type: String
  },
  timeZone: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Creating slug from name
destinationSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;