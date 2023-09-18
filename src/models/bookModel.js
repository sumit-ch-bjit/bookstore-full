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
  description: String,
  publishDate: Date,
  ISBN: String,
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  discountPercentage: {
    type: Number,
    default: 0, // Default discount percentage is 0 (no discount)
  },
  discountStartDate: Date, // Start date of the discount
  discountEndDate: Date,
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
