const books = require("./books/booksRoute");
const users = require("./user/userRoutes");
const auth = require("./user/authRoutes");

const constructorMethod = (app) => {
  app.use("/api/books", books);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
