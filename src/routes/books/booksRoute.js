const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  addBook,
  getBookById,
  deleteBookById,
  editBook
} = require("../../controllers/bookController");
const {
  bookValidationRules,
  validate,
  validateBookId,
  validateQueryParams,
  bookUpdateValidationRules,
} = require("../../middleware/validation");

const { isAdmin, isAuthenticated } = require("../../middleware/authMiddleware");

// Define book routes here

// GET /books
router.get("/", validateQueryParams, getAllBooks);
router.get("/:id", validateBookId(), validate, getBookById);
router.post(
  "/",
  bookValidationRules(),
  validate,
  isAuthenticated,
  isAdmin,
  addBook
);


router.patch('/edit/:bookId', bookUpdateValidationRules(), validate, editBook)

router.delete(
  "/:id",
  validateBookId(),
  validate,
  isAuthenticated,
  isAdmin,
  deleteBookById
);

module.exports = router;
