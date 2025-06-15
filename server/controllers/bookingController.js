const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const Itinerary = require('../models/Itinerary');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const {
      tour,
      itinerary,
      tourDate,
      numberOfGuests,
      totalAmount,
      pricePerPerson,
      primaryContact
    } = req.body;

    // Validate that either tour or itinerary is present
    if (!tour && !itinerary) {
      return res.status(400).json({
        success: false,
        error: 'Either tour or itinerary must be specified'
      });
    }

    if (tour && itinerary) {
      return res.status(400).json({
        success: false,
        error: 'Cannot specify both tour and itinerary'
      });
    }

    // If tour is specified, verify it exists
    if (tour) {
      const tourExists = await Tour.findById(tour);
      if (!tourExists) {
        return res.status(404).json({
          success: false,
          error: 'Tour not found'
        });
      }
    }

    // If itinerary is specified, verify it exists
    if (itinerary) {
      const itineraryExists = await Itinerary.findById(itinerary);
      if (!itineraryExists) {
        return res.status(404).json({
          success: false,
          error: 'Itinerary not found'
        });
      }
    }

    const booking = new Booking({
      user: req.user._id,
      tour,
      itinerary,
      tourDate,
      numberOfGuests,
      totalAmount,
      pricePerPerson,
      primaryContact
    });

    await booking.save();

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('tour', 'title')
      .populate('itinerary', 'title')
      .populate('tourDate', 'date');

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('tour', 'title')
      .populate('itinerary', 'title')
      .populate('tourDate', 'date');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Verify booking belongs to user or user is admin
    if (booking.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('tour', 'title')
      .populate('itinerary', 'title')
      .populate('tourDate', 'date');

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Verify booking belongs to user or user is admin
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    booking.status = status;
    
    // Update relevant dates based on status
    if (status === 'Confirmed') {
      booking.confirmationDate = Date.now();
    } else if (status === 'Cancelled') {
      booking.cancellationDate = Date.now();
    }

    await booking.save();

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Verify booking belongs to user or user is admin
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'Cancelled' || booking.status === 'Completed') {
      return res.status(400).json({
        success: false,
        error: 'Booking cannot be cancelled'
      });
    }

    booking.status = 'Cancelled';
    booking.cancellationDate = Date.now();
    booking.cancellationReason = cancellationReason;

    // Calculate refund amount based on cancellation policy
    // This is a simple example - you might want to implement a more complex policy
    const daysUntilTour = booking.tourDate ? 
      Math.ceil((new Date(booking.tourDate.date) - new Date()) / (1000 * 60 * 60 * 24)) : 
      null;

    if (daysUntilTour && daysUntilTour > 7) {
      booking.refundAmount = booking.paidAmount * 0.8; // 80% refund
    } else if (daysUntilTour && daysUntilTour > 3) {
      booking.refundAmount = booking.paidAmount * 0.5; // 50% refund
    } else {
      booking.refundAmount = 0; // No refund
    }

    await booking.save();

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get booking statistics (admin only)
const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });
    const completedBookings = await Booking.countDocuments({ status: 'Completed' });

    const totalRevenue = await Booking.aggregate([
      { $match: { status: { $in: ['Confirmed', 'Completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        completedBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  getUserBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
}; 