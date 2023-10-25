import React, { useState } from "react";
import "./review.styles.scss";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../store/user/user.selector";

const Review = ({ review, onEdit, onDelete }) => {
  const { rating, comment, user } = review;
  const { _id } = user;
  const loggedInUserId = useSelector(selectCurrentUserId);

  const [isEditing, setIsEditing] = useState(false);
  const [editedRating, setEditedRating] = useState(rating);
  const [editedComment, setEditedComment] = useState(comment);

  const onStartEdit = () => {
    setIsEditing(true);
  };

  const onSaveEdit = () => {
    const parsedRating = parseFloat(editedRating);

    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      alert("Please enter a valid rating between 0 and 5.");
      return;
    }

    const editedReview = {
      ...review,
      rating: editedRating,
      comment: editedComment,
    };

    onEdit(editedReview);
    setIsEditing(false);
  };

  const onCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className={`review-container ${isEditing ? "editing" : ""}`}>
      {isEditing ? (
        <div className="edit-mode">
          <div className="edit-mode-inputs">
            <div>
              <label htmlFor="editedRating">Rating:</label>
              <input
                type="number"
                id="editedRating"
                value={editedRating}
                onChange={(e) => setEditedRating(e.target.value)}
                min="0"
                max="5"
              />
            </div>
            <div>
              <label htmlFor="editedComment">Comment:</label>
              <textarea
                id="editedComment"
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
              />
            </div>
          </div>
          <div className="actions">
            <button onClick={onSaveEdit}>Save</button>
            <button onClick={onCancelEdit}>Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="user-info">
            <strong>User:</strong> {user.firstName}
          </div>
          <div>
            <strong>Rating:</strong> {rating}
          </div>
          <div>
            <strong>Review:</strong> {comment}
          </div>
          {loggedInUserId === _id && (
            <div className="actions">
              <button onClick={onStartEdit}>Edit</button>
              <button onClick={() => onDelete(review._id)}>Delete</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Review;
