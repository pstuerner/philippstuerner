const db = require("../models");
const Listings = db.listings;

exports.timestamps = (req, res) => {
    query = Listings.find({}, {"timestamp":1,"_id":0}).sort({"timestamp": -1})
    
    query
    .then(data => {
        res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving verbs by frequency."
      });
    });
}

exports.listings = (req, res) => {
    const unixTimestamp = +req.query.unixTimestamp ? +req.query.unixTimestamp : null;
    const last = req.query.last ? req.query.last : null

    if (unixTimestamp) {
        query = Listings.findOne({
            "timestamp": {"$gte": new Date(new Date(unixTimestamp).toISOString())}
        })
    } else if (last) {
        query = Listings.find().sort({"timestamp": -1}).limit(last)
    } else {
        return
    }

    query
    .then(data => {
        res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving verbs by frequency."
      });
    });
}