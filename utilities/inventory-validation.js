const Util = require (".");
  const { body, validationResult } = require("express-validator");
  const inventoryModel = require("../models/inventory-model");
  const validate = {}

  /*  **********************************
  *  Add New Classificaiton Rules
  * ********************************* */
  validate.classificationRules = () => {
    return [
      // valid classification name is required and cannot already exist in the DB
      body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isAlphanumeric()
      .withMessage("A valid classification name is required.")
      .custom(async (classification_name) => {
        const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification exists. Please try another.")
        }

      })

    ]
  }

  /* ******************************
 * Check data and return errors for the Add Classificaion View
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await Util.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Manage Classifications",
      nav,
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate