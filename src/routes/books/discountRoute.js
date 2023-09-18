const express = require("express");
const router = express.Router();
const { addDiscount } = require('../../controllers/discountController')

router.post('/add/:bookId', addDiscount)

module.exports = router;