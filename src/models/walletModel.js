const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    balance: {
        type: Number,
        default: 0.0, // Initial balance is 0.0
        required: true,
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction', // You can create a Transaction schema for transaction history
        },
    ],
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
