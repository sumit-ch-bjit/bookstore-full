import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component";
import { useDispatch, useSelector } from "react-redux";
import {
  BookCardContainer,
  Footer,
  Name,
  Price,
  ButtonContainer,
} from "./bookItem.styles";
import bookImage from "../../assets/book.png";
import {
  selectCurrentUser,
  selectCurrentUserId,
  selectCurrentUserRole,
} from "../../store/user/user.selector";

import { addItemToCart } from "../../store/cart/cart.reducer";
import { useNavigate } from "react-router-dom";
import apiInstance from "../../api/apiInstance";
import {
  selectCartCount,
  selectCartTotal,
} from "../../store/cart/cart.selector";
import cartApi from "../../api/cartApi";
import { ToastContainer } from "react-toastify";

const BookItem = ({ book, onDelete, showToast }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { _id, title, price, description, category, thumbnail } = book;
  // console.log(title, price, description);
  const currentUser = useSelector(selectCurrentUser);
  const userRole = useSelector(selectCurrentUserRole);
  const userId = useSelector(selectCurrentUserId);
  const cartItems = useSelector(selectCartCount);

  const triggerToast = () => {
    showToast("Book Added To Cart");
  };

  const callApi = () => {
    apiInstance
      .post("/cart/add-to-cart", {
        userId: userId,
        bookId: _id,
        quantity: 1,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  const addBookToCart = async () => {
    callApi();
    dispatch(addItemToCart(book));
    triggerToast();
  };

  const updateBook = () => {
    navigate("/update-book", { state: { book: book } });
  };

  const deleteBook = async () => {
    await onDelete(book);
  };

  const bookDetailsHandler = () => {
    navigate("/book", { state: { book: book } });
  };
  return (
    <div>
      <BookCardContainer>
        <img src={bookImage} alt={`${title}`} onClick={bookDetailsHandler} />

        {userRole === "user" && (
          <Button onClick={addBookToCart}>Add to cart</Button>
        )}

        {userRole === "admin" && (
          <ButtonContainer>
            <Button onClick={updateBook}>Update</Button>
            <Button
              buttonType={BUTTON_TYPE_CLASSES.delete}
              onClick={deleteBook}
            >
              Delete
            </Button>
          </ButtonContainer>
        )}

        <Footer>
          <Name>{title}</Name>
          <Price>${price}</Price>
        </Footer>
      </BookCardContainer>
    </div>
  );
};

export default BookItem;
