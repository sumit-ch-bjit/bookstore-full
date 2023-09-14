// src/db.js
const mongoose = require("mongoose");
const chalk = require("chalk");

// Replace 'mongodb://localhost:27017/your-database-name' with your MongoDB connection URI.
const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/bookstore-test";

const connectDB = async () => {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`${chalk.bold.bgBlue("Connected to MongoDB")}`);
};

module.exports = connectDB;
