const express = require("express");
const validator = require("express-validator");
const bodyParser = require("body-parser");
const config = require("./ config");

/**
 *  Import routes here
 */

// Initialze a express application
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());

app.use((req, res, next) => {
  config.accessOptions.map((option) => {
    res.set(option.name, option.val);
  });
  next();
});

/**
 *  Use routes here
 */
app.listen(3000, () => {
  console.log(
    " < TRANSPORT MANAGEMENT API > \n Express server is running at port 3000 \n"
  );
});
