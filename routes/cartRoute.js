// Needed Resources 
const express = require("express");
const router = new express.Router();
const cartController = require("../controllers/cartController");
const Util = require("../utilities");


router.get("/",
 Util.checkLogin, Util.handleErrors(cartController.buildCart));
 
 router.get("/getCList/:acctId",
 Util.checkLogin, Util.checkAcctType,
  Util.handleErrors(cartController.getCartJSON));

router.get("/cart-management", 
Util.checkLogin, Util.checkAcctType, Util.handleErrors(cartController.buildManagement))

router.post("/:cartId",
  Util.handleErrors(cartController.removeFromCart)
)
router.post("/:cartId/:acctId",
  Util.checkLogin, Util.checkAcctType,
  Util.handleErrors(cartController.removeFromManagedCart)
)

module.exports = router;