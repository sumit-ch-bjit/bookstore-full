// Define book controller functions here
const Book = require("../models/bookModel");
const HTTP_STATUS = require("../constants/statusCodes");
const { sendResponse } = require("../utils/common");

const getAllBooks = async (req, res) => {
  try {
    const {
      page,
      pageSize,
      genre,
      minPrice,
      maxPrice,
      sortField,
      sortOrder,
      searchTerm,
    } = req.query;

    const books = await Book.find({});
    let query = Book.find();

    const filter = {};

    if (genre) {
      filter.genre = genre;
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = parseInt(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = parseInt(maxPrice);
      }
    }

    query = query.find(filter);

    if (sortField && sortOrder) {
      const sortOptions = {};
      sortOptions[sortField] = sortOrder === "asc" ? 1 : -1;
      query = query.sort(sortOptions);
    }

    if (searchTerm) {
      const regexPattern = new RegExp(searchTerm, "i");
      query = query.or([
        { title: { $regex: regexPattern } },
        { description: { $regex: regexPattern } },
        { brand: { $regex: regexPattern } },
      ]);
    }

    const currentPage = page ? page : 1;
    const limit = pageSize ? pageSize : 10;
    query = query.skip((currentPage - 1) * limit).limit(limit);

    const results = await query.exec();

    const message = {};

    results.length
      ? ((message.success = "books found"), (message.status = HTTP_STATUS.OK))
      : ((message.error = "books not found"),
        (message.status = HTTP_STATUS.NOT_FOUND));

    return res.status(message.status).json({
      message,
      books: books.length,
      currentPage,
      foundBooks: results.length,
      results,
    });
    // res.status(200).json(books);
  } catch (error) {
    return sendResponse(res, 500, error.message);
    // res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      sendResponse(res, HTTP_STATUS.OK, "book found", book);
    } else {
      sendResponse(res, HTTP_STATUS.NOT_FOUND, "no book found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json({ message: "Book added successfully", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBookById = async (req, res) => {
  try {
    console.log(req.query);
    const { id } = req.params;
    // console.log(bookId);

    // Check if the book with the provided ID exists
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Delete the book by ID
    await Book.findByIdAndRemove(id);

    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  // Add your controller functions here
  getAllBooks,
  addBook,
  getBookById,
  deleteBookById,
};
