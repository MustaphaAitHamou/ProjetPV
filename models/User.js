// Importing the mongoose library and bcrypt for password hashing
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Defining the User schema using mongoose
const UserSchema = mongoose.Schema({
  // A field to store the name of the user as a string
  name: {
    type: String,
    required: [true, 'is required'], // Name is required with a validation error message
  },
  // A field to store the email of the user as a string
  email: {
    type: String,
    required: [true, 'is required'], // Email is required with a validation error message
    unique: true, // Email must be unique
    index: true, // Creating an index for email for efficient queries
    validate: {
      validator: function (str) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str); // Email format validation
      },
      message: (props) => `${props.value} is not a valid email`, // Custom error message for email validation
    },
  },
  // A field to store the hashed password of the user as a string
  password: {
    type: String,
    required: [true, 'is required'], // Password is required with a validation error message
  },
  // A field to determine whether the user is an admin, default is false
  isAdmin: {
    type: Boolean,
    default: false,
  },
  // A field to store the user's cart as an object with total and count
  cart: {
    type: Object,
    default: {
      total: 0,
      count: 0,
    },
  },
  // A field to store notifications as an array, default is an empty array
  notifications: {
    type: Array,
    default: [],
  },
  // A field to store references to the user's orders
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
}, { minimize: false }); // Setting 'minimize' to false to preserve empty objects

// Static method to find a user by credentials (email and password)
UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('invalid credentials'); // User not found
  const isSamePassword = bcrypt.compareSync(password, user.password);
  if (isSamePassword) return user;
  throw new Error('invalid credentials'); // Password doesn't match
};

// Method to convert the user object to JSON, removing the password field
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

// Middleware to hash the password before saving the user
UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next(); // If password hasn't changed, no need to hash it again

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash; // Set the hashed password
      next();
    });
  });
});

// Middleware to remove associated orders before removing a user
UserSchema.pre('remove', function (next) {
  this.model('Order').remove({ owner: this._id }, next);
});

// Creating a 'User' model using the UserSchema
const User = mongoose.model('User', UserSchema);

// Exporting the 'User' model to make it available for use in other parts of the application
module.exports = User;
