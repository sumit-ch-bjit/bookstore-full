const Wallet = require('../models/walletModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');

// Function to get wallet balance
exports.getWalletBalance = async (req, res) => {
    try {
        // Fetch the user's wallet based on the user ID from the request
        const wallet = await Wallet.findOne({ user: req.user._id }).populate('transactions');

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        res.status(200).json({ balance: wallet.balance, transactions: wallet.transactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to deposit funds into the wallet
exports.depositFunds = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        // Find the user's wallet and update the balance
        const wallet = await Wallet.findOne({ user: req.user._id });

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        wallet.balance += parseFloat(amount);
        await wallet.save();

        // Create a transaction record
        const transaction = new Transaction({
            user: req.user._id,
            amount: parseFloat(amount),
            type: 'deposit',
        });
        await transaction.save();

        res.status(200).json({ message: 'Funds deposited successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
