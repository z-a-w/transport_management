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
const collectionName = "tasks";

/**
 *  Get one task
 *  @function
 *  @param {String} MongoId of task
 *  @returns {Object} Task object
 */
router.get("/:id", auth, (req, res) => {
  // Validation
  req.checkParams("id", "Task id should be mongoId").notEmpty().isMongoId();
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
 *  Get task with createdAt and vehicleId
 *  @function
 *  @param {String} Date in (dd-mm-yyyy) format
 *  @param {String} VehicleId
 *  @returns {Array} Tasks
 */
router.get("/:date/:vehicleId", auth, (req, res) => {
  // Validation
  req.checkParams("date", "Date should not be empty").notEmpty();
  req
    .checkParams("vehicleId", "VehicleId should be mongoId")
    .notEmpty()
    .isMongoId();
  var errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return false;
  }

  db[collectionName].find(
    {
      createdAt: new Date(req.params.date),
      vehicleId: req.params.vehicleId,
    },
    (err, data) => {
      helper.respondToUser(res, err, data);
    }
  );
});

/**
 *  Create a task
 *  @function
 *  @returns {Object} Status
 */
router.post("/", auth, (req, res) => {
  // Validation
  req.checkBody("name", "Task name should not be empty").notEmpty();
  req.checkBody("route", "Route should be array").notEmpty().isArray();
  req.checkBody("tasks", "Tasks should be array").notEmpty().isArray();
  req.checkBody("driver", "Driver should not be empty").notEmpty();
  req.checkBody("passengers", "Passenger should be array").notEmpty().isArray();
  req.checkBody("vehicle", "Vehicle should not be empty").notEmpty();
  req
    .checkBody("vehicleId", "VehicleId should be mongoId")
    .notEmpty()
    .isMongoId();
  req
    .checkBody("participants", "Participants should be array")
    .notEmpty()
    .isArray();
  req.checkBody("goingTime", "Going time should not be empty").notEmpty();
  req.checkBody("ePeriod", "Period should not be empty").notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return false;
  }

  // Modification
  req.body.createdAt = new Date();
  db[collectionName].insert(req.body, (err, data) => {
    helper.respondStatusToUser(res, err, data, { msg: "New task inserted !" });
  });
});

/**
 *  Update a task
 *  @function
 *  @param {String} TaskId
 *  @returns {Object} Status
 */
router.put("/:id", auth, (req, res) => {
  // Validation
  // Validation
  req.checkBody("name", "Task name should not be empty").notEmpty();
  req.checkBody("route", "Route should be array").notEmpty().isArray();
  req.checkBody("tasks", "Tasks should be array").notEmpty().isArray();
  req.checkBody("driver", "Driver should not be empty").notEmpty();
  req.checkBody("passengers", "Passenger should be array").notEmpty().isArray();
  req.checkBody("vehicle", "Vehicle should not be empty").notEmpty();
  req
    .checkBody("vehicleId", "VehicleId should be mongoId")
    .notEmpty()
    .isMongoId();
  req
    .checkBody("participants", "Participants should be array")
    .notEmpty()
    .isArray();
  req.checkBody("goingTime", "Going time should not be empty").notEmpty();
  req.checkBody("ePeriod", "Period should not be empty").notEmpty();
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
        msg: "Task data updated !",
      });
    }
  );
});

/**
 *  Delete task
 *  @function
 *  @param {String} TaskId
 *  @returns {Object} Status
 */
router.delete("/:id", auth, (req, res) => {
  // Validation
  req.checkParams("id", "Task id should be mongoId").notEmpty();
  let errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return false;
  }

  db[collectionName].remove(
    { _id: mongojs.ObjectId(req.params.id) },
    (err, data) => {
      helper.respondStatusToUser(res, err, data, { msg: "Task deleted !" });
    }
  );
});

module.exports = router;
