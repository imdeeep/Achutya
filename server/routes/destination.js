const express = require('express');
const router = express.Router();
const {
    createDestination,
    getDestinations,
    getDestination,
    updateDestination,
    deleteDestination,
    getDestinationByName,
    searchDestinations,
    searchBothDestinationAndTour,
    getDestinationBySlug
} = require('../controllers/Destination');
const { isAdmin } = require('../middleware/auth');

router.route('/')
    .get(getDestinations)          
    .post(isAdmin,createDestination);      

router.get('/search', searchDestinations);
router.get('/search/both/',searchBothDestinationAndTour)

router.get('/name/:name', getDestinationByName); 
router.get('/findtours/:slug', getDestinationBySlug);
router.route('/:id')
    .get(getDestination)           
    .put(isAdmin,updateDestination)        
    .delete(isAdmin,deleteDestination);
module.exports = router;
