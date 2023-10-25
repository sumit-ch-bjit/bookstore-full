import { createSlice } from '@reduxjs/toolkit';

const addCartItem = (cartItems, productToAdd) => {
    console.log(cartItems, productToAdd)
    const existingCartItem = cartItems.find(
        (cartItem) => cartItem._id === productToAdd._id
    );

    if (existingCartItem) {
        return cartItems.map((cartItem) =>
            cartItem._id === productToAdd._id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
        );
    }

    return [...cartItems, { ...productToAdd, quantity: 1 }];
};

const removeCartItem = (cartItems, cartItemToRemove) => {
    // find the cart item to remove
    const existingCartItem = cartItems.find(
        (cartItem) => cartItem._id === cartItemToRemove._id
    );

    // check if quantity is equal to 1, if it is remove that item from the cart
    if (existingCartItem.quantity === 1) {
        return cartItems.filter((cartItem) => cartItem._id !== cartItemToRemove._id);
    }

    // return back cartitems with matching cart item with reduced quantity
    return cartItems.map((cartItem) =>
        cartItem._id === cartItemToRemove._id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
    );
};

const clearCartItem = (cartItems, cartItemToClear) =>
    cartItems.filter((cartItem) => cartItem._id !== cartItemToClear._id);

const CART_INITIAL_STATE = {
    isCartOpen: false,
    cartItems: [],
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState: CART_INITIAL_STATE,
    reducers: {
        setIsCartOpen(state, action) {
            state.isCartOpen = action.payload;
        },
        addItemToCart(state, action) {
            console.log(action.payload, "payload")
            state.cartItems = addCartItem(state.cartItems, action.payload);
        },
        removeItemFromCart(state, action) {
            state.cartItems = removeCartItem(state.cartItems, action.payload);
        },
        clearItemFromCart(state, action) {
            state.cartItems = clearCartItem(state.cartItems, action.payload);
        },
        resetCart(state, action) {
            state.cartItems = []
            state.isCartOpen = false
        }
    },
});

export const {
    setIsCartOpen,
    addItemToCart,
    removeItemFromCart,
    clearItemFromCart,
    resetCart
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;