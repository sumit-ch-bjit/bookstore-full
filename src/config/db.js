// src/db.js
const mongoose = require("mongoose");
const chalk = require("chalk");

// Replace 'mongodb://localhost:27017/your-database-name' with your MongoDB connection URI.
// const mongoURI =
//   process.env.MONGO_URI

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`${chalk.bold.bgBlue("Connected to MongoDB")}`);
  } catch (error) {
    console.log('could not connect to mongodb', error)
  }
};

module.exports = connectDB;
