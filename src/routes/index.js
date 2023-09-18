const books = require("./books/booksRoute");
const users = require("./user/userRoutes");
const auth = require("./user/authRoutes");
const cart = require("./books/cartRoutes");
const reviews = require('./books/reviewRoutes')

const constructorMethod = (app) => {
  app.use("/api/books", books);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/cart", cart);
  app.use("/api/reviews", reviews)

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
