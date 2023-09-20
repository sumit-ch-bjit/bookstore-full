const express = require("express");
const router = express.Router();
const { addDiscount } = require('../../controllers/discountController')
const { isAuthenticated, isAdmin } = require('../../middleware/authMiddleware')

router.post('/add/:bookId', isAuthenticated, isAdmin, addDiscount)

module.exports = router;