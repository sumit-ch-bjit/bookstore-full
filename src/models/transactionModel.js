const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['deposit', 'purchase'], // Transaction types
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
