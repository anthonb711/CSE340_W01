// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Util = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));
router.get("/detail/:detailId", Util.handleErrors(invController.buildByDetailId));
router.get("/ErrorLink/", Util.handleErrors(invController.make500));

module.exports = router;