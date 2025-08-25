const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const sharp = require('sharp');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dsefbhic4',
  api_key: '326494612843742',
  api_secret: 'rymsI1BCuhC5YbgcBJYVRjxEwxQ'
});

// Configure multer storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'itineraries',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });
const memoryUpload = multer({ storage: multer.memoryStorage() });

// Upload image endpoint
router.post('/image', memoryUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided' 
      });
    }

    // Only compress if file is an image
    let processedBuffer = req.file.buffer;
    let format = req.file.mimetype.split('/')[1];
    if (req.file.mimetype.startsWith('image/')) {
      // Use sharp for lossless compression
      processedBuffer = await sharp(req.file.buffer)
        .toFormat(format, { quality: 100, lossless: true })
        .withMetadata()
        .toBuffer();
    }

    // Upload processed buffer to Cloudinary
    const uploadResult = await cloudinary.uploader.upload_stream(
      {
        folder: 'itineraries',
        resource_type: 'image',
        format: format,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ success: false, error: 'Failed to upload image' });
        }
        res.json({ success: true, url: result.secure_url });
      }
    );
    // Write the processed buffer to the upload stream
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'itineraries',
        resource_type: 'image',
        format: format,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ success: false, error: 'Failed to upload image' });
        }
        res.json({ success: true, url: result.secure_url });
      }
    );
    stream.end(processedBuffer);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload image' 
    });
  }
});

module.exports = router; 