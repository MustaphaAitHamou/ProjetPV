// Import necessary libraries and modules
const express = require('express'); // Import Express.js
const cors = require('cors'); // Import CORS middleware
const app = express(); // Create an Express application
const http = require('http'); // Import Node.js HTTP module
require('dotenv').config(); // Load environment variables
const stripe = require('stripe')(process.env.STRIPE_SECRET); // Initialize Stripe with API secret key
require('./connection'); // Import the database connection setup
const server = http.createServer(app); // Create an HTTP server using the Express app
const { Server } = require('socket.io'); // Import Socket.io server
const io = new Server(server, {
  cors: 'https://www.pure-view.fr', // Configure CORS for socket.io
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Define supported HTTP methods
});

const User = require('./models/User'); // Import User model
const userRoutes = require('./routes/userRoutes'); // Import user routes
const productRoutes = require('./routes/productRoutes'); // Import product routes
const orderRoutes = require('./routes/orderRoutes'); // Import order routes

// Set up middleware and routes
app.use(cors()); // Enable CORS for all routes
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use('/users', userRoutes); // Use user routes
app.use('/products', productRoutes); // Use product routes
app.use('/orders', orderRoutes); // Use order routes
app.use('/images', imageRoutes); // Use image routes

// Create a POST route for creating payment intents
app.post('/create-payment', async (req, res) => {
  const { amount } = req.body;
  const amountInCents = amount * 100; // Convert euros to cents

  try {
    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents, // Use the amount in cents
      currency: 'eur', // Set currency to euros
      payment_method_types: ['card'], // Allow card payments
    });

    // Send the client secret back as a JSON response
    res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (e) {
    console.error(e.message);
    res.status(400).json({ error: e.message });
  }
});

// Start the server and listen on port 8080
server.listen(8080, () => {
  console.log('Server running at port', 8080);
});

// Set the 'socketio' property on the Express app to the Socket.io instance
app.set('socketio', io);
