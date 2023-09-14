// Define book controller functions here
const Book = require("../models/bookModel");

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addBook = (req, res) => {
  try {
    const book = new Book(req.body);
    book.save();
    res.status(201).json({ message: "Book added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  // Add your controller functions here
  getAllBooks,
  addBook,
  getBookById,
};
