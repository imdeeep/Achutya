const express = require('express');
const router = express.Router();
const {
    createDestination,
    getDestinations,
    getDestination,
    updateDestination,
    deleteDestination,
    getDestinationByName,
    searchDestinations
} = require('../controllers/Destination');

router.route('/')
    .get(getDestinations)          
    .post(createDestination);      

router.get('/search', searchDestinations);

router.get('/name/:name', getDestinationByName); 

router.route('/:id')
    .get(getDestination)           
    .put(updateDestination)        
    .delete(deleteDestination);
    


module.exports = router;
