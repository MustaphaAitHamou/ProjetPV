// Importing the required libraries and modules
const cloudinary = require('cloudinary');
const router = require('express').Router();
require('dotenv').config();

// Configuring Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,         // Cloudinary cloud name
  api_key: process.env.CLOUD_API_KEY,          // Cloudinary API key
  api_secret: process.env.CLOUD_API_SECRET     // Cloudinary API secret
});

// Route for deleting an image on Cloudinary by public ID
router.delete('/:public_id', async (req, res) => {
  const { public_id } = req.params;  // Extracting public_id from request parameters
  try {
    // Attempt to delete the image on Cloudinary using the public ID
    await cloudinary.uploader.destroy(public_id);
    res.status(200).send(); // If successful, send a 200 OK response
  } catch (e) {
    res.status(400).send(e.message); // If there's an error, send a 400 Bad Request response with the error message
  }
});

module.exports = router; // Exporting the router for use in the application
