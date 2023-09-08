// Import and configure the dotenv package to load environment variables
require('dotenv').config();

// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// MongoDB connection string
const connectionStr = "mongodb+srv://mosmos:ZJgvipGiEzLSwSz4@cluster0.bshlqnk.mongodb.net/PureView?retryWrites=true&w=majority";


// Connect to MongoDB using Mongoose
mongoose.connect(connectionStr, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Handle MongoDB connection errors
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});
