const { configDotenv } = require("dotenv");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* *******************************
 * Build inventory by classification view
 ****************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name

  res.render("./inventory/classification.ejs", {
    title: className + " vehicles",
    nav,
    grid,
  })

  }catch (error) {
  error.message ="Vehicles by category is not available at this time"
  error.status = 500;
  next(error);
  }
}
/* *******************************
 * Build inventory by inventory detail view
 ****************************** */
invCont.buildByDetailId = async function (req, res, next) {
try {
  const detail_id = req.params.detailId
  const data = await invModel.getInventoryByDetailId(detail_id)
  const grid = await utilities.buildDetailCard(data)
  let nav = await utilities.getNav()
  const titleString = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model

    res.render("./inventory/detail.ejs", {
      title: titleString,
      nav,
      grid,
    })
}catch (error) {
  error.status = 500;
  error.message ="Vehicle detail is not avialable at this time"
  next(error);
}


  const detail_id = req.params.detailId
  const data = await invModel.getInventoryByDetailId(detail_id)
  const grid = await utilities.buildDetailCard(data)
  let nav = await utilities.getNav()
  const titleString = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model

  res.render("./inventory/detail.ejs", {
    title: titleString,
    nav,
    grid,
  })
}

/* *******************************
 * Build inventory by classification view
 ****************************** */
invCont.make500 = function (req, res, next) {
  console.log("THIS IS FROM MAKE 500");
  const make500Er = new Error();
  make500Er.status = 500;
  next(make500Er)

}
module.exports = invCont;
