import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
} from "../../store/cart/cart.selector";
import apiInstance from "../../api/apiInstance";
import CheckoutItem from "../../components/checkout-item/checkout-item.component";
import { resetCart } from "../../store/cart/cart.reducer";

import {
  CheckoutContainer,
  CheckoutHeader,
  HeaderBlock,
  Total,
} from "./checkout.styles";
import Button, {
  BUTTON_TYPE_CLASSES,
} from "../../components/button/button.component";
import { selectCurrentUserId } from "../../store/user/user.selector";
import { ToastContainer, toast } from "react-toastify";

const Checkout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const userId = useSelector(selectCurrentUserId);
  // const removeItemHandler = () => dispatch(removeItemFromCart(cartItem));
  const [cartId, setCartId] = useState();

  useEffect(() => {
    const getUserCart = () => {
      apiInstance
        .get(`/cart/view-cart/${userId}`)
        .then((res) => {
          console.log("getting user cart", res.data);
          return res.data;
        })
        .then((data) => setCartId(data.cart._id))
        .catch((error) => console.log(error));
    };
    getUserCart();
  });

  console.log(cartId, "this is the cartid");

  const clearCart = async () => {
    try {
      const res = await apiInstance.delete(`/cart/remove-all/${cartId}`);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await apiInstance.post(`/cart/checkout/${cartId}`);
      if (res.data.success) {
        console.log(res.data.success);
        clearCart();
        dispatch(resetCart());
        toast.success("checkout successfull");
      } else {
        toast.error("deposit balance");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(cartItems);

  return (
    <CheckoutContainer>
      <CheckoutHeader>
        <HeaderBlock>
          <span>Product</span>
        </HeaderBlock>
        <HeaderBlock>
          <span>Description</span>
        </HeaderBlock>
        <HeaderBlock>
          <span>Quantity</span>
        </HeaderBlock>
        <HeaderBlock>
          <span>Price</span>
        </HeaderBlock>
        {/* <HeaderBlock>
          <span>Remove</span>
        </HeaderBlock> */}
      </CheckoutHeader>
      {cartItems.map((cartItem) => (
        <CheckoutItem
          key={cartItem.id}
          cartItem={cartItem}
          user={userId}
          cartId={cartId}
        />
      ))}
      <Total>Total: ${cartTotal.toFixed(3)}</Total>
      <Button buttonType={BUTTON_TYPE_CLASSES.base} onClick={handleCheckout}>
        CheckOut
      </Button>
      <ToastContainer />
    </CheckoutContainer>
  );
};

export default Checkout;
