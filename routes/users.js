const mongojs = require("mongojs");
const express = require("express");
const helper = require("../helper");
const jwt = require("jsonwebtoken");
const auth = require("../auth");

const router = express.Router();
const db = mongojs("transport_management");
const Promise = require("core-js-pure/features/promise");
const config = require("../ config");

// Get all users
router.get("/", auth.verifyToken(), (req, res) => {
  db.users.find({}, (err, data) => {
    helper.respondToUser(res, err, data);
  });
});

// Get one user
router.get("/:id", auth, (req, res) => {
  // Validation
  req.checkParams("id", "User id should be mongoId").notEmpty().isMongoId();
  var errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return false;
  }

  db.users.findOne({ _id: mongojs.ObjectId(req.params.id) }, (err, data) => {
    helper.respondToUser(res, err, data);
  });
});

// Create a user
router.post("/", auth, async (req, res) => {
  // Validation
  req.checkBody("name", "Name should not be empty").notEmpty();
  req
    .checkBody("password", "Password length should be gt than 6")
    .notEmpty()
    .isLength(6);
  req.checkBody("role", "Role should not be empty").notEmpty();
  req.checkBody("displayName", "Display name shoudl not be empty").notEmpty();
  req.checkBody("department", "Department should not be empty").notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return false;
  }

  // Validate if user already exists
  try {
    if (await isUserExists())
      return res.status(409).send("User already exists");
  } catch (err) {
    res.status(500).json(err);
  }

  // Modification
  req.body.createdAt = new Date();
  req.body.password = helper.hashPassword(req.body.password);

  // Create user in database
  db.users.insert(req.body, (err, data) => {
    if (err) res.status(500).json(err);
    var user = data;

    // Create token
    const token = jwt.sign({ user_id: user._id }, config.jwtKey);

    // Save user token to user
    user.token = token;

    // Return new user
    res.status(200).json(user);
  });
});

// Update a user
router.put("/:id", auth.verifyToken(), (req, res) => {
  // Validation
  req.checkBody("name", "Name should not be empty").notEmpty();
  req.checkBody("role", "Role should not be empty").notEmpty();
  req.checkBody("displayName", "Display name shoudl not be empty").notEmpty();
  req.checkBody("department", "Department should not be empty").notEmpty();

  // If there's a password
  if (req.body.password) {
    req
      .checkBody("password", "Password length should be gt than 6")
      .notEmpty()
      .isLength(6);
    req.body.password = helper.hashPassword(req.body.password);
  }
  let errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return false;
  }

  db.users.update(
    { _id: mongojs.ObjectId(req.params.id) },
    { $set: req.body },
    { multi: false },
    (err, data) => {
      helper.respondStatusToUser(res, err, data, {
        msg: "User data updated !",
      });
    }
  );
});

// Delete user
router.delete("/:id", auth, (req, res) => {
  // Validation
  req.checkParams("id", "User id should be mongoId").notEmpty().isMongoId();
  let errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return false;
  }

  db.users.remove({ _id: mongojs.ObjectId(req.params.id) }, (err, data) => {
    helper.respondStatusToUser(res, err, data, { msg: "User deleted !" });
  });
});

// Login user
router.post("/login", (req, res) => {
  // Validation
  req.checkBody("username", "Username should not be empty").notEmpty();
  req.checkBody("password", "Password should not be empty").notEmpty();
  let errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return false;
  }

  // Find user in database
  db.users.findOne({ username: req.body.username }, (err, data) => {
    var user = data;
    if (err) res.status(500).json(err);
    if (user && user.password == helper.hashPassword(req.body.password)) {
      // Create token
      const token = jwt.sign({ user_id: user._id }, config.jwtKey);
      // Save user token
      user.token = token;
      // return user
      res.status(200).json(user);
    }
  });
});

function isUserExists(username) {
  return new Promise((resolve, reject) => {
    db.users.findOne({ username }, (err, data) => {
      if (err) reject(err);
      else if (!data) resolve(false);
      else return resolve(true);
    });
  });
}
