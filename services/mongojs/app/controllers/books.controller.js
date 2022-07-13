const db = require("../models");
const Books = db.books;

// Retrieve all verbs from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  
  Books.find().limit(1)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
