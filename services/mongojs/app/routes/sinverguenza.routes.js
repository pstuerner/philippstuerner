module.exports = app => {
    const sinverguenza = require("../controllers/sinverguenza.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all verbs
    router.get("/timeseries", sinverguenza.timeseries);
  
    app.use("/api/sinverguenza", router);
  };
  