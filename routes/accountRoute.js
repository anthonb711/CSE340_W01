// Needed Resources 
const express = require("express");
const router = new express.Router();
const Util = require("../utilities/");
const regValidate = require('../utilities/account-validation');
const acctController = require("../controllers/acctController");

/* *******************************
 * GET ROUTES
 ****************************** */
router. get("/", 
  Util.checkLogin, Util.handleErrors(acctController.buildAcctManagement));
router.get("/login", Util.handleErrors(acctController.buildLogin));
router.get("/logout", Util.handleErrors(acctController.buildLogout));
router.get("/registration", Util.handleErrors(acctController.builRegistration));


/* *******************************
 * POST ROUTES
 ****************************** */
router.post("/registration",
  regValidate.registationRules(),
  regValidate.checkRegData, Util.handleErrors(acctController.registerAccount));

// Process the login attempt
router.post("/login", 
  regValidate.loginRules(),
  regValidate.checkLoginData, Util.handleErrors(acctController.acctLogin)
);

module.exports = router;