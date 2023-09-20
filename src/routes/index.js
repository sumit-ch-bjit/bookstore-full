const books = require("./store/booksRoute");
const users = require("./user/userRoutes");
const auth = require("./user/authRoutes");
const cart = require("./store/cartRoutes");
const reviews = require('./store/reviewRoutes')
const discount = require('./store/discountRoute')
const transaction = require('./store/transactionRoute')

const constructorMethod = (app) => {
  app.use("/api/books", books);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/cart", cart);
  app.use("/api/reviews", reviews);
  app.use("/api/discount", discount);
  app.use("/api/transaction", transaction);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
