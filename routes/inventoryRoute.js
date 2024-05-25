// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Util = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// GET Routes
router.get("/", 
  Util.checkAcctType, Util.handleErrors(invController.buildManagement));
  
router.get("/add-classification", 
  Util.checkAcctType, Util.handleErrors(invController.buildAddClassification));

router.get("/getInventory/:classificationId", 
  Util.handleErrors(invController.getInventoryJSON));

router.get("/type/:classificationId", 
  Util.handleErrors(invController.buildByClassificationId));

router.get("/ErrorLink/", 
  Util.handleErrors(invController.make500));

router.get("/add-inventory", Util.checkAcctType,
  Util.handleErrors(invController.buildAddInventory));

router.get("/detail/:detailId", 
  Util.handleErrors(invController.buildByDetailId));

router.get("/edit/:detailId", Util.checkAcctType,
  Util.handleErrors(invController.editInvData));

router.get("/delete/:invId", Util.checkAcctType,
  Util.handleErrors(invController.buildDeleteInv));

// POST Routes
router.post("/add-classification",
  Util.checkAcctType, invValidate.classificationRules(),
  invValidate.checkClassificationData,
  Util.handleErrors(invController.addClassification));

router.post("/add-inventory", 
  Util.checkAcctType, invValidate.inventoryRules(),
  invValidate.checkInventoryData, Util.handleErrors(invController.addInventory));

router.post("/update/",
  Util.checkAcctType, invValidate.inventoryRules(), invValidate.checkUpdateData, 
  Util.handleErrors(invController.updateInv));

router.post("/remove/",
  Util.checkAcctType, Util.handleErrors(invController.deleteInv));

module.exports = router;