import { CartItemContainer, ItemDetails } from "./cart-item.styles";
import bookImage from "../../assets/book.png";
const CartItem = ({ cartItem }) => {
  const { title, thumbnail, price, quantity } = cartItem;
  return (
    <CartItemContainer>
      <img src={bookImage} alt={`${title}`} />
      <ItemDetails>
        <span>{title}</span>
        <span>
          {quantity} x ${price}
        </span>
      </ItemDetails>
    </CartItemContainer>
  );
};

export default CartItem;
