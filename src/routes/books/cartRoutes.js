const express = require("express");
const router = express.Router();
const { addToCart, removeFromCart, viewCart } = require("../../controllers/cartController");
const { isAuthenticated } = require("../../middleware/authMiddleware");
const { addToCartRules, removeFromCartRules, validate } = require("../../middleware/validation");

router.get('/view-cart/:userId', viewCart)

router.post(
  "/add-to-cart",
  isAuthenticated,
  addToCartRules(),
  validate,
  addToCart
);

router.post("/remove-from-cart",
  isAuthenticated,
  removeFromCartRules(),
  validate,
  removeFromCart,
)

module.exports = router;
