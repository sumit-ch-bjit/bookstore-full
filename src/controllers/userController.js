const User = require('../models/userModel')

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


module.exports = { getMyProfile, getUserProfile };
