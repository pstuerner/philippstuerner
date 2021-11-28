const express = require("express");
const mongodb = require("mongodb");
const cors = require('cors');

const port = 8002;
const app = express();
const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_USER_PW}@${process.env.MONGO_IP}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

app.use(cors());

mongodb.MongoClient.connect(uri, async (err, client) => {
  app.get("/listings", (req, res) => {
    let query;
    if (req.query.last) {
        query = client.db("cmcscanner").collection("listings").find().sort({timestamp: -1}).limit(+req.query.last).toArray()
    } else if (req.query.unixTimestamp) {
        query = client.db("cmcscanner").collection("listings").findOne({
            timestamp: {$gte: new Date(new Date(+req.query.unixTimestamp).toISOString())}
        })
    } else if (req.query.allTimestamps) {
        query = client.db("cmcscanner").collection("listings").find({}).project({"timestamp":1,"_id":0}).sort({timestamp: -1}).toArray()
    } else {}

    if (query) {
        query.then(result => {
            if (result) {
                res.send(result)
            }
        })
    }
  });

  // listen for requests
  var listener = app.listen(port, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
});