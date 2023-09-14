const search = require("./books/search");

const constructorMethod = (app) => {
  app.use("/search", search);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
