const express = require('express');
const router = express.Router();
const {
    createDestination,
    getDestinations,
    getDestination,
    updateDestination,
    deleteDestination,
    getDestinationByName
} = require('../controllers/Destination');

router.route('/')
    .get(getDestinations)          
    .post(createDestination);      

router.get('/name/:name', getDestinationByName); 

router.route('/:id')
    .get(getDestination)           
    .put(updateDestination)        
    .delete(deleteDestination);    

module.exports = router;
