const express = require('express');
const router = express.Router();
const tourController = require('../controllers/TourController');

// Tour operations
router.post('/', tourController.createTour);
router.get('/', tourController.getAllTours);
router.get('/search', tourController.searchTours);
router.get('/:id', tourController.getTour);
router.put('/:id', tourController.updateTour);
router.delete('/:id', tourController.deleteTour);  // Soft-Deletion 

// Available dates management
router.get('/:id/available-dates', tourController.getAvailableDates);
router.post('/:id/available-dates', tourController.addAvailableDates);
router.put('/:tourId/available-dates/:dateId', tourController.updateAvailableDate);

// Booking specific dates {not needed rn}
// router.post('/:tourId/book-date/:dateId', tourController.bookTourDate);


router.get('/:tourId/available-dates', tourController.getTourDatesWithAvailability);

// Tours by destination
router.get('/destination/:destinationId', tourController.getToursByDestination);

// Admin routes - Get all tours (including inactive)
router.get('/admin/all', tourController.getAllToursAdmin);

// Hard delete tour (permanent deletion)
router.delete('/:id/permanent', tourController.permanentDeleteTour);

module.exports = router;