// src/db.js
const mongoose = require("mongoose");
const chalk = require("chalk");

// Replace 'mongodb://localhost:27017/your-database-name' with your MongoDB connection URI.
// const mongoURI =
//   process.env.MONGO_URI

const connectDB = async () => {
  try {
    let mongoURL;

    if (process.env.NODE_ENV === 'production') {
      // In production or Docker Compose, use the service name as the hostname
      mongoURL = 'mongodb://mongodb:27017/test-database';
    } else {
      // In local development, use localhost
      mongoURL = 'mongodb://localhost:27017/test-database';
    }

    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`${chalk.bold.bgBlue("Connected to MongoDB")}`);
  } catch (error) {
    console.error('Could not connect to MongoDB:', error.message);
  }
};


module.exports = connectDB;
