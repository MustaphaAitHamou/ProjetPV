// Importing the mongoose library
const mongoose = require('mongoose');

// Defining the Product schema using mongoose
const ProductSchema = mongoose.Schema({
  // A field to store the name of the product as a string
  name: {
    type: String,
    required: [true, "can't be blank"], // Name is required and has a validation error message
  },
  // A field to store the description of the product as a string
  description: {
    type: String,
    required: [true, "can't be blank"], // Description is required and has a validation error message
  },
  // A field to store the price of the product as a string
  price: {
    type: String,
    required: [true, "can't be blank"], // Price is required and has a validation error message
  },
  // A field to store the category of the product as a string
  category: {
    type: String,
    required: [true, "can't be blank"], // Category is required and has a validation error message
  },
  // A field to store an array of pictures for the product, which is required
  pictures: {
    type: Array,
    required: true, // Pictures are required
  },
}, { minimize: false }); // Setting 'minimize' to false to preserve empty objects

// Creating a 'Product' model using the ProductSchema
const Product = mongoose.model('Product', ProductSchema);

// Exporting the 'Product' model to make it available for use in other parts of the application
module.exports = Product;