module.exports = app => {
    const cmc = require("../controllers/cmc.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all verbs
    router.get("/timestamps", cmc.timestamps);
    router.get("/listings", cmc.listings);
  
    app.use("/api/cmc", router);
  };
  