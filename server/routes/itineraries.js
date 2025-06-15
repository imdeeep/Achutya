const express = require('express');
const router = express.Router();
const {
  createItinerary,
  getAllItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary
} = require('../controllers/itineraryController');

router.route('/')
  .post(createItinerary)
  .get(getAllItineraries);

router.route('/:id')
  .get(getItinerary)
  .put(updateItinerary)
  .delete(deleteItinerary);

module.exports = router; 