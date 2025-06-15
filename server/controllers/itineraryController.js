const Itinerary = require('../models/Itinerary');

// Create a new itinerary
exports.createItinerary = async (req, res) => {
  try {
    const itinerary = new Itinerary(req.body);
    await itinerary.save();
    res.status(201).json({
      success: true,
      data: itinerary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all itineraries
exports.getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: itineraries.length,
      data: itineraries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single itinerary
exports.getItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({
        success: false,
        error: 'Itinerary not found'
      });
    }
    res.status(200).json({
      success: true,
      data: itinerary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update itinerary
exports.updateItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!itinerary) {
      return res.status(404).json({
        success: false,
        error: 'Itinerary not found'
      });
    }
    res.status(200).json({
      success: true,
      data: itinerary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete itinerary
exports.deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!itinerary) {
      return res.status(404).json({
        success: false,
        error: 'Itinerary not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 