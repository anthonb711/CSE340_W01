// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:detailId", invController.buildByDetailId);
router.get("/ErrorLink", invController.make500)

module.exports = router;