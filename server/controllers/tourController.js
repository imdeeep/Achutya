const Tour = require('../models/Tour');

// Create a new tour
exports.createTour = async (req, res) => {
  try {
    const tour = new Tour(req.body);
    await tour.save();
    res.status(201).json({
      success: true,
      data: tour
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all tours
exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      success: true,
      count: tours.length,
      data: tours
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single tour
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }
    res.status(200).json({
      success: true,
      data: tour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update tour
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tour
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete tour
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
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