const Cart = require("../models/cartModel");
const Transaction = require("../models/transactionModel");
const Wallet = require('../models/walletModel')
const asyncHandler = require("express-async-handler");
const HTTP_STATUS = require("../constants/statusCodes");


const checkout = asyncHandler(async (req, res) => {
    try {
        console.log("route hit")
        const { cartId } = req.params
        // Get the user's wallet
        const cart = await Cart.findById(cartId)
            .populate("user", "-createdAt -updatedAt")

        console.log(cart)

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const wallet = await Wallet.findOne({ user: cart.user });

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found, create your wallet by depositing money' })
        }

        console.log(wallet.balance, cart.total)


        // Check if the user's wallet has sufficient funds for the total amount
        if (wallet.balance < cart.total) {
            return res.status(400).json({ message: 'Insufficient funds in the wallet' });
        }

        // Deduct funds from the wallet based on the cart's total amount
        wallet.balance -= cart.total;
        await wallet.save();

        // Create a new transaction to represent the purchase
        const transaction = new Transaction({
            user: cart.user,
            books: cart.books,
            amount: -cart.total, // Negative amount to represent a purchase
            type: 'purchase',
        });

        await transaction.save();

        // Add the transaction to the wallet's transactions array
        wallet.transactions.push(transaction);
        await wallet.save();

        // Clear the user's cart after a successful checkout
        cart.books = [];
        cart.total = 0;
        cart.updatedAt = Date.now();

        await cart.save();

        res.status(200).json({ message: 'Checkout successful', transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


const checkout2 = asyncHandler(async (req, res) => {
    const { cartId } = req.params;
    console.log(cartId);

    try {
        const cart = await Cart.findById(cartId)
            .populate("user", "-createdAt -updatedAt")
            .populate("books.book");

        console.log(cart);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        if (cart.books.length === 0) {
            console.log("no books in the cart");
        }

        const transaction = new Transaction({
            user: cart.user,
            books: cart.books,
            total: cart.total,
            type: "purchase",

        });

        console.log(transaction);

        for (const item of cart.books) {
            const book = await Book.findById(item.book);
            if (book) {
                // Ensure the product has enough stock
                if (book.stock >= item.quantity) {
                    book.stock -= item.quantity;
                    await book.save();
                } else {
                    return res.status(400).json({
                        message: "Insufficient stock for some books in the order",
                    });
                }
            }
        }

        await transaction.save();

        cart.books = [];
        cart.total = 0;

        await cart.save();

        await Cart.findByIdAndDelete(cartId);

        res
            .status(200)
            .json({ message: "Order created and cart cleared successfully", transaction });
    } catch (error) {
        console.error("Error during checkout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = { checkout, checkout2 }