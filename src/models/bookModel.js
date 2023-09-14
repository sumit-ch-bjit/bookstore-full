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
    default: 0,
  },
  description: String,
  publishDate: Date,
  ISBN: String,
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
