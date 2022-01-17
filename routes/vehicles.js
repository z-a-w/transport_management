const mongojs = require("mongojs");
const express = require("express");
const helper = require("../helper");
const jwt = require("jsonwebtoken");
const auth = require("../auth");

const router = express.Router();
const db = mongojs("transport_management");
const Promise = require("core-js-pure/features/promise");
const config = require("../ config");

/**
 *  Collection Name
 *  @type {String}
 */
const collectionName = "vehicles"

/**
 *  Get all vechicles
 *  @function 
 *  @returns {Array} Array of vechicles
 */
router.get("/", auth.verifyToken(), (req, res) => {
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
router.get("/:id", auth.verifyToken(), (req, res) => {
    // Validation
    req.checkParams("id", "User id should be mongoId").notEmpty().isMongoId();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return false;
    }

    db[collectionName].findOne({ _id: mongojs.ObjectId(req.params.id) }, (err, data) => {
        helper.respondToUser(res, err, data);
    });
});

/**
 *  Create a vechcle
 *  @function
 *  @returns {Object} Status
 */
router.post("/", auth.verifyToken(), (req, res) => {
    // Validation
    
})
