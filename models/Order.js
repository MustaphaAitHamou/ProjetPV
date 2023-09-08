// Importing the mongoose library
const mongoose = require('mongoose');

// Defining the Order schema using mongoose
const OrderSchema = mongoose.Schema({
  // A field to store the products in the order as an object
  products: {
    type: Object
  },
  // A reference to the owner of the order, which is a user's ObjectId
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the 'User' model
    required: true, // It is required for an order to have an owner
  },
  // A field to store the status of the order, with a default value of 'processing'
  status: {
    type: String,
    default: 'processing',
  },
  // A field to store the total cost of the order as a number, with a default value of 0
  total: {
    type: Number,
    default: 0,
  },
  // A field to store the count of products in the order as a number, with a default value of 0
  count: {
    type: Number,
    default: 0,
  },
  // A field to store the date of the order in ISO format, with a default value of the current date
  date: {
    type: String,
    default: new Date().toISOString().split('T')[0],
  },
  // A field to store the address of the order as a string
  address: {
    type: String,
  },
  // A field to store the country of the order as a string
  country: {
    type: String,
  },
}, { minimize: false }); // Setting 'minimize' to false to preserve empty objects

// Creating an 'Order' model using the OrderSchema
const Order = mongoose.model('Order', OrderSchema);

// Exporting the 'Order' model to make it available for use in other parts of the application
module.exports = Order;