const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: String,
  price: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    default: 0, // Default discount percentage is 0 if not provided
  },
  description: String,
  publishDate: Date,
  ISBN: String,
  // Add more fields as needed
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
