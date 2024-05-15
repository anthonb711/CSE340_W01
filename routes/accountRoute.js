// Needed Resources 
const express = require("express")
const router = new express.Router()
const Util = require("../utilities/")
const acctController = require("../controllers/acctController")


// GET Routes
router.get("/login", Util.handleErrors(acctController.buildLogin))
router.get("/registration", Util.handleErrors(acctController.builRegistration))

//POST Routes
router.post("/registration", Util.handleErrors(acctController.registerAccount))

module.exports = router;