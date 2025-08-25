const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { isAdmin } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/submit', enquiryController.createEnquiry);

// Admin routes (authentication required)
router.get('/admin/all', isAdmin, enquiryController.getAllEnquiries);
router.get('/admin/stats', isAdmin, enquiryController.getEnquiryStats);
router.get('/admin/:id', isAdmin, enquiryController.getEnquiryById);
router.put('/admin/:id', isAdmin, enquiryController.updateEnquiry);
router.delete('/admin/:id', isAdmin, enquiryController.deleteEnquiry);

module.exports = router; 