const express = require("express");
const router = express.Router();
const { getTransactions, getOwnTransactions } = require('../../controllers/transactionController')
const { isAuthenticated, isAdmin } = require('../../middleware/authMiddleware')
const { validateMongoId, validate } = require('../../middleware/validation')

router.get("/all-transactions/:userId", validateMongoId(), validate, isAuthenticated, isAdmin, getTransactions)
router.get('/my-transactions', isAuthenticated, getOwnTransactions)

module.exports = router