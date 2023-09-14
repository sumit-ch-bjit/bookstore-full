const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
    unique: true, // Ensures that each user has only one authentication record
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    // You may want to apply additional validations or hashing here
  },
  role: {
    type: String,
    enum: ["user", "admin"], // Role can be 'user' or 'admin'
    default: "user", // Default role is 'user'
  },
});

const Auth = mongoose.model("Auth", AuthSchema);

module.exports = Auth;
