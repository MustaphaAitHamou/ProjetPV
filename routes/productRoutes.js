// Importing the required libraries and modules
const router = require('express').Router(); // Express router for handling routes
const Product = require('../models/Product'); // Importing the Product model
const User = require('../models/User');       // Importing the User model

// Route for getting all products
router.get('/', async (req, res) => {
  try {
    const sort = { '_id': -1 }; // Sorting products by ID in descending order
    const products = await Product.find().sort(sort); // Finding all products and sorting them
    res.status(200).json(products); // Sending a JSON response with the products
  } catch (e) {
    res.status(400).send(e.message); // Sending a 400 Bad Request response with the error message
  }
});

// Route for creating a product
router.post('/', async (req, res) => {
  try {
    // Extracting data from the request body
    const { name, description, price, category, images: pictures } = req.body;
    
    // Creating a new product
    const product = await Product.create({ name, description, price, category, pictures });
    
    // Finding all products
    const products = await Product.find();
    
    res.status(201).json(products); // Sending a 201 Created response with the updated list of products
  } catch (e) {
    res.status(400).send(e.message); // Sending a 400 Bad Request response with the error message
  }
});

// Route for updating a product
router.patch('/:id', async (req, res) => {
  const { id } = req.params; // Extracting the product ID from the request parameters
  try {
    // Extracting data from the request body
    const { name, description, price, category, images: pictures } = req.body;
    
    // Updating the product by its ID
    const product = await Product.findByIdAndUpdate(id, { name, description, price, category, pictures });
    
    // Finding all products
    const products = await Product.find();
    
    res.status(200).json(products); // Sending a JSON response with the updated list of products
  } catch (e) {
    res.status(400).send(e.message); // Sending a 400 Bad Request response with the error message
  }
});

// Route for deleting a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Extracting the product ID from the request parameters
  const { user_id } = req.body; // Extracting the user ID from the request body
  try {
    // Finding the user by their ID
    const user = await User.findById(user_id);
    
    // Checking if the user is an admin, if not, return a 401 Unauthorized response
    if (!user.isAdmin) return res.status(401).json("You don't have permission");
    
    // Deleting the product by its ID
    await Product.findByIdAndDelete(id);
    
    // Finding all products
    const products = await Product.find();
    
    res.status(200).json(products); // Sending a JSON response with the updated list of products
  } catch (e) {
    res.status(400).send(e.message); // Sending a 400 Bad Request response with the error message
  }
});

// Route for getting a product by its ID
router.get('/:id', async (req, res) => {
  const { id } = req.params; // Extracting the product ID from the request parameters
  try {
    // Finding the product by its ID
    const product = await Product.findById(id);
    
    // Finding similar products based on the product's category
    const similar = await Product.find({ category: product.category }).limit(5);
    
    // Sending a JSON response with the product and similar products
    res.status(200).json({ product, similar });
  } catch (e) {
    res.status(400).send(e.message); // Sending a 400 Bad Request response with the error message
  }
});

// Route for getting products by category
router.get('/category/:category', async (req, res) => {
  const { category } = req.params; // Extracting the category from the request parameters
  try {
    let products;
    const sort = { '_id': -1 }; // Sorting products by ID in descending order
    
    if (category === "all") {
      products = await Product.find().sort(sort); // Finding all products and sorting them
    } else {
      products = await Product.find({ category }).sort(sort); // Finding products by category and sorting them
    }
    
    res.status(200).json(products); // Sending a JSON response with the products
  } catch (e) {
    res.status(400).send(e.message); // Sending a 400 Bad Request response with the error message
  }
});

// Cart routes

// Route for adding a product to the cart
router.post('/add-to-cart', async (req, res) => {
  const { userId, productId, price } = req.body; // Extracting data from the request body
  try {
    // Finding the user by their ID
    const user = await User.findById(userId);
    
    // Accessing the user's cart
    const userCart = user.cart;
    
    // Checking if the product already exists in the cart
    if (user.cart[productId]) {
      userCart[productId] += 1;
    } else {
      userCart[productId] = 1;
    }
    
    // Updating the total count and total price in the cart
    userCart.count += 1;
    userCart.total = Number(userCart.total) + Number(price);
    
    // Updating the user's cart and saving it
    user.cart = userCart;
    user.markModified('cart');
    await user.save();
    
    res.status(200).json(user); // Sending a JSON response with the updated user data
  } catch (e) {
    res.status(400).send(e.message); // Sending a 400 Bad Request response with the error message
  }
});

// Route for increasing the quantity of a product in the cart
router.post('/increase-cart', async (req, res) => {
  const { userId, productId, price } = req.body; // Extracting data from the request body
  try {
    // Finding the user by their ID
    const user = await User.findById(userId);
    
    // Accessing the user's cart
    const userCart = user.cart;
    
    // Updating the total count and total price in the cart
    userCart.total += Number(price);
    userCart.count += 1;
    userCart[productId] += 1;
    
    // Updating the user's cart and saving it
    user.cart = userCart;
    user.markModified('cart');
    await user.save();
    
    res.status(200).json(user); // Sending a JSON response with the updated user data
  } catch (e) {
    res.status(400).send(e.message); // Sending a 400 Bad Request response with the error message
  }
});

// Route for decreasing the quantity of a product in the cart
router.post('/decrease-cart', async (req, res) => {
  const { userId, productId, price } = req.body; // Extracting data from the request body
  try {
    // Finding the user by their ID
    const user = await User.findById(userId);
    
    // Accessing the user's cart
    const userCart = user.cart;
    
    // Updating the total count and total price in the cart
    userCart.total -= Number(price);
    userCart.count -= 1;
    userCart[productId] -= 1;
    
    // Updating the user's cart and saving it
    user.cart = userCart;
    user.markModified('cart');
    await user.save();
    
    res.status(200).json(user); // Sending a JSON response with the updated user data
  } catch (e) {
    res.status(400).send(e.message); // Sending a 400 Bad Request response with the error message
  }
});

// Route for removing a product from the cart
router.post('/remove-from-cart', async (req, res) => {
  const { userId, productId, price } = req.body; // Extracting data from the request body
  try {
    // Finding the user by their ID
    const user = await User.findById(userId);
    
    // Accessing the user's cart
    const userCart = user.cart;
    
    // Updating the total count and total price in the cart
    userCart.total -= Number(userCart[productId]) * Number(price);
    userCart.count -= userCart[productId];
    
    // Removing the product from the cart
    delete userCart[productId];
    
    // Updating the user's cart and saving it
    user.cart = userCart;
    user.markModified('cart');
    await user.save();
    
    res.status(200).json(user); // Sending a JSON response with the updated user data
  } catch (e) {
    res.status(400).send(e.message); // Sending a 400 Bad Request response with the error message
  }
});

module.exports = router; // Exporting the router for use in the application
