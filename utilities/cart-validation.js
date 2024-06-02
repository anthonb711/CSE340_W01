const Util = require (".");
  const { body, validationResult } = require("express-validator");
  const cartModel = require("../models/cart-model");
  const invModel = require("../models/inventory-model");
  const validate = {}
  
  
  /*  **********************************
  *  Add Inventory Rules for adding to cart
  * ********************************* */
  validate.cartRules = () => {
    return [
      // account ID is required 
      body("account_id")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .isLength({ min: 1 })
      .withMessage("Enter a vaild account id"),

      // vehicle ID is required
      body("inv_id")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .isLength({ min: 1 })
      .withMessage("Enter a vaild vehicle id ")
      .custom(async (inv_id) => {
        const invExists = await cartModel.getCartByInvId(inv_id)
        if (invExists){
          throw new Error("Vehicle is not avialable to be added to your cart at this time")
        }
      }),

      // vehicle quantity is required
      body("quantity")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .isLength({ min:1 })
      .withMessage("Please provide the quanity."),

      // vehicle date is required
      body("added_date")
      .trim()
      .escape()
      .notEmpty()
      .isDate( "format") 
      .isLength({ min:1 })
      .withMessage("Please provide the path to the vehicle thumbnail."),

      // vehicle price is required and must be a number only
      body("status")
      .equals("active")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min:1 })
      .withMessage("Please set status to active."),
      
      // vehicle miles is required and must be a number only
      body("total_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .isLength({ min:1 })
      .withMessage("Please provide the price"),
    ]
  };

  /* ******************************
 * CHECK ADDED TO CART DATA
 * 
 * ***************************** */
validate.checkCartData = async (req, res, next) => {
  const { account_id, inv_id, quantity, added_date, 
  status, total_price } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
        const detail_id = req.params.detailId
    const data = await inventoryModel.getInventoryByDetailId(detail_id)
    const grid = await Util.buildDetailCard(data)
    
    let nav = await Util.getNav()
    const titleString = data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model
    
    res.render("./inventory/detail", {
      title: titleString,
        nav,
        grid,
        errors: null,
      })

    return
  }
  next()
}

  module.exports = validate