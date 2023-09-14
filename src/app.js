const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const chalk = require("chalk");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const configRoutes = require("./routes");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;
dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(morgan("combined", { stream: accessLogStream }));

// Routes
configRoutes(app);

app.listen(port, () => {
  console.log(
    `${chalk.bold.yellow.bgMagenta(
      "server running on port"
    )} ${chalk.bold.bgRed(port)}`
  );
});
