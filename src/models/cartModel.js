const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    books: {
      type: [
        {
          _id: false,
          book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book", // Reference to the Product model
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1, // Minimum quantity should be 1
          },
        },
      ],
    }, // Array of cart items, each with a product and quantity
    total: { type: Number, required: true },
    discountedTotal: { type: Number }
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
