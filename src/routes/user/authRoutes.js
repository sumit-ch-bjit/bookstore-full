const express = require("express");
const router = express.Router();
const { register, login } = require("../../controllers/authController");
const {
  userValidationRules,
  validate,
} = require("../../middleware/validation");
const { protect } = require("../../middleware/authMiddleware");

router.post("/register", userValidationRules(), validate, register);
router.post("/login", login);

module.exports = router;
