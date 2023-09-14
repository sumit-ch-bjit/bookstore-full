const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Auth = require("../models/authModel");
const HTTP_STATUS = require("../constants/statusCodes");

const register = async (req, res) => {
  try {
    const { username, email, password, role, firstName, lastName } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "email already taken" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
    });

    // Save the user to the database
    const user = await newUser.save();

    const userId = user._id;

    const newAuth = new Auth({
      user: userId,
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newAuth.save();

    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "User registered successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  //check for user email
  const user = await Auth.findOne({ email });

  console.log(user);

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(500).json({ message: "internal server error" });
  }
};

const generateToken = (id) => {
  console.log("i am here");
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = { register, login };
