const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utils/common");
const HTTP_STATUS = require("../constants/statusCodes");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //get user from token
      req.user = await Auth.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const isAuthenticated = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized access");
    }
    const token = req.headers.authorization.split(" ")[1];
    const validate = jwt.verify(token, process.env.JWT_SECRET);
    if (validate) {
      const decoded = jwt.decode(token)
      req.user = decoded.user
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Invalid Credentials");
    } else if (error instanceof jwt.TokenExpiredError) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Please log in again");
    } else
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
  }
};

const isAdmin = (req, res, next) => {
  try {
    console.log("i am here")
    if (!req.headers.authorization) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized access");
    }
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    const validate = jwt.decode(token);
    console.log(validate)
    // console.log(validate.user.role);
    if (validate.user.role === "admin") {
      next();
    } else {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized access");
    }
  } catch (error) {
    console.log(error);
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
};

module.exports = { isAuthenticated, isAdmin, protect };