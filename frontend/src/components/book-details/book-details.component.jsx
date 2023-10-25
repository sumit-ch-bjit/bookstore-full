import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import apiInstance from "../../api/apiInstance";
import Review from "../review/review.component";
import AddReview from "../add-review/add-review.component";
import { useSelector } from "react-redux";
import {
  selectCurrentUserId,
  selectCurrentUserRole,
} from "../../store/user/user.selector";
import { ToastContainer, toast } from "react-toastify";
// import { Container, Title, Description, Subtitle } from "./book-details.styles";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #333;
`;

const SubTitle = styled.h2`
  color: #555;
`;

const Description = styled.p`
  color: #777;
`;

const BookDetails = () => {
  const reviewUpdateToast = () => toast.success("review updated");
  const reviewAddToast = () => toast.success("review added");
  const reviewDeleteToast = () => toast.error("review deleted");
  const location = useLocation();
  const navigate = useNavigate();
  const {
    _id,
    title,
    author,
    price,
    description,
    stock,
    genre,
    discountedPrice,
  } = location.state.book;

  const userId = useSelector(selectCurrentUserId);
  console.log(userId);
  const userRole = useSelector(selectCurrentUserRole);
  const [userReviews, setUserReviews] = useState([]);
  const [trigger, setTrigger] = useState(false);

  const getReviews = async () => {
    const res = await apiInstance.get(`/reviews/review/${_id}`);
    const reviews = res.data.review;
    setUserReviews(reviews);
  };

  const postReview = async (review) => {
    const { comment, rating } = review;
    const bookId = _id;

    const reviewObj = {
      user: userId,
      book: bookId,
      rating: rating,
      comment: comment,
    };
    await apiInstance
      .post("/reviews/add", reviewObj)
      .then((res) => console.log(res.data));

    // console.log(res);
  };

  useEffect(() => {
    console.log("sting");
    getReviews();
  }, [trigger]);

  const handleAddReview = async (review) => {
    await postReview(review);
    setTrigger(!trigger);
    reviewAddToast();
  };

  const editHandler = async (review) => {
    const { comment, rating } = review;

    const reviewObj = {
      rating: rating,
      comment: comment,
      user: userId,
    };

    await apiInstance
      .patch(`/reviews/edit/${review._id}`, reviewObj)
      .then((res) => console.log(res))
      .catch((error) => console.log(error));

    setTrigger(!trigger);
    reviewUpdateToast();
  };

  const deleteHandler = async (reviewId) => {
    await apiInstance
      .delete(`/reviews/remove/${reviewId}`)
      .then((res) => console.log(res))
      .catch((error) => console.log(error));

    setTrigger(!trigger);
    reviewDeleteToast();
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <Container>
          <Title>{title}</Title>
          <SubTitle>Author: {author}</SubTitle>
          <SubTitle>Price: {price}</SubTitle>
          <Description>{description}</Description>
          <SubTitle>Stock: {stock}</SubTitle>
          <SubTitle>Genre: {genre}</SubTitle>
          <SubTitle>Discounted Price: {discountedPrice}</SubTitle>
          <div>
            {userReviews.map((review) => (
              <Review
                key={review._id}
                review={review}
                onEdit={editHandler}
                onDelete={deleteHandler}
              />
            ))}
          </div>
        </Container>
        {userRole === "user" && <AddReview onAddReview={handleAddReview} />}
      </div>
      <ToastContainer />
    </>
  );
};

export default BookDetails;
