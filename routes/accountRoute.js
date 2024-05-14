// Needed Resources 
const express = require("express")
const router = new express.Router()
const Util = require("../utilities/")
const acctController = require("../controllers/acctController")


// Route to build inventory by classification view
router.get("/login", Util.handleErrors(acctController.buildLogin));


module.exports = router;