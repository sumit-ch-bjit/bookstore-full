const express = require("express");
const router = express.Router();
const { getMyProfile, getUserProfile, deleteUserProfile } = require("../../controllers/userController");
const { isAuthenticated, isAdmin, protect } = require("../../middleware/authMiddleware");
const { getWalletBalance, depositFunds } = require("../../controllers/walletController")

router.get("/profile", isAuthenticated, getMyProfile);
router.get("/profile/:userId", isAdmin, getUserProfile)
router.post("/wallet/deposit", isAuthenticated, depositFunds)
router.get("/wallet/balance/:userId", isAuthenticated, getWalletBalance)

router.delete("/profile/:userId", isAdmin, deleteUserProfile)


module.exports = router;