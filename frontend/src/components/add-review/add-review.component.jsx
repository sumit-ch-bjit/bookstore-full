// AddReview.js
import React, { useState } from "react";
import "./add-review.styles.scss";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../store/user/user.selector";

const AddReview = ({ onAddReview }) => {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const handleRatingChange = (e) => {
    // Ensure only integer values from 1 to 5 are allowed
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 5) {
      setRating(value);
    }
  };

  const handleAddReview = () => {
    if (!rating || !comment) {
      alert("Please fill in all fields.");
      return;
    }

    const newReview = {
      rating: parseFloat(rating),
      comment,
    };

    onAddReview(newReview);

    setRating("");
    setComment("");
  };

  return (
    <div className="add-review-container">
      <h2>Add a Review</h2>
      <div>
        <label htmlFor="rating">Rating:</label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={handleRatingChange}
        />
      </div>
      <div>
        <label htmlFor="comment">Comment:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <button onClick={handleAddReview}>Add Review</button>
    </div>
  );
};

export default AddReview;
