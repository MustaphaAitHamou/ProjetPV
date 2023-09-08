// Importing the required libraries and modules
const router = require('express').Router(); // Express router for handling routes
const User = require('../models/User');    // Importing the User model
const Order = require('../models/Order');  // Importing the Order model

// Route for user signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body; // Extracting user data from the request body

  try {
    // Creating a new user with the provided data
    const user = await User.create({ name, email, password });
    res.json(user); // Sending a JSON response with the created user
  } catch (e) {
    if (e.code === 11000) return res.status(400).send('Email already exists'); // Checking for duplicate email error
    res.status(400).send(e.message); // Sending a 400 Bad Request response with the error message
  }
});

// Route for user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extracting user email and password from the request body
  try {
    // Finding the user by email and validating the password
    const user = await User.findByCredentials(email, password);
    res.json(user); // Sending a JSON response with the authenticated user
  } catch (e) {
    res.status(400).send(e.message); // Sending a 400 Bad Request response with the error message
  }
});

// Route for getting all non-admin users
router.get('/', async (req, res) => {
  try {
    // Finding all users who are not admins and populating their orders
    const users = await User.find({ isAdmin: false }).populate('orders');
    res.json(users); // Sending a JSON response with the non-admin users
  } catch (e) {
    res.status(400).send(e.message); // Sending a 400 Bad Request response with the error message
  }
});

// Route for getting a user's orders
router.get('/:id/orders', async (req, res) => {
  const { id } = req.params; // Extracting the user ID from the request parameters
  try {
    // Finding the user by their ID and populating their orders
    const user = await User.findById(id).populate('orders');
    res.json(user.orders); // Sending a JSON response with the user's orders
  } catch (e) {
    res.status(400).send(e.message); // Sending a 400 Bad Request response with the error message
  }
});

// Route for updating user notifications to mark them as read
router.post('/:id/updateNotifications', async (req, res) => {
  const { id } = req.params; // Extracting the user ID from the request parameters
  try {
    // Finding the user by their ID
    const user = await User.findById(id);
    
    // Updating the status of each notification to "read"
    user.notifications.forEach((notif) => {
      notif.status = "read";
    });
    
    user.markModified('notifications'); // Marking the notifications field as modified
    await user.save(); // Saving the updated user
    res.status(200).send(); // Sending a 200 OK response
  } catch (e) {
    res.status(400).send(e.message); // Sending a 400 Bad Request response with the error message
  }
});

module.exports = router; // Exporting the router for use in the application
