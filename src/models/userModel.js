const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  walletBalance: {
    type: Number,
    default: 0, // Default wallet balance is 0 if not provided
  },
  // Add more user-related fields as needed
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
