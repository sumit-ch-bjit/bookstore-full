const User = require('../models/userModel')
const Auth = require('../models/authModel');
const Wallet = require('../models/walletModel');

const getMyProfile = async (req, res) => {
  try {
    console.log(req)
    // Get the authenticated user's ID from the authentication token or session
    const userId = req.user.user._id

    console.log(userId)


    // Find the user by their ID
    const user = await User.findById(userId) // Exclude sensitive information like the password

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return the user's profile
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
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
      return res.status(404).json({ success: false, message: 'User not found' });
    } else {
      await User.findByIdAndDelete(userId);
      await Auth.findOneAndDelete({ user: userId });
      await Wallet.findOneAndDelete({ user: userId });

      return res.status(200).json({ success: true, message: 'User deleted' });
    }
  } catch (error) {
    console.error('Error deleting user profile:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}



const editUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, phone, address, city, state, zip } = req.body;
    const user = await User.findById(userId);
    const auth = await Auth.findOne({ user: userId })
    if (!user || !auth) {
      return res.status(404).json({ success: false, message: 'User not found' });
    } else {
      const updatedUser = await User.findByIdAndUpdate(userId, {
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
      return res.status(200).json({ success: true, message: 'User updated', updatedUser });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

module.exports = { getMyProfile, getUserProfile, deleteUserProfile, editUserProfile };