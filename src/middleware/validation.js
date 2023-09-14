const { body, validationResult } = require("express-validator");

const bookValidationRules = () => {
  return [
    body("title").isLength({ min: 1 }).withMessage("Title is required"),
    body("author").isLength({ min: 1 }).withMessage("Author is required"),
    body("price").isLength({ min: 1 }).withMessage("Price is required"),
    body("discountPercentage")
      .isLength({ min: 1 })
      .withMessage("Discount Percentage is required"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  bookValidationRules,
  validate,
};
