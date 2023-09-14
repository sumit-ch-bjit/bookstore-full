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
  validateBookId,
  validateQueryParams,
} = require("../../middleware/validation");

// Define book routes here

// GET /books
router.get("/", validateQueryParams, getAllBooks);
router.get("/:id", validateBookId(), validate, getBookById);
router.post("/", bookValidationRules(), validate, addBook);

module.exports = router;
