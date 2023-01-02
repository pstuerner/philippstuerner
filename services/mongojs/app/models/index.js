const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.verbs = require("./verbs.model.js")(mongoose);
db.listings = require("./cmc.model.js")(mongoose);
db.books = require("./books.model.js")(mongoose);
db.timeseries = require("./sinverguenza.model.js")(mongoose);

module.exports = db;
