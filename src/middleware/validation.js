const { body, validationResult, param, query } = require("express-validator");
const Cart = require('../models/cartModel')
const Wallet = require('../models/walletModel')

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

const userUpdateValidationRules = () => {
  return [
    param('userId').isMongoId().withMessage("invalid user id"),
    body('firstName').optional().isString().trim(),
    body('lastName').optional().isString().trim(),
    body('email').optional().isEmail().normalizeEmail(),
    body('address').optional().isString().trim(),
    body('city').optional().isString().trim(),
    body('state').optional().isString().trim(),
    body('zip').optional().isPostalCode('US')
  ]
}

const bookUpdateValidationRules = () => {
  return [
    body('title').optional().isString().trim(),
    body('author').optional().isString().trim(),
    body('genre').optional().isString().trim(),
    body('price').optional().isNumeric(),
    body('description').optional().isString().trim(),
    body('publishDate').optional().isDate(),
    body('ISBN').optional().isString().trim(),
    body('stock').optional().isNumeric(),
    body('discountPercentage').optional().isNumeric(),
    body('discountStartDate').optional().isISO8601(), // Validate ISO date format
    body('discountEndDate').optional().isISO8601(),
  ]
}

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
    body("bookId").trim().isMongoId().withMessage("Invalid book ID"),
    body("quantity")
      .exists()
      .withMessage("Quantity must exist")
      .bail()
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
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

const validateCart = async (req, res, next) => {
  try {
    const { cartId } = req.params

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (!cart.books || cart.total <= 0) {
      return res.status(400).json({ message: 'Invalid cart. Please add items to your cart.' });
    }

    req.cart = cart;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const checkWalletBalance = async (req, res, next) => {
  try {
    const cart = req.cart; // Assuming req.cart is set by a previous middleware

    if (!cart || !cart.user) {
      return res.status(400).json({ message: 'Invalid cart data' });
    }

    // Find the user's wallet based on the user in the cart
    const userWallet = await Wallet.findOne({ user: cart.user });

    if (!userWallet) {
      return res.status(404).json({ message: 'Wallet not found for this user' });
    }

    // Check if the wallet balance is sufficient for the cart's total amount
    if (userWallet.balance >= cart.total) {
      next(); // Wallet balance is sufficient, proceed with checkout
    } else {
      return res.status(400).json({ message: 'Insufficient funds in your wallet.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
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
  validateCart,
  checkWalletBalance,
  userUpdateValidationRules,
  bookUpdateValidationRules,
};
