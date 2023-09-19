const express = require("express");
const router = express.Router();
const { addReviews, editReviews, deleteReview, addRating, removeRating } = require('../../controllers/reviewController')
const { isAuthenticated } = require('../../middleware/authMiddleware')
const { reviewValidationRules, reviewUpdateValidationRules, validate } = require('../../middleware/validation')

router.post('/add', reviewValidationRules(), validate, isAuthenticated, addReviews)
router.put('/edit/:reviewId', reviewUpdateValidationRules(), validate, isAuthenticated, editReviews)
router.delete("/remove/:id", isAuthenticated, deleteReview)
router.post('/rate', addRating);
router.delete("/remove-rating/:id", removeRating)

module.exports = router