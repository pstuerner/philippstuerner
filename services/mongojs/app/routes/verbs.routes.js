module.exports = app => {
  const verbs = require("../controllers/verbs.controller.js");

  var router = require("express").Router();

  // Retrieve all verbs
  router.get("/", verbs.findAll);

  app.use("/api/conjugator/verbs", router);
};
