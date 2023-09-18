const Book = require("../models/bookModel");
const User = require("../models/userModel");
const Cart = require('../models/cartModel')
const asyncHandler = require('express-async-handler')
const { sendResponse } = require("../utils/common");
const HTTP_STATUS = require('../constants/statusCodes')

const viewCart = async (req, res) => {
  try {
    const userId = req.user._id

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const cart = await Cart.findOne({ user: userId }).populate('books.book');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(200).json({ books: cart.books });
  } catch (error) {
    console.error('Error viewing cart:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const addToCart = async (req, res) => {
  try {
    const userId = req.user._id
    console.log(userId, "user id")
    const { bookId, quantity } = req.body
    // console.log(userId)
    const [userExists, book] = await Promise.all([
      User.exists({ _id: userId }),
      Book.findById(bookId),
    ]);

    if (!userExists) {
      return sendResponse(res, 404, "user not found")
    }

    if (!book) {
      return sendResponse(res, 404, "book not found")
    }


    if (book.stock < quantity) {
      return res.status(400).json({ message: "Not enough product in stock" });
    }
    // Check if the user already has a cart; create one if not
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      const newCart = await Cart.create({
        user: userId,
        books: [{ book: bookId, quantity: quantity }],
        total: book.price * quantity,
      });

      if (newCart) {
        return res
          .status(201)
          .json({ message: "added new items to the cart", newCart });
      }
    }

    const bookIndex = cart.books.findIndex(
      (item) => item.book.toString() === bookId
    );

    if (bookIndex !== -1) {
      if (book.stock < cart.books[bookIndex].quantity + quantity) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "not enough books in stock" });
      }
      cart.books[bookIndex].quantity += quantity;
    } else {
      cart.books.push({ book: bookId, quantity });
    }

    cart.total = cart.total + book.price * quantity;

    await cart.save();
    return res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "book added to existing cart", cart });
  }
  catch (error) {
    console.log(error);
  }
};

const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const { bookId, quantity } = req.body;

  const [cart, book] = await Promise.all([
    Cart.findOne({ user: userId }),
    Book.findById(bookId),
  ]);


  if (!book) {
    return sendResponse(res, 404, "book not found")
  }


  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }


  if (!book) {
    return res
      .status(HTTP_STATUS.NOT_FOUND)
      .json({ message: "book with ID not found" });
  }


  const bookIndex = cart.books.findIndex(
    (item) => item.book.toString() === bookId
  );


  if (bookIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  if (cart.books[bookIndex].quantity < quantity) {
    return res
      .status(HTTP_STATUS.NOT_FOUND)
      .json({ message: "not enough books in the cart" });
  }

  if (cart.books[bookIndex].quantity === quantity) {
    cart.books.splice(bookIndex, 1);
    cart.total = cart.total - quantity * book.price;

    if (cart.books.length === 0) await Cart.findOneAndDelete({ user: userId })

    return res
      .status(HTTP_STATUS.OK)
      .json({ message: "product removed from cart" });
  }

  if (cart.books[bookIndex].quantity > quantity) {
    cart.books[bookIndex].quantity -= quantity;
    cart.total = cart.total - quantity * book.price;
    await cart.save();
    return res
      .status(HTTP_STATUS.OK)
      .json({ message: "book reduced in cart", cart });
  }
})

module.exports = { addToCart, removeFromCart, viewCart };
