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

/* *******************************
 * GET CART JSON
 *
 * Return CART by Account ID As JSON
 ****************************** */
const getCartJSON = async (req, res, next) => {
  const account_id = parseInt(req.params.acctId)

  const cartData = await cartModel.getCartByAcctId(account_id)
  if (cartData[0].account_id) {
    return res.json(cartData)
  } else {
    next(new Error("No data returned"))
  }
}

/* *******************************
 * BUILD CART MANAGMENT
 ****************************** */
const buildManagement = async (req, res, next) => {

  try {
   
    let nav = await Util.getNav();
    const acctId = res.locals.accountData.account_id; 
    const welcomeBasic = res.locals.accountData.account_firstname;
    const clientSelect = await Util.buildClientList();

    res.render("cart/cart-management", {
      title: "Cart Management",
      nav,
      errors: null,
      welcomeBasic,
      acctId,
      clientSelect
   
    })

  } catch (error) {
  console.error("Build Cart Managemet", error);
  error.status = 500;
  error.message = "SERVER ERROR"
  next(error);
  }
}

/* *******************************
 * REMOVE FROM CART
 ****************************** */
const removeFromCart = async (req, res, next) => {
  try {
    const cart_id = parseInt(req.params.cartId);
    await cartModel.removeCartEntity(cart_id)
    if(res.locals.loggedIn === res.locals.accountData.account_id)
    return res.redirect("/cart/")

  } catch (error) {
    req.flash("ERROR: Could not load cart")
    res.redirect("/cart/")
  }
}

/* *******************************
 * REMOVE FROM CART
 ****************************** */
const removeFromManagedCart = async (req, res, next) => {
  try {
    const cart_id = parseInt(req.params.cartId);
    const account_id = parseInt(req.params.acctId);
    await cartModel.removeCartEntity(cart_id);
    Util.buildClientList(account_id);

    let nav = await Util.getNav();
    const acctId = res.locals.accountData.account_id; 
    const welcomeBasic = res.locals.accountData.account_firstname;
    const clientSelect = await Util.buildClientList();
    return res.render("cart/cart-management", {
      title: "Cart Management",
      nav,
      errors: null,
      welcomeBasic,
      acctId,
      clientSelect
   
    })
    
  } catch (error) {
    req.flash("ERROR: Could not load cart")
    res.redirect("/cart/")
  }
}

module.exports = {
  buildCart,
  removeFromCart,
  buildManagement,
  getCartJSON,
  removeFromManagedCart
}