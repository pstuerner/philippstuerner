module.exports = app => {
  const test = require("../controllers/books.controller.js");

  var router = require("express").Router();

  // Retrieve all verbs
  router.get("/", test.findAll);

  app.use("/api/library/books", router);
};
