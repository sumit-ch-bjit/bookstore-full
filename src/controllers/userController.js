const getProfile = (req, res) => {
  res.status(200).json({ profile: "user profile" });
};

module.exports = { getProfile };
