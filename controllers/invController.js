const { configDotenv } = require("dotenv");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* *******************************
 * Build inventory by classification view
 ****************************** */
invCont.buildByClassificationId = async function (req, res, next) {
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
}
/* *******************************
 * Build inventory by inventory detail view
 ****************************** */
invCont.buildByDetailId = async function (req, res, next) {

  const detail_id = req.params.detailId
  const data = await invModel.getInventoryByDetailId(detail_id)
  console.log(`DETAIL DATA FROM DB" ${data}`);
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
invCont.make500 = function (err, req, res, next) {
 throw new Error('Throw makes it go boom!');
}
  // const forcedError= req.params.errorId
  // try { 
  //   const data = await invModel.getInventoryByDetail(forcedError)
  //   const grid = await utilities.buildClassificationGrid(data)
  //   let nav = await utilities.getNav()
  //   const errorName = data[0].error_name
  //   }catch (error) {
  // console.error(err.stack);
  // res.status(500)
  // }
  // res.render("./inventory/.ejs", {
  //   title: className + " vehicles",
  //   nav,
  //   grid,
  // })
//}




module.exports = invCont;