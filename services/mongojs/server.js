const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to philippstuerner application." });
});

require("./app/routes/verbs.routes")(app);
require("./app/routes/cmc.routes")(app);
require("./app/routes/books.routes")(app);

// set port, listen for requests
const PORT = 8002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
