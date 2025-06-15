const Tour = require('../models/Tour');
const TourDate = require('../models/TourDate');
const Destination = require('../models/Destination');
const mongoose = require('mongoose');

const tourController = {
  // Create a new tour
  createTour: async (req, res) => {
    try {
      // Validate destination exists
      if (req.body.destination) {
        const destinationExists = await Destination.findById(req.body.destination);
        if (!destinationExists) {
          return res.status(400).json({
            success: false,
            message: 'Invalid destination ID'
          });
        }
      }
  
      const tour = new Tour(req.body);
      const savedTour = await tour.save();
  
      // If availableDates are provided, create corresponding TourDate documents
      if (req.body.availableDates && req.body.availableDates.length > 0) {
        const tourDatePromises = req.body.availableDates.map(dateObj => {
          const tourDate = new TourDate({
            tour: savedTour._id,
            startDate: new Date(dateObj.startDate),
            endDate: new Date(dateObj.endDate),
            price: dateObj.price || savedTour.price,
            availableSlots: dateObj.availableSlots || savedTour.maxGroupSize || 16,
            bookedSlots: 0,
            status: 'Available',
            isActive: true
          });
          return tourDate.save();
        });
  
        await Promise.all(tourDatePromises);
      }
  
      // Populate destination details
      await savedTour.populate('destination', 'name country description image heroImage');
  
      res.status(201).json({
        success: true,
        message: 'Tour created successfully',
        data: savedTour
      });
    } catch (error) {
      console.error('Error creating tour:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating tour',
        error: error.message
      });
    }
  },

  // Get all tours with optional filters
  getAllTours: async (req, res) => {
    try {
      const {
        country,
        city,
        difficulty,
        groupType,
        minPrice,
        maxPrice,
        destination,
        isActive = true,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filter = { isActive };

      // Add filters
      if (country) filter.country = country;
      if (city) filter.city = new RegExp(city, 'i');
      if (difficulty) filter.difficulty = difficulty;
      if (groupType) filter.groupType = groupType;
      if (destination) filter.destination = destination;
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      const skip = (page - 1) * limit;
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const tours = await Tour.find(filter)
        .populate('destination', 'name country description image heroImage bestTimeToVisit')
        .populate('additionalDestinations', 'name country image')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));

      const total = await Tour.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: tours,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching tours',
        error: error.message
      });
    }
  },

  // Get all tours both active/inActive
  getAllToursAdmin: async (req, res) => {
    try {
      const {
        country,
        city,
        difficulty,
        groupType,
        minPrice,
        maxPrice,
        destination,
        isActive,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filter = {};

      if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
      }

      if (country) filter.country = country;
      if (city) filter.city = new RegExp(city, 'i');
      if (difficulty) filter.difficulty = difficulty;
      if (groupType) filter.groupType = groupType;
      if (destination) filter.destination = destination;
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      const skip = (page - 1) * limit;
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const tours = await Tour.find(filter)
        .populate('destination', 'name country description image heroImage bestTimeToVisit')
        .populate('additionalDestinations', 'name country image')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));

      const total = await Tour.countDocuments(filter);
      const activeTours = await Tour.countDocuments({ isActive: true });
      const inactiveTours = await Tour.countDocuments({ isActive: false });

      res.status(200).json({
        success: true,
        data: tours,
        stats: {
          total: total,
          active: activeTours,
          inactive: inactiveTours
        },
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching tours',
        error: error.message
      });
    }
  },

  // Permanent delete tour (hard delete)
  permanentDeleteTour: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if tour exists
      const tour = await Tour.findById(id);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      //   Sec-Check : Check if tour has any bookings before permanent deletion
      //   const hasBookings = await Booking.findOne({ tour: id });
      //   if (hasBookings) {
      //     return res.status(400).json({
      //       success: false,
      //       message: 'Cannot permanently delete tour with existing bookings'
      //     });
      //   }

      await Tour.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Tour permanently deleted successfully',
        data: {
          deletedTour: {
            id: tour._id,
            title: tour.title,
            slug: tour.slug
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error permanently deleting tour',
        error: error.message
      });
    }
  },

  // Get single tour by ID or slug
  getTour: async (req, res) => {
    try {
      const { id } = req.params;
      let tour;

      // Check if it's a valid ObjectId, otherwise search by slug
      if (mongoose.Types.ObjectId.isValid(id)) {
        tour = await Tour.findById(id)
          .populate('destination')
          .populate('additionalDestinations', 'name country image description');
      } else {
        tour = await Tour.findOne({ slug: id })
          .populate('destination')
          .populate('additionalDestinations', 'name country image description');
      }

      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      res.status(200).json({
        success: true,
        data: tour
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching tour',
        error: error.message
      });
    }
  },

  // Get available dates for a tour
  getAvailableDates: async (req, res) => {
    try {
      const { id } = req.params;
      let tour;

      if (mongoose.Types.ObjectId.isValid(id)) {
        tour = await Tour.findById(id);
      } else {
        tour = await Tour.findOne({ slug: id });
      }

      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      const availableDates = tour.getAvailableDates();

      res.status(200).json({
        success: true,
        data: {
          tourId: tour._id,
          tourTitle: tour.title,
          availableDates: availableDates
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching available dates',
        error: error.message
      });
    }
  },

  // addAvailableDates method for tour controller
  addAvailableDates: async (req, res) => {
    try {
      const { id } = req.params;
      const { dates } = req.body; // Array of date objects
  
      const tour = await Tour.findById(id);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }
  
      // Add new dates to tour's availableDates array
      const addedDates = [];
      const tourDateDocuments = [];
  
      for (const dateObj of dates) {
        // Check if this date already exists for this tour
        const existingTourDate = await TourDate.findOne({
          tour: tour._id,
          startDate: new Date(dateObj.startDate)
        });
  
        if (existingTourDate) {
          continue; // Skip if already exists
        }
  
        // Add to tour's embedded availableDates
        const newAvailableDate = {
          startDate: new Date(dateObj.startDate),
          endDate: new Date(dateObj.endDate),
          price: dateObj.price || tour.price,
          availableSlots: dateObj.availableSlots || tour.maxGroupSize || 16,
          bookedSlots: 0,
          isAvailable: true,
          notes: dateObj.notes
        };
  
        tour.availableDates.push(newAvailableDate);
        addedDates.push(newAvailableDate);
  
        // Create corresponding TourDate document
        const tourDate = new TourDate({
          tour: tour._id,
          startDate: new Date(dateObj.startDate),
          endDate: new Date(dateObj.endDate),
          price: dateObj.price || tour.price,
          availableSlots: dateObj.availableSlots || tour.maxGroupSize || 16,
          bookedSlots: 0,
          status: 'Available',
          isActive: true
        });
  
        const savedTourDate = await tourDate.save();
        tourDateDocuments.push(savedTourDate);
      }
  
      await tour.save();
  
      res.status(200).json({
        success: true,
        message: 'Available dates added successfully',
        data: {
          addedDates: addedDates,
          tourDateDocuments: tourDateDocuments,
          totalAvailableDates: tour.availableDates.length
        }
      });
    } catch (error) {
      console.error('Error adding available dates:', error);
      res.status(400).json({
        success: false,
        message: 'Error adding available dates',
        error: error.message
      });
    }
  },  

  // Remove/Update available date
  updateAvailableDate: async (req, res) => {
    try {
      const { tourId, dateId } = req.params;
      const updates = req.body;

      const tour = await Tour.findById(tourId);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      const dateObj = tour.availableDates.id(dateId);
      if (!dateObj) {
        return res.status(404).json({
          success: false,
          message: 'Date not found'
        });
      }

      // Update the date object
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
          dateObj[key] = updates[key];
        }
      });

      await tour.save();

      res.status(200).json({
        success: true,
        message: 'Available date updated successfully',
        data: dateObj
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error updating available date',
        error: error.message
      });
    }
  },

  // Update tour
  updateTour: async (req, res) => {
    try {
      const { id } = req.params;
      const tour = await Tour.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );

      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Tour updated successfully',
        data: tour
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error updating tour',
        error: error.message
      });
    }
  },

  // Delete tour (soft delete by setting isActive to false)
  deleteTour: async (req, res) => {
    try {
      const { id } = req.params;
      const tour = await Tour.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: Date.now() },
        { new: true }
      );

      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Tour deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting tour',
        error: error.message
      });
    }
  },

  // Search tours
  searchTours: async (req, res) => {
    try {
      const { q, country, city, difficulty, destination } = req.query;

      const searchFilter = { isActive: true };

      // Text search
      if (q) {
        searchFilter.$or = [
          { title: new RegExp(q, 'i') },
          { description: new RegExp(q, 'i') },
          { city: new RegExp(q, 'i') },
          { location: new RegExp(q, 'i') }
        ];
      }

      // Additional filters
      if (country) searchFilter.country = country;
      if (city) searchFilter.city = new RegExp(city, 'i');
      if (difficulty) searchFilter.difficulty = difficulty;
      if (destination) searchFilter.destination = destination;

      const tours = await Tour.find(searchFilter)
        .populate('destination', 'name country image')
        .populate('additionalDestinations', 'name country image')
        .sort({ rating: -1, reviewCount: -1 })
        .limit(20);

      res.status(200).json({
        success: true,
        data: tours,
        count: tours.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching tours',
        error: error.message
      });
    }
  },

  // Get tours by destination
  getToursByDestination: async (req, res) => {
    try {
      const { destinationId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const destination = await Destination.findById(destinationId);
      if (!destination) {
        return res.status(404).json({
          success: false,
          message: 'Destination not found'
        });
      }

      const skip = (page - 1) * limit;

      const tours = await Tour.find({
        $or: [
          { destination: destinationId },
          { additionalDestinations: destinationId }
        ],
        isActive: true
      })
        .populate('destination', 'name country image')
        .populate('additionalDestinations', 'name country image')
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Tour.countDocuments({
        $or: [
          { destination: destinationId },
          { additionalDestinations: destinationId }
        ],
        isActive: true
      });

      res.status(200).json({
        success: true,
        data: {
          destination,
          tours,
          pagination: {
            current: Number(page),
            pages: Math.ceil(total / limit),
            total,
            hasNext: page * limit < total,
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching tours by destination',
        error: error.message
      });
    }
  },

  // Book a specific date {not needed rn}
  //     bookTourDate: async (req, res) => {
  //     try {
  //       const { tourId, dateId } = req.params;
  //       const { customerInfo } = req.body;

  //       const tour = await Tour.findById(tourId);
  //       if (!tour) {
  //         return res.status(404).json({
  //           success: false,
  //           message: 'Tour not found'
  //         });
  //       }

  //       // Book the date
  //       await tour.bookDate(dateId);

  //       // Create a TourDate record for this booking
  //       const bookedDate = tour.availableDates.id(dateId);
  //       const tourDate = new TourDate({
  //         tour: tourId,
  //         startDate: bookedDate.date,
  //         endDate: new Date(bookedDate.date.getTime() + (parseInt(tour.duration) * 24 * 60 * 60 * 1000)),
  //         price: bookedDate.price || tour.price,
  //         availableSlots: tour.maxGroupSize,
  //         bookedSlots: 1,
  //         // status: 'confirmed',
  //         customerInfo: customerInfo
  //       });

  //       await tourDate.save();

  //       res.status(200).json({
  //         success: true,
  //         message: 'Tour date booked successfully',
  //         data: {
  //           tourDate: tourDate,
  //           remainingSlots: bookedDate.maxBookings - bookedDate.currentBookings
  //         }
  //       });
  //     } catch (error) {
  //       res.status(400).json({
  //         success: false,
  //         message: 'Error booking tour date',
  //         error: error.message
  //       });
  //     }
  // },

  // Get available tour dates with booking info
  getTourDatesWithAvailability: async (req, res) => {
    try {
      const { tourId } = req.params;

      const tourDates = await TourDate.find({
        tour: tourId,
        isActive: true,
        startDate: { $gte: new Date() } // Only future dates
      }).sort({ startDate: 1 });

      const datesWithAvailability = tourDates.map(date => ({
        _id: date._id,
        startDate: date.startDate,
        endDate: date.endDate,
        price: date.price,
        totalSlots: date.availableSlots,
        bookedSlots: date.bookedSlots,
        availableSlots: date.availableSlots - date.bookedSlots,
        status: date.status,
        isBookable: (date.availableSlots - date.bookedSlots) > 0
      }));

      res.json({
        success: true,
        data: datesWithAvailability
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching tour dates',
        error: error.message
      });
    }
  }
};
module.exports = tourController;