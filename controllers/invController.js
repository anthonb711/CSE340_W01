const { configDotenv } = require("dotenv");
const inventoryModel = require("../models/inventory-model");
const Util = require("../utilities/");

const invCont = {};

/* *******************************
 * Build inventory by classification view
 ****************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
  const classification_id = req.params.classificationId
  const data = await inventoryModel.getInventoryByClassificationId(classification_id)
  const grid = await Util.buildClassificationGrid(data)
  let nav = await Util.getNav()
  const className = data[0].classification_name

  res.render("./inventory/classification.ejs", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })

  }catch (error) {
  error.message = "Not available at this time."
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
    const grid = await Util.buildDetailCard(data)
    let nav = await Util.getNav()
    const titleString = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model

      res.render("./inventory/detail.ejs", {
      title: titleString,
        nav,
       grid,
       errors: null,
      })
    }catch (error) {
      console.log(error);
      error.status = 500;
      error.message = "Not available at this time."
      next(error);
    }
}

/* *******************************
 * Build intentional error link
 ****************************** */
invCont.make500 = function (req, res, next) {
  const make500Er = new Error();
  make500Er.status = 500;
  make500Er.message = "Houston we have a problem";
  next(make500Er)

};

/* *******************************
 * Build inventory management view
 ****************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
  let nav = await Util.getNav()
  
  res.render("./inventory/management.ejs", {
    title: "Inventory Management",
    nav,
    errors: null,
  })

  }catch (error) {
  console.error(error);
  error.status = 500;
  next(error);
  }
}

/* *******************************
 * Build Add Classification view
 ****************************** */

invCont.buildAddClassification = async function (req, res, next) {
    try {
  let nav = await Util.getNav()
  res.render("inventory/add-classification", {
    title: "Manage Classifications",
    nav,
    errors: null,
  })

  }catch (error) {
  console.error(error);
  error.status = 500;
  next(error);
  }
}

/* ****************************************
*  Process Add Classification
* *************************************** */
 invCont.addClassification = async function(req, res) {
  let nav = await Util.getNav()
  const { classification_name } = req.body

  const addClassResult = await inventoryModel.addClassification( classification_name )
  console.log(addClassResult)
  if (addClassResult) {
    req.flash(
      "notice",
      `Congratulations, "${classification_name}" has been added to the classifications`
    )
      let nav = await Util.getNav();
    res.status(201).render("./inventory/management.ejs", {
      title: "Manage Classifications",
       nav,
       errors: null,
     })
  } else {
    req.flash("notice", `Sorry, "${classification_name}" could not be created.`)
    res.status(501).render("inventory/add-classification", {
      title: "Manage Classifications",
      nav,
      errors: null,
    })
  }
}

/* *******************************
 * Build Add Inventory view
 ****************************** */
invCont.buildAddInventory = async function (req, res, next) {
    try {
  let nav = await Util.getNav()
    let categorySelect = await Util.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Manage Inventory",
    nav,
    categorySelect,
    errors: null,
  })

  }catch (error) {
  console.error(error);
  error.status = 500;
  next(error);
  }
}

/* ****************************************
*  Process Add Inventory
* *************************************** */
 invCont.addInventory = async function(req, res) {
  let nav = await Util.getNav()

  const { inv_make, inv_model, inv_year,inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, 
  classification_id } = req.body

  const addInvResult = await inventoryModel.addInventory( 
          inv_make, inv_model, inv_year,inv_description, inv_image,
          inv_thumbnail, inv_price, inv_miles, inv_color, 
          classification_id )

  console.log(addInvResult)
  if (addInvResult) {
    req.flash(
      "notice",
      `Congratulations, ${inv_year} ${inv_make} ${inv_model} has been added to
      inventory!`
    )
    res.status(201).render("./inventory/management.ejs", {
      title: "Manage Inventory",
       nav,
       errors: null,
     })
  } else {
    req.flash("notice", `Sorry, ${inv_year} ${inv_make} ${inv_model} could not
    be added to inventory.`)
    res.status(501).render("inventory/add-inventory", {
      title: "Manage Inventory",
      nav,
      errors: null,
    })
  }
}

module.exports = invCont;
