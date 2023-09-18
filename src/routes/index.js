const books = require("./books/booksRoute");
const users = require("./user/userRoutes");
const auth = require("./user/authRoutes");
const cart = require("./books/cartRoutes");
const reviews = require('./books/reviewRoutes')
const discount = require('./books/discountRoute')

const constructorMethod = (app) => {
  app.use("/api/books", books);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/cart", cart);
  app.use("/api/reviews", reviews);
  app.use("/api/discount", discount);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
