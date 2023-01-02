const db = require("../models");
const Timeseries = db.timeseries;

exports.timeseries = (req, res) => {
    query = Timeseries.find({}, {})
    
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