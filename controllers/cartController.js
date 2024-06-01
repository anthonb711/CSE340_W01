require("dotenv").config();
const jwt = require("jsonwebtoken")
const Util = require("../utilities/");
const cartModel = require("../models/cart-model");
const invModel = require("../models/inventory-model");
const acctModel = require("../models/account-model");


/* *******************************
 *  BUILD Cart
 ****************************** */
const buildCart = async (req, res, next) => {
  try {
    let nav = await Util.getNav();
  const data = await cartModel.getCartByAcctId(res.locals.accountData.account_id)
  const cartList = await Util.buildCartList(data);
  const userName = Util.makeUsername(res.locals.accountData);
    
    res.render("cart/user-cart", {
      title: userName + "'s Cart",
      nav,
      errors: null,
      cartList
      
    })
  }catch (error) {
  console.error(error);
  error.status = 500;
  error.message = "SERVER ERROR"
  next(error);
  }
};


module.exports = {
  buildCart
}