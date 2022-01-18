const mongojs = require("mongojs");
const express = require("express");
const helper = require("../helper");
const auth = require("../auth");

const router = express.Router();
const db = mongojs("transport_management");

/**
 *  Collection Name
 *  @type {String}
 */
const collectionName = "vehicles";

/**
 *  Get all vechicles
 *  @function
 *  @returns {Array} Array of vechicles
 */
router.get("/", auth, (req, res) => {
  db[collectionName].find({}, (err, data) => {
    helper.respondToUser(res, err, data);
  });
});

/**
 *  Get one vechicle
 *  @function
 *  @param {String} MongoId of user
 *  @returns {Object} User object
 */
router.get("/:id", auth, (req, res) => {
  // Validation
  req.checkParams("id", "User id should be mongoId").notEmpty().isMongoId();
  var errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return false;
  }

  db[collectionName].findOne(
    { _id: mongojs.ObjectId(req.params.id) },
    (err, data) => {
      helper.respondToUser(res, err, data);
    }
  );
});

/**
 *  Create a vehicle
 *  @function
 *  @returns {Object} Status
 */
router.post("/", auth, (req, res) => {
  // Validation
  req.checkBody("name", "Vecicle name should not be empty").notEmpty();
  req.checkBody("plateNumber", "Plate number should not be emtpy").notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return false;
  }

  // Modification
  req.body.createdAt = new Date();

  db[collectionName].insert(req.body, (err, data) => {
    helper.respondStatusToUser(res, err, data, { msg: "Vehicle added !" });
  });
});

/**
 *  Update a vehicle
 *  @function
 *  @param {String} VehicleId
 *  @returns {Object} Status
 */
router.put("/:id", auth, (req, res) => {
  // Validation
  req.checkBody("name", "Vecicle name should not be empty").notEmpty();
  req.checkBody("plateNumber", "Plate number should not be emtpy").notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return false;
  }

  db[collectionName].update(
    { _id: mongojs.ObjectId(req.params.id) },
    { $set: req.body },
    { multi: false },
    (err, data) => {
      helper.respondStatusToUser(res, err, data, {
        msg: "Vehicle data updated !",
      });
    }
  );
});

/**
 *  Delete vehicle
 *  @function
 *  @param {String} VehicleId
 *  @returns {Object} Status
 */
router.delete("/:id", auth, (req, res) => {
  // Validation
  req.checkParams("id", "User id should be mongoId").notEmpty().isMongoId();
  let errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return false;
  }
  db[collectionName].remove(
    { _id: mongojs.ObjectId(req.params.id) },
    (err, data) => {
      helper.respondStatusToUser(res, err, data, { msg: "Vehicle deleted !" });
    }
  );
});

module.exports = router;