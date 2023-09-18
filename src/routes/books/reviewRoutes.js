const express = require("express");
const router = express.Router();
const { addReviews, editReviews, deleteReview, addRating, removeRating } = require('../../controllers/reviewController')
const { isAuthenticated } = require('../../middleware/authMiddleware')

router.post('/add', isAuthenticated, addReviews)
router.put('/edit/:id', isAuthenticated, editReviews)
router.delete("/remove/:id", isAuthenticated, deleteReview)
router.post('/rate', addRating);
router.delete("/remove-rating/:id", removeRating)

module.exports = router