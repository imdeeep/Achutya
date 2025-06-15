const Destination = require('../models/Destination');

// Create a new destination
exports.createDestination = async (req, res) => {
    try {
        const destination = new Destination(req.body);
        await destination.save();
        res.status(201).json({ success: true, data: destination });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all destinations
exports.getDestinations = async (req, res) => {
    try {
        const { country, isActive } = req.query;
        const filter = {};
        
        if (country) filter.country = country;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        
        const destinations = await Destination.find(filter);
        res.status(200).json({ success: true, count: destinations.length, data: destinations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get single destination by ID
exports.getDestination = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) {
            return res.status(404).json({ success: false, error: 'Destination not found' });
        }
        res.status(200).json({ success: true, data: destination });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update destination
exports.updateDestination = async (req, res) => {
    try {
        const destination = await Destination.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!destination) {
            return res.status(404).json({ success: false, error: 'Destination not found' });
        }
        
        res.status(200).json({ success: true, data: destination });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get destination by name
exports.getDestinationByName = async (req, res) => {
    try {
        const { name } = req.params;
        const destination = await Destination.findOne({ name: new RegExp(`^${name}$`, 'i') });
        
        if (!destination) {
            return res.status(404).json({ success: false, error: 'Destination not found' });
        }
        
        res.status(200).json({ success: true, data: destination });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete destination
exports.deleteDestination = async (req, res) => {
    try {
        const destination = await Destination.findByIdAndDelete(req.params.id);
        
        if (!destination) {
            return res.status(404).json({ success: false, error: 'Destination not found' });
        }
        
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};