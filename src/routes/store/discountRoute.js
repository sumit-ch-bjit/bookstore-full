const express = require("express");
const router = express.Router();
const { addDiscount } = require('../../controllers/discountController')
const { isAuthenticated, isAdmin } = require('../../middleware/authMiddleware');
const { discountValidationRules, validate } = require("../../middleware/validation");

router.post('/add/:bookId', discountValidationRules(), validate, isAuthenticated, isAdmin, addDiscount)

module.exports = router;