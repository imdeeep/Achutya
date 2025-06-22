const User = require('../models/User');
const Tour = require('../models/Tour');
const Destination = require('../models/Destination');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      adminCount,
      usersList,
      totalTours,
      activeTours,
      avgTourRating,
      topRatedTours,
      totalDestinations,
      indiaDest,
      intlDest,
      recentDest,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      recentBookings,
      totalPayments,
      successPayments,
      pendingPayments,
      failedPayments,
      revenue
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      User.find().sort({ createdAt: -1 }).limit(5).select('-password'),
      
      Tour.countDocuments(),
      Tour.countDocuments({ isActive: true }),
      Tour.aggregate([{ $group: { _id: null, avgRating: { $avg: "$rating" } } }]),
      Tour.find().sort({ rating: -1 }).limit(5).select('title rating slug'),

      Destination.countDocuments(),
      Destination.countDocuments({ country: 'India' }),
      Destination.countDocuments({ country: 'International' }),
      Destination.find().sort({ createdAt: -1 }).limit(5),

      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Confirmed' }),
      Booking.countDocuments({ status: 'Completed' }),
      Booking.countDocuments({ status: 'Cancelled' }),
      Booking.find().sort({ bookingDate: -1 }).limit(5).populate('user tour', 'name title'),

      Payment.countDocuments(),
      Payment.countDocuments({ status: 'Success' }),
      Payment.countDocuments({ status: 'Pending' }),
      Payment.countDocuments({ status: 'Failed' }),
      Payment.aggregate([
        { $match: { status: 'Success' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admins: adminCount,
          normalUsers: totalUsers - adminCount,
          latest: usersList
        },
        tours: {
          total: totalTours,
          active: activeTours,
          inactive: totalTours - activeTours,
          averageRating: Number(avgTourRating[0]?.avgRating || 0).toFixed(2),
          topRated: topRatedTours
        },
        destinations: {
          total: totalDestinations,
          india: indiaDest,
          international: intlDest,
          recent: recentDest
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
          recent: recentBookings
        },
        payments: {
          total: totalPayments,
          success: successPayments,
          pending: pendingPayments,
          failed: failedPayments,
          revenue: revenue[0]?.total || 0
        }
      }
    });
  } catch (err) {
    console.error('Stats Error:', err);
    res.status(500).json({ success: false, message: 'Stats fetch failed', error: err.message });
  }
};

module.exports = { getStats };
