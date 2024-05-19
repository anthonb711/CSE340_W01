// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Util = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// GET Routes
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));
router.get("/detail/:detailId", Util.handleErrors(invController.buildByDetailId));
router.get("/ErrorLink/", Util.handleErrors(invController.make500));
router.get("/management", Util.handleErrors(invController.buildManagement));
router.get("/add-classification", Util.handleErrors(invController.buildAddClassification));
router.get("/add-inventory", Util.handleErrors(invController.buildAddInventory));

// POST Routes
router.post("/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData, Util.handleErrors(invController.addClassification) )

  router.post("/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  Util.handleErrors(invController.addInventory) )

module.exports = router;