const express = require("express");
const router = express.Router();
const { addToCart, removeFromCart, viewCart } = require("../../controllers/cartController");
const { checkout } = require("../../controllers/transactionController");
const { isAuthenticated } = require("../../middleware/authMiddleware");
const { addToCartRules, removeFromCartRules, validateCart, checkWalletBalance, validate } = require("../../middleware/validation");

router.get('/view-cart/:userId', isAuthenticated, viewCart)

router.post(
  "/add-to-cart",
  isAuthenticated,
  addToCartRules(),
  validate,
  addToCart
);

router.post(
  "/checkout/:cartId",
  isAuthenticated,
  validateCart,
  checkWalletBalance,
  checkout
)

router.post("/remove-from-cart",
  isAuthenticated,
  removeFromCartRules(),
  validate,
  removeFromCart,
)

module.exports = router;