const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const User = require('../models/User');

const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
    }
  }
}).single('profileImage');

router.post('/profile', protect, (req, res) => {
  req.setTimeout(30000); 
  res.setTimeout(30000);
  
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error'
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const uploadDir = path.join(__dirname, '../public/uploads/profile');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const userId = req.user._id;
      const firstName = req.body.firstName || req.user.firstName;
      const lastName = req.body.lastName || req.user.lastName;
      const safeName = `${firstName}_${lastName}`.replace(/[^a-zA-Z0-9_]/g, '');
      const fileName = `${userId}-${safeName}.jpg`;
      const outputPath = path.join(uploadDir, fileName);
      
      try {
        await sharp(req.file.buffer)
          .resize(256, 256, { fit: 'cover' })
          .jpeg({ quality: 90 })
          .toFile(outputPath);
      } catch (sharpError) {
        console.error('Sharp processing error (invalid image):', sharpError);
        return res.status(400).json({
          success: false,
          message: 'Invalid or corrupt image file. Please upload a valid image.'
        });
      }

      const filePath = `/uploads/profile/${fileName}`;
      console.log('Uploading for userId:', userId, 'Saving path:', filePath);
      const updatedUser = await User.findByIdAndUpdate(userId, { profileImage: filePath }, { new: true });
      console.log('Updated user profileImage:', updatedUser.profileImage);

      res.status(200).json({
        success: true,
        data: {
          imageUrl: filePath,
          fileName: fileName,
          size: fs.statSync(outputPath).size,
          type: 'image/jpeg'
        },
        message: 'Profile image uploaded successfully'
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload file'
      });
    }
  });
});

router.delete('/profile', protect, (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    const fileName = path.basename(imageUrl);
    const filePath = path.join(__dirname, '../public/uploads/profile', fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Image file not found'
      });
    }

    const userId = req.user._id.toString();
    if (!fileName.startsWith(userId)) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own profile images'
      });
    }

    fs.unlinkSync(filePath);
    
    res.status(200).json({
      success: true,
      message: 'Profile image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image'
    });
  }
});

module.exports = router; 