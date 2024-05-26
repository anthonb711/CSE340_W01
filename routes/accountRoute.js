// Needed Resources 
const express = require("express");
const router = new express.Router();
const Util = require("../utilities/");
const acctValidate = require('../utilities/account-validation');
const acctController = require("../controllers/acctController");

/* *******************************
 * GET ROUTES
 ****************************** */
router. get("/", 
  Util.checkLogin, Util.handleErrors(acctController.buildAcctManagement));

router.get("/updateInfo/:acctId",
  Util.handleErrors(acctController.buildUpdateInfo));

router.get("/login",
  Util.handleErrors(acctController.buildLogin));

router.get("/logout",
  Util.handleErrors(acctController.buildLogout));

router.get("/registration",
  Util.handleErrors(acctController.builRegistration));


/* *******************************
 * POST ROUTES
 ****************************** */
router.post("/registration",
  acctValidate.registationRules(),
  acctValidate.checkRegData, Util.handleErrors(acctController.registerAccount));

// Process the login attempt
router.post("/login", 
  acctValidate.loginRules(),
  acctValidate.checkLoginData, Util.handleErrors(acctController.acctLogin));

router.post("/updateInfo",
  acctValidate.UpdateRules(), acctValidate.checkUpdateData, 
  Util.handleErrors(acctController.updateInfo));

module.exports = router;