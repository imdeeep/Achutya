const Enquiry = require('../models/Enquiry');

// Create a new enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const { name, phoneNumber, email, message } = req.body;

    // Basic validation
    if (!name || !phoneNumber || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name, phone number, and email are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Phone validation (basic 10 digit check)
    if (phoneNumber.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Phone number must be at least 10 digits'
      });
    }

    const enquiry = new Enquiry({
      name,
      phoneNumber,
      email,
      message: message || ''
    });

    await enquiry.save();

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! We will contact you soon.',
      data: enquiry
    });

  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit enquiry. Please try again.'
    });
  }
};

// Get all enquiries (admin only)
exports.getAllEnquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    let query = {};
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Enquiry.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: enquiries,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch enquiries'
    });
  }
};

// Get enquiry by ID
exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        error: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      data: enquiry
    });

  } catch (error) {
    console.error('Error fetching enquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch enquiry'
    });
  }
};

// Update enquiry status and notes
exports.updateEnquiry = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        error: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Enquiry updated successfully',
      data: enquiry
    });

  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update enquiry'
    });
  }
};

// Delete enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        error: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Enquiry deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete enquiry'
    });
  }
};

// Get enquiry statistics for admin dashboard
exports.getEnquiryStats = async (req, res) => {
  try {
    const totalEnquiries = await Enquiry.countDocuments();
    const pendingEnquiries = await Enquiry.countDocuments({ status: 'pending' });
    const contactedEnquiries = await Enquiry.countDocuments({ status: 'contacted' });
    const resolvedEnquiries = await Enquiry.countDocuments({ status: 'resolved' });
    const spamEnquiries = await Enquiry.countDocuments({ status: 'spam' });

    // Get recent enquiries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentEnquiries = await Enquiry.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get monthly trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - i);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      
      const count = await Enquiry.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate }
      });
      
      monthlyTrend.push({
        month: startDate.toLocaleString('default', { month: 'short' }),
        count
      });
    }

    res.json({
      success: true,
      data: {
        total: totalEnquiries,
        pending: pendingEnquiries,
        contacted: contactedEnquiries,
        resolved: resolvedEnquiries,
        spam: spamEnquiries,
        recent: recentEnquiries,
        monthlyTrend
      }
    });

  } catch (error) {
    console.error('Error fetching enquiry stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch enquiry statistics'
    });
  }
}; 