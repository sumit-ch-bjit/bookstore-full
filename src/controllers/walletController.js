const Wallet = require('../models/walletModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');

// Function to get wallet balance
getWalletBalance = async (req, res) => {
    try {
        const { userId } = req.params
        // Fetch the user's wallet based on the user ID from the request
        const wallet = await Wallet.findOne({ user: userId }).populate('transactions');

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
depositFunds = async (req, res) => {
    try {
        // console.log("hello")
        const { amount, user } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const userExists = await User.exists({ _id: user });
        // Find the user's wallet and update the balance
        const wallet = await Wallet.findOne({ user: user });

        console.log(wallet, userExists)

        if (!wallet && userExists) {
            console.log(user)
            console.log(amount)

            const wallet = new Wallet({
                user: user,
                balance: parseFloat(amount),
            });

            await wallet.save();
        } else {
            wallet.balance += parseFloat(amount);
            await wallet.save();
        }

        // Create a transaction record
        const transaction = new Transaction({
            user: user,
            amount: parseFloat(amount),
            type: 'deposit',
        });
        await transaction.save();

        res.status(200).json({ message: 'Funds deposited successfully', transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getWalletBalance, depositFunds }