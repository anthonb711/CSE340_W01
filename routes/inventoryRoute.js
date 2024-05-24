// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Util = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// GET Routes
router.get("/add-classification", Util.handleErrors(invController.buildAddClassification));
router.get("/getInventory/:classificationId", Util.handleErrors(invController.getInventoryJSON));
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));
router.get("/", Util.handleErrors(invController.buildManagement));
router.get("/ErrorLink/", Util.handleErrors(invController.make500));
router.get("/add-inventory", Util.handleErrors(invController.buildAddInventory));
router.get("/detail/:detailId",  Util.handleErrors(invController.buildByDetailId));
router.get("/edit/:detailId", Util.handleErrors(invController.editInvData));

// POST Routes
router.post("/add-classification", invValidate.classificationRules(),
  invValidate.checkClassificationData, Util.handleErrors(invController.addClassification) )

router.post("/add-inventory", invValidate.inventoryRules(),
  invValidate.checkInventoryData, Util.handleErrors(invController.addInventory) )

module.exports = router;