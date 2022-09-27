module.exports = app => {
  const verbs = require("../controllers/verbs.controller.js");

  var router = require("express").Router();

  // Retrieve all verbs
  router.get("/random", verbs.random);
  router.get("/frequency", verbs.frequency);
  router.get("/range", verbs.range);
  router.get("/select", verbs.select);

  app.use("/api/conjugator/verbs", router);
};
