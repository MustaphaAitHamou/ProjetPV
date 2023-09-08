// Importing the required libraries and modules
const router = require('express').Router(); // Express router for handling routes
const Order = require('../models/Order'); // Importing the Order model
const User = require('../models/User');   // Importing the User model

// Route for creating an order
router.post('/', async (req, res) => {
  const io = req.app.get('socketio'); // Getting the socket.io instance from the app
  const { userId, cart, country, address } = req.body; // Extracting data from the request body
  try {
    // Finding the user by their ID
    const user = await User.findById(userId);
    
    // Creating a new order and associating it with the user
    const order = await Order.create({ owner: user._id, products: cart, country, address });
    order.count = cart.count;
    order.total = cart.total;
    await order.save();
    
    // Resetting the user's cart and adding the order to their orders list
    user.cart = { total: 0, count: 0 };
    user.orders.push(order);
    
    // Creating a notification for the new order and emitting it via socket.io
    const notification = { status: 'unread', message: `New order from ${user.name}`, time: new Date() };
    io.sockets.emit('new-order', notification);
    user.markModified('orders');
    await user.save();
    
    res.status(200).json(user); // Sending a JSON response with the updated user data
  } catch (e) {
    res.status(400).json(e.message); // Sending a 400 Bad Request response with the error message
  }
});

// Route for getting all orders
router.get('/', async (req, res) => {
  try {
    // Finding all orders and populating the 'owner' field with 'email' and 'name'
    const orders = await Order.find().populate('owner', ['email', 'name']);
    res.status(200).json(orders); // Sending a JSON response with the orders
  } catch (e) {
    res.status(400).json(e.message); // Sending a 400 Bad Request response with the error message
  }
});

// Route for marking an order as shipped
router.patch('/:id/mark-shipped', async (req, res) => {
  const io = req.app.get('socketio'); // Getting the socket.io instance from the app
  const { ownerId } = req.body; // Extracting ownerId from the request body
  const { id } = req.params; // Extracting the order id from the request parameters
  try {
    // Finding the user by their ID
    const user = await User.findById(ownerId);
    
    // Updating the order's status to 'shipped'
    await Order.findByIdAndUpdate(id, { status: 'shipped' });
    
    // Finding all orders and populating the 'owner' field with 'email' and 'name'
    const orders = await Order.find().populate('owner', ['email', 'name']);
    
    // Creating a notification for the shipped order and emitting it via socket.io
    const notification = { status: 'unread', message: `Order ${id} shipped with success`, time: new Date() };
    io.sockets.emit("notification", notification, ownerId);
    
    // Adding the notification to the user's notifications list
    user.notifications.push(notification);
    await user.save();
    
    res.status(200).json(orders); // Sending a JSON response with the updated orders
  } catch (e) {
    res.status(400).json(e.message); // Sending a 400 Bad Request response with the error message
  }
});

module.exports = router; // Exporting the router for use in the application
