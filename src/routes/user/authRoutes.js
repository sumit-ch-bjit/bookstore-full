const express = require("express");
const router = express.Router();
const { register, login } = require("../../controllers/authController");
const {
  userValidationRules,
  validate,
  loginValidationRules,
} = require("../../middleware/validation");

router.post("/register", userValidationRules(), validate, register);
router.post("/login", loginValidationRules(), validate, login);

module.exports = router;
