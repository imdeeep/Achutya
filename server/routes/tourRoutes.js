const express = require('express');
const router = express.Router();
const tourController = require('../controllers/TourController');
const { isAdmin } = require('../middleware/auth');

// Tour operations
router.post('/', isAdmin, tourController.createTour);
router.get('/', tourController.getAllTours);
router.get('/search', tourController.searchTours);
router.get('/:id', tourController.getTour);
router.put('/:id', isAdmin, tourController.updateTour);
router.delete('/:id', isAdmin, tourController.deleteTour);  // Soft-Deletion 

// Available dates management
router.get('/:id/available-dates', tourController.getAvailableDates);
router.post('/:id/available-dates', isAdmin, tourController.addAvailableDates);
router.put('/:tourId/available-dates/:dateId', isAdmin, tourController.updateAvailableDate);

// Booking specific dates {not needed rn}
// router.post('/:tourId/book-date/:dateId', tourController.bookTourDate);


router.get('/:tourId/available-dates', tourController.getTourDatesWithAvailability);

// Tours by destination
router.get('/destination/:destinationId', tourController.getToursByDestination);

// Admin routes - Get all tours (including inactive)
router.get('/admin/all', tourController.getAllToursAdmin);

// Hard delete tour (permanent deletion)
router.delete('/:id/permanent', isAdmin, tourController.permanentDeleteTour);


router.get('/featured/top', tourController.getTopFeaturedTours);       // Top 3 featured
router.get('/featured/latest', tourController.getAllFeaturedTours);    // All featured (latest first)

module.exports = router;