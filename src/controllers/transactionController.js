const Cart = require("../models/cartModel");
const Transaction = require("../models/transactionModel");
const Wallet = require('../models/walletModel')
const asyncHandler = require("express-async-handler");
const HTTP_STATUS = require("../constants/statusCodes");


async function calculateTotalPrice(cartId) {
    try {
        // Find all cart items for the given cart ID and populate the 'product' field to access book details
        const cartItems = await Cart.findById(cartId).populate('books.book');

        const books = cartItems.books

        // Initialize the total price to 0
        let totalPrice = 0;

        // Iterate through each cart item and calculate the price
        for (const item of books) {
            const currentDate = new Date();
            // console.log(item.book)

            // Check if the product is eligible for a discount
            if (
                item.book.discountPercentage > 0 && // Product has a discount
                item.book.discountStartDate <= currentDate && // Discount is active
                item.book.discountEndDate >= currentDate
            ) {
                // Calculate the discounted price
                const discountedPrice =
                    item.book.price - (item.book.price * item.book.discountPercentage) / 100


                // Add the discounted price to the total
                totalPrice += (discountedPrice * item.quantity);
            } else {
                // If no discount applies, add the original price to the total
                totalPrice += item.book.price;
            }
        }

        return totalPrice;
    } catch (error) {
        console.error('Error calculating total price:', error);
        throw error;
    }
}

const checkout = asyncHandler(async (req, res) => {
    try {
        const { cartId } = req.params;

        // Get the user's cart
        const cart = await Cart.findById(cartId)
            .populate("user", "-createdAt -updatedAt")
            .populate("books.book"); // Populate the book details in the cart

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const wallet = await Wallet.findOne({ user: cart.user });

        if (!wallet) {
            return res.status(404).json({ success: false, message: 'Wallet not found, create your wallet by depositing money' });
        }

        // Calculate the total price of the items in the cart
        const cartTotal = await calculateTotalPrice(cartId);

        // Check if the user's wallet has sufficient funds for the total amount
        if (wallet.balance < cartTotal) {
            return res.status(400).json({ success: false, message: 'Insufficient funds in the wallet' });
        }

        // Check if there's enough stock for each book in the cart
        for (const cartItem of cart.books) {
            const book = cartItem.book;
            const quantityInCart = cartItem.quantity;

            if (book.stock < quantityInCart) {
                // Insufficient stock for this book
                return res.status(400).json({ success: false, message: `Insufficient stock for '${book.title}'` });
            }
        }

        // Deduct funds from the wallet based on the cart's total amount
        wallet.balance -= cartTotal;
        await wallet.save();

        // Create a new transaction to represent the purchase
        const transaction = new Transaction({
            user: cart.user,
            books: cart.books,
            amount: -cartTotal, // Negative amount to represent a purchase
            type: 'purchase',
        });

        await transaction.save();

        // Reduce the book stock and update their availability
        for (const cartItem of cart.books) {
            const book = cartItem.book;
            const quantityInCart = cartItem.quantity;

            // Reduce the stock for this book
            book.stock -= quantityInCart;
            await book.save();
        }

        // Add the transaction to the wallet's transactions array
        wallet.transactions.push(transaction);
        await wallet.save();

        // Clear the user's cart after a successful checkout
        cart.books = [];
        cart.total = 0;
        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json({ success: true, message: 'Checkout successful', transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

const getOwnTransactions = async (req, res) => {
    try {
        const userId = req.user.user._id; // Assuming you have implemented user authentication middleware

        // Query the database to fetch transactions for the specified user
        const transactions = await Transaction.find({ user: userId }).exec();

        // Respond with the transactions
        res.status(200).json({
            success: true,
            transactions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
        });
    }
};




const getTransactions = async (req, res) => {
    try {
        // Extract the userId from the request parameters
        const userId = req.params.userId;

        // Find transactions belonging to the specified user
        const transactions = await Transaction.find({ user: userId });

        if (!transactions) {
            return res.status(404).json({ success: false, message: 'No transactions found for this user' });
        }

        res.status(200).json({ success: true, transactions });
    } catch (error) {
        console.error('Error finding transactions by user:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}


// const checkout = asyncHandler(async (req, res) => {
//     try {
//         const { cartId } = req.params
//         // Get the user's wallet
//         const cart = await Cart.findById(cartId)
//             .populate("user", "-createdAt -updatedAt")

//         // console.log(cart)

//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found' });
//         }

//         const wallet = await Wallet.findOne({ user: cart.user });

//         if (!wallet) {
//             return res.status(404).json({ message: 'Wallet not found, create your wallet by depositing money' })
//         }

//         // console.log(wallet.balance, cart.total)

//         const cartTotal = await calculateTotalPrice(cartId)

//         console.log(cartTotal, "cartTotal found")
//         // Check if the user's wallet has sufficient funds for the total amount
//         if (wallet.balance < cartTotal) {
//             return res.status(400).json({ message: 'Insufficient funds in the wallet' });
//         }

//         // Deduct funds from the wallet based on the cart's total amount
//         wallet.balance -= cartTotal;
//         await wallet.save();

//         // Create a new transaction to represent the purchase
//         const transaction = new Transaction({
//             user: cart.user,
//             books: cart.books,
//             amount: -cartTotal, // Negative amount to represent a purchase
//             type: 'purchase',
//         });

//         await transaction.save();

//         // Add the transaction to the wallet's transactions array
//         wallet.transactions.push(transaction);
//         await wallet.save();

//         // Clear the user's cart after a successful checkout
//         cart.books = [];
//         cart.total = 0;
//         cart.updatedAt = Date.now();

//         await cart.save();

//         res.status(200).json({ message: 'Checkout successful', transaction });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


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


module.exports = { checkout, calculateTotalPrice, getTransactions, getOwnTransactions }