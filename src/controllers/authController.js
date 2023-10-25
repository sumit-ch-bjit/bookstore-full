const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
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
        .json({ success: false, message: "email already taken" });
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
      .json({ success: true, message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const login = async (req, res) => {
  try {
    // return res.status(200).json({ message: "login done" })
    console.log("hello")
    const { email, password } = req.body;
    console.log(email, password);

    //check for user email
    const auth = await Auth.findOne({ email });
    const user = await User.findOne({ email });



    if (!auth || !user) {
      return res.status(200).json({ success: false, message: "user not found" })
    }

    // console.log(auth, user)

    const genToken = {
      user,
      role: auth.role
    }

    // console.log(genToken)

    if (auth && (await bcrypt.compare(password, auth.password))) {
      console.log("login successful")
      return res.status(200).json({
        success: true,
        _id: user.id,
        email: user.email,
        token: generateToken(genToken),
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" })
  }
};

const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = { register, login };
