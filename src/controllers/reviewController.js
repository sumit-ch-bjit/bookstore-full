const Review = require('../models/reviewSchema')

const addReviews = async (req, res) => {
    try {
        const { book, rating, comment } = req.body;
        const user = req.user.user._id;
        console.log(user)

        const review = new Review({
            user: user,
            book,
            rating,
            comment,
        });

        await review.save();

        res.status(200).json({ success: true, message: 'Review added successfully', review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const editReviews = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { reviewId } = req.params;
        const user = req.user.user._id;


        // Check if the review with the provided ID exists and is associated with the authenticated user
        const review = await Review.findOne({ _id: reviewId, user });

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Update the review with new rating and comment
        review.rating = rating;
        review.comment = comment;

        await review.save();

        res.status(200).json({ success: true, message: 'Review updated successfully', review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const user = req.user.user._id;


        // Check if the review with the provided ID exists and is associated with the authenticated user
        const review = await Review.findOne({ _id: reviewId, user });

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        await Review.findByIdAndDelete({ _id: reviewId })

        res.status(200).json({ success: true, message: 'Review removed successfully', review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const addRating = async (req, res) => {
    try {
        const { book, rating } = req.body;
        const user = req.user.user._id;

        // Check if the user has already reviewed this book; if yes, update the rating
        const existingReview = await Review.findOne({ user, book });

        if (existingReview) {
            existingReview.rating = rating;
            await existingReview.save();
            return res.status(200).json({ success: true, message: 'Rating updated successfully' });
        }

        // Create a new review with only the rating
        const review = new Review({ user, book, rating });
        await review.save();

        res.status(201).json({ success: true, message: 'Rating added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const removeRating = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const user = req.user.user._id;

        // Find the user's review for the specified book
        const review = await Review.findOne({ user, book: bookId });

        if (!review) {
            return res.status(404).json({ success: false, message: 'Rating not found' });
        }

        // Remove the rating (set it to null or any other value indicating no rating)
        review.rating = null;
        await review.save();

        res.status(200).json({ success: true, message: 'Rating removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


module.exports = { addReviews, editReviews, deleteReview, addRating, removeRating }