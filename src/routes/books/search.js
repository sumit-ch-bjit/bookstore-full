const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  addBook,
  getBookById,
} = require("../../controllers/bookController");
const {
  bookValidationRules,
  validate,
} = require("../../middleware/validation");

// Define book routes here

// GET /books
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", bookValidationRules(), validate, addBook);

module.exports = router;
