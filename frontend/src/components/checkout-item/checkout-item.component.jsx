import { useDispatch, useSelector } from "react-redux";
import apiInstance from "../../api/apiInstance";
import {
  clearItemFromCart,
  addItemToCart,
  removeItemFromCart,
} from "../../store/cart/cart.reducer";
import book from "../../assets/book.png";
import {
  CheckoutItemContainer,
  ImageContainer,
  BaseSpan,
  Quantity,
  Arrow,
  Value,
  RemoveButton,
} from "./checkout-item.styles";

const CheckoutItem = ({ cartItem, user, cartId }) => {
  const { title, thumbnail, price, quantity } = cartItem;
  const dispatch = useDispatch();
  console.log(cartItem, "this is the cartitem");
  // const clearItemHandler = () => dispatch(clearItemFromCart(cartItem));
  // const addItemHandler = () => dispatch(addItemToCart(cartItem));
  // const removeItemHandler = () => dispatch(removeItemFromCart(cartItem));

  // const [cartId, setCartId] = useState("");

  const addItemHandler = async () => {
    apiInstance
      .post("/cart/add-to-cart", {
        userId: user,
        bookId: cartItem._id,
        quantity: 1,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    dispatch(addItemToCart(cartItem));
  };

  const removeItemHandler = async () => {
    apiInstance
      .post(`/cart/remove-from-cart/${cartId}`, {
        bookId: cartItem._id,
        quantity: 1,
      })
      .then((res) => console.log(res));
    dispatch(removeItemFromCart(cartItem));
  };

  // const callApi = () => {
  //   apiInstance
  //     .post("/cart/add-to-cart", {
  //       userId: userId,
  //       bookId: _id,
  //       quantity: 1,
  //     })
  //     .then((res) => console.log(res))
  //     .catch((err) => console.log(err));
  // };
  // const addBookToCart = async () => {
  //   callApi();
  //   dispatch(addItemToCart(book));
  //   triggerToast();
  // };

  return (
    <CheckoutItemContainer>
      <ImageContainer>
        <img src={book} alt={`${title}`} />
      </ImageContainer>
      <BaseSpan> {title} </BaseSpan>
      <Quantity>
        <Arrow onClick={removeItemHandler}>&#10096;</Arrow>
        <Value>{quantity}</Value>
        <Arrow onClick={addItemHandler}>&#10097;</Arrow>
      </Quantity>
      <BaseSpan> {price}</BaseSpan>
      {/* <RemoveButton onClick={clearItemHandler}>&#10005;</RemoveButton> */}
    </CheckoutItemContainer>
  );
};

export default CheckoutItem;
