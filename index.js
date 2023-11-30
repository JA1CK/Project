var express = require("express");
var mongoose = require("mongoose");
var app = express();
var database = require("./config/database");
var bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
var path = require("path");

var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// serve static file from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(database.url);

var Movie = require("./models/movie");

// use handlebars as view engine
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");

//get all employee data from db
app.get("/", function (req, res) {
  // use mongoose to get all todos in the database
  Movie.find()
    .exec()
    .then((movies) => {
      // send data
      res.json(employees);
    })
    .catch((err) => {
      // send the error
      res.send(err);
    });
});

app.listen(port);
console.log("App listening on port : " + port);
