const { body, validationResult, param, query } = require("express-validator");

const validateQueryParams = (req, res, next) => {
  // Define validation rules for each query parameter
  const validationRules = [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("pageSize")
      .optional()
      .isInt({ min: 1 })
      .withMessage("PageSize must be a positive integer"),
    query("genre")
      .optional()
      .isString()
      .withMessage("Genre must be a valid string"),
    query("minPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("MinPrice must be a valid number"),
    query("maxPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("MaxPrice must be a valid number"),
    query("sortField")
      .optional()
      .isString()
      .withMessage("SortField must be a valid string"),
    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage('SortOrder must be "asc" or "desc"'),
    query("searchTerm")
      .optional()
      .isString()
      .withMessage("SearchTerm must be a valid string"),
  ];

  // Run the validation rules
  Promise.all(
    validationRules.map((validationRule) => validationRule.run(req))
  ).then(() => {
    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      // No validation errors, proceed to the next middleware
      next();
    } else {
      // Validation errors found, respond with a 400 Bad Request
      res.status(400).json({ errors: errors.array() });
    }
  });
};

const loginValidationRules = () => {
  return [body("email").isEmail().withMessage("Invalid Email").bail()];
};

const userValidationRules = () => {
  return [
    body("username")
      .exists()
      .notEmpty()
      .isAlphanumeric()
      .withMessage("cannot be empty and must be alphanumeric")
      .bail(),
    body("email").isEmail().withMessage("Invalid Email").bail(),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
      })
      .withMessage(
        "password should be 8 character long and must contain 1 lowercase, 1 uppercase and 1 symbol"
      )
      .bail(),
    body("role")
      .optional()
      .custom((value) => {
        if (value && !["admin", "user"].includes(value)) {
          throw new Error("Invalid user type");
        }
        return true;
      })
      .bail(),
    body("firstName").notEmpty().withMessage("fistname cannot be empty"),
    body("lastName").notEmpty().withMessage("lastname cannot be empty"),
    // Add more validation for address fields if needed
  ];
};

const bookValidationRules = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("author").notEmpty().withMessage("Author is required"),
    body("genre").optional(),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("discountPercentage")
      .isFloat({ min: 0, max: 100 })
      .withMessage("Discount percentage must be between 0 and 100"),
    body("description").optional(),
    body("publishDate")
      .isISO8601()
      .withMessage("Invalid publish date format (ISO8601)"),
    body("ISBN").isISBN().withMessage("Invalid ISBN format"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
  ];
};

const validateBookId = () => {
  return [param("id").isMongoId().withMessage("Invalid book ID")];
};

const addToCartRules = () => {
  return [
    body("userId").trim().isMongoId().withMessage("Invalid user ID"),
    body("bookId").trim().isMongoId().withMessage("Invalid Book ID"),
    body("quantity")
      .exists()
      .withMessage("Quantity must exist")
      .bail()
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
  ];
};

const removeFromCartRules = () => {
  return [
    body("userId").trim().isMongoId().withMessage("Invalid user ID"),
    body("bookId").trim().isMongoId().withMessage("Invalid book ID")
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => {
    console.log(err);
    return extractedErrors.push(err.msg);
  });
  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  bookValidationRules,
  validateBookId,
  validate,
  validateQueryParams,
  userValidationRules,
  loginValidationRules,
  addToCartRules,
  removeFromCartRules,
};
