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
    
    
    res.render("cart/user-cart", {
      title: "Cart",
      nav,
      errors: null,
      
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