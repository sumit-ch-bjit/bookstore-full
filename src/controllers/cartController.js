const Book = require("../models/bookModel");
const User = require("../models/userModel");
const Cart = require('../models/cartModel')
const { calculateTotalPrice } = require('./transactionController')
const asyncHandler = require('express-async-handler')
const { sendResponse } = require("../utils/common");
const HTTP_STATUS = require('../constants/statusCodes')

const viewCart = async (req, res) => {
  try {
    const userId = req.user.user._id

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const cart = await Cart.findOne({ user: userId }).populate('books.book');

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    return res.status(200).json({ success: true, books: cart.books });
  } catch (error) {
    console.error('Error viewing cart:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const addToCart = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const { bookId, quantity } = req.body;

    const [userExists, book] = await Promise.all([
      User.exists({ _id: userId }),
      Book.findById(bookId),
    ]);

    if (!userExists) {
      return sendResponse(res, 404, "User not found");
    }

    if (!book) {
      return sendResponse(res, 404, "Book not found");
    }

    if (book.stock < quantity) {
      return res.status(400).json({ success: false, message: "Not enough product in stock" });
    }

    // Check if the user already has a cart; create one if not
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create a new cart
      cart = await Cart.create({
        user: userId,
        books: [{ book: bookId, quantity: quantity }],
        total: book.price * quantity,
      });

      // Populate the 'books.book' field
      await cart.populate("books.book")

      await cart.save();

      cart.discountedTotal = await calculateTotalPrice(cart._id);

      await cart.save();

      return res.status(201).json({ success: true, message: "Added new items to the cart", cart });
    }

    // Check if the book is already in the cart
    const existingCartItem = cart.books.find(
      (item) => item.book.toString() === bookId
    );

    if (existingCartItem) {
      // Increase the quantity of the existing book
      existingCartItem.quantity += quantity;
    } else {
      // Add the new book and quantity to the cart
      cart.books.push({ book: bookId, quantity });
    }

    // Calculate the total price change
    const totalPriceChange = book.price * quantity;

    // Update the total price of the cart
    cart.total += totalPriceChange;

    // Populate the 'books.book' field
    await cart.populate("books.book")

    await cart.save()

    // Calculate the discounted total and save the cart
    cart.discountedTotal = await calculateTotalPrice(cart._id);
    await cart.save();

    return res
      .status(201)
      .json({ success: true, message: "Book added to the cart", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};




const removeFromCart = asyncHandler(async (req, res) => {
  try {
    const { cartId } = req.params;
    const { bookId, quantity } = req.body; // Add this line to get the quantity to remove

    // Find the cart by ID
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return sendResponse(res, 404, 'Cart not found');
    }

    // Find the book by ID
    const book = await Book.findById(bookId);


    if (!book) {
      return sendResponse(res, 404, 'Book not found');
    }

    // Check if the book is in the cart
    const cartItem = cart.books.find(
      (item) => item.book.toString() === bookId
    );

    if (!cartItem) {
      return sendResponse(res, 404, 'Book not found in the cart');
    }

    // Check if the quantity to remove is greater than the quantity in the cart
    if (quantity > cartItem.quantity) {
      return sendResponse(res, 400, 'Quantity to remove exceeds the quantity in the cart');
    }

    // Calculate the total price change when removing the specified quantity of the book
    const totalPriceChange = book.price * quantity;

    // Update the cart
    cartItem.quantity -= quantity; // Reduce the quantity
    cart.total -= totalPriceChange;

    if (cartItem.quantity === 0) {
      cart.books = cart.books.filter((item) => item.book.toString() !== bookId);
    }

    // Save the updated cart
    await cart.save();

    // Optionally, you can calculate the discounted total here
    cart.discountedTotal = await calculateTotalPrice(cart._id);
    await cart.save();

    await cart.populate("books.book")

    if (cart.books.length === 0) {
      return sendResponse(res, 200, 'No more books left in the cart');
    }

    return sendResponse(res, 200, 'Book removed from the cart', { cart });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, 'Internal server error');
  }
});
// const userId = req.user.user._id
// const { bookId, quantity } = req.body;

// const [cart, book] = await Promise.all([
//   Cart.findOne({ user: userId }),
//   Book.findById(bookId),
// ]);


// if (!book) {
//   return sendResponse(res, 404, "book not found")
// }


// if (!cart) {
//   return res.status(404).json({ message: "Cart not found" });
// }


// if (!book) {
//   return res
//     .status(HTTP_STATUS.NOT_FOUND)
//     .json({ message: "book with ID not found" });
// }


// const bookIndex = cart.books.findIndex(
//   (item) => item.book.toString() === bookId
// );


// if (bookIndex === -1) {
//   return res.status(404).json({ message: "Item not found in cart" });
// }

// if (cart.books[bookIndex].quantity < quantity) {
//   return res
//     .status(HTTP_STATUS.NOT_FOUND)
//     .json({ message: "not enough books in the cart" });
// }

// if (cart.books[bookIndex].quantity === quantity) {
//   cart.books.splice(bookIndex, 1);
//   cart.total = cart.total - quantity * book.price;

//   if (cart.books.length === 0) await Cart.findOneAndDelete({ user: userId })

//   return res
//     .status(HTTP_STATUS.OK)
//     .json({ message: "product removed from cart" });
// }

// if (cart.books[bookIndex].quantity > quantity) {
//   cart.books[bookIndex].quantity -= quantity;
//   cart.total = cart.total - quantity * book.price;
//   await cart.save();
//   cart.discountedTotal = await calculateTotalPrice(cart._id)
//   await cart.save()
//   return res
//     .status(HTTP_STATUS.OK)
//     .json({ message: "book reduced in cart", cart });
// }

module.exports = { addToCart, removeFromCart, viewCart };
