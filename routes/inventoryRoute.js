// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Util = require("../utilities/")
const classValidate = require("../utilities/inventory-validation")

// GET Routes
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));
router.get("/detail/:detailId", Util.handleErrors(invController.buildByDetailId));
router.get("/ErrorLink/", Util.handleErrors(invController.make500));
router.get("/management", Util.handleErrors(invController.buildManagement));
router.get("/add-classification", Util.handleErrors(invController.buildAddClassification));
router.get("/add-inventory", Util.handleErrors(invController.buildAddInventory));

// POST Routes
router.post("/add-classification",
  classValidate.classificationRules(),
  classValidate.checkClassificationData, Util.handleErrors(invController.addClassification) )

module.exports = router;