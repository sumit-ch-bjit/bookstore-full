const express = require("express");
const router = express.Router();
const { getMyProfile, getUserProfile } = require("../../controllers/userController");
const { isAuthenticated, isAdmin } = require("../../middleware/authMiddleware");

router.get("/profile", isAuthenticated, getMyProfile);
router.get("/profile/:userId", isAdmin, getUserProfile)
router.


    module.exports = router;
