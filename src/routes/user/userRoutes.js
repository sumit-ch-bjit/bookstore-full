const express = require("express");
const router = express.Router();
const { getMyProfile, getUserProfile, deleteUserProfile, editUserProfile } = require("../../controllers/userController");
const { getTransactions } = require('../../controllers/transactionController')
const { isAuthenticated, isAdmin } = require("../../middleware/authMiddleware");
const { userUpdateValidationRules, validate } = require('../../middleware/validation')
const { getWalletBalance, depositFunds } = require("../../controllers/walletController");

router.get("/profile", isAuthenticated, getMyProfile);
router.get("/profile/:userId", isAuthenticated, isAdmin, getUserProfile)
router.post("/wallet/deposit", isAuthenticated, depositFunds)
router.get("/wallet/balance", isAuthenticated, getWalletBalance)
router.get('/transactions/:userId', isAuthenticated, getTransactions)
router.put("/edit/:userId", userUpdateValidationRules(), validate, editUserProfile)
router.delete("/profile/:userId", isAuthenticated, isAdmin, deleteUserProfile)


module.exports = router;