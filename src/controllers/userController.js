const User = require('../models/userModel')
const Auth = require('../models/authModel');
const Wallet = require('../models/walletModel');

const getMyProfile = (req, res) => {
  res.status(200).json({ profile: "user profile" });
};


const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's profile
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);
    const auth = await Auth.findOne({ user: userId })
    console.log(user)
    if (!user || !auth) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      await User.findByIdAndDelete(userId);
      await Auth.findOneAndDelete({ user: userId });
      await Wallet.findOneAndDelete({ user: userId });

      return res.status(200).json({ message: 'User deleted' });
    }
  } catch (error) {
    console.error('Error deleting user profile:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

const editUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, phone, address, city, state, zip } = req.body;
    const user = await User.findById(userId);
    const auth = await Auth.findOne({ user: userId })
    if (!user || !auth) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      await User.findByIdAndUpdate(userId, {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        email: email || user.email,
        phone: phone || user.phone,
        address: address || user.address,
        city: city || user.city,
        state: state || user.state,
        zip: zip || user.zip
      });
      await Auth.findOneAndUpdate({ user: userId }, {
        email: email || user.email
      });
      return res.status(200).json({ message: 'User updated' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { getMyProfile, getUserProfile, deleteUserProfile, editUserProfile };