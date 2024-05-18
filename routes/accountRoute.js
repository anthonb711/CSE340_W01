// Needed Resources 
const express = require("express")
const router = new express.Router()
const Util = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const acctController = require("../controllers/acctController")


// GET Routes
router.get("/login", Util.handleErrors(acctController.buildLogin))
router.get("/registration", Util.handleErrors(acctController.builRegistration))

//POST Routes
router.post("/registration",
regValidate.registationRules(),
regValidate.loginRules(),
regValidate.checkLoginData, Util.handleErrors(acctController.buildLogin),
regValidate.checkRegData, Util.handleErrors(acctController.registerAccount))

// Process the login attempt
router.post("/login", (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;