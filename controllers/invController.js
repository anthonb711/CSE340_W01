const { configDotenv } = require("dotenv");
const inventoryModel = require("../models/inventory-model");
const Util = require("../utilities/");

const invCont = {};

/* *******************************
 * BUILD BY CLASSIFICATION ID
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
 * BUILD BY DETAIL ID
 ****************************** */
invCont.buildByDetailId = async function (req, res, next) {
  try {
    const detail_id = req.params.detailId
    const data = await invModel.getInventoryByDetailId(detail_id)
    const grid = await Util.buildDetailCard(data)
    let nav = await Util.getNav()
    const titleString = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model

      res.render("./inventory/detail", {
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
 * MAKE500
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
  
  const classificationSelect = await Util.buildClassificationList();
  res.render("./inventory/management.ejs", {
    title: "Inventory Management",
    nav,
    errors: null,
    classificationSelect,
  })

  }catch (error) {
  console.error(error);
  error.status = 500;
  next(error);
  }
}

/* *******************************
 * BUILD CLASSIFICATION
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
*  ADD CLASSIFICATION
* *************************************** */
 invCont.addClassification = async function(req, res) {
  let nav = await Util.getNav()
  const { classification_name } = req.body

  const addClassResult = await inventoryModel.addClassification( classification_name )
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
 * BUILD ADD INVENTORY
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
* ADD INVENTORY
* *************************************** */
 invCont.addInventory = async function(req, res) {
  let nav = await Util.getNav()

  const { inv_make, inv_model, inv_year,inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, 
  classification_id } = req.body

  const addInvResult = await inventoryModel.addInventory( 
          inv_make, inv_model, inv_year,inv_description, inv_image,
          inv_thumbnail, inv_price, inv_miles, inv_color, 
          classification_id )
const classificationSelect = await Util.buildClassificationList();
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
       classificationSelect,
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

/* *******************************
 * GET INVENTORY JSON
 *
 * Return Inventory by Classification As JSON
 ****************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classificationId)
  const invData = await inventoryModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* *******************************
 * BUILD EDIT INVENTORY VIEW
 ****************************** */
invCont.editInvData = async (req, res, next) => {
  const inv_id = parseInt(req.params.detailId);
  try {
    let nav = await Util.getNav();
    const result = await inventoryModel.getInventoryByDetailId(inv_id)
    let categorySelect = await Util.buildClassificationList(result.classification_id)
    const invName = `${result.inv_make} ${result.inv_model}`;
    
    res.render("./inventory/edit-inventory", {
      title: "Edit " + invName,
      nav,
      categorySelect: categorySelect,
      errors: null,
      inv_id: result.inv_id,
      inv_make: result.inv_make,
      inv_model: result.inv_model,
      inv_year: result.inv_year,
      inv_description: result.inv_description,
      inv_image: result.inv_image,
      inv_thumbnail: result.inv_thumbnail,
      inv_price: result.inv_price,
      inv_miles: result.inv_miles,
      inv_color: result.inv_color,
     classification_id: result.classification_id
    })
  } catch (error) {
    console.error(error);
    error.status = 500;
    next(error);
  }
}

/* *******************************
 * UPDATE INVENTORY POST
 ****************************** */
invCont.updateInv = async function (req, res, next) {
  let nav = await Util.getNav()
  const {
    inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail,
    inv_price, inv_year, inv_miles, inv_color, classification_id, } = req.body
  
    const updateResult = await inventoryModel.updateInv(
      inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail,
      inv_price, inv_year, inv_miles, inv_color, classification_id)

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await Util.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* *******************************
 * BUILD DELETE INVENTORY VIEW
 ****************************** */
invCont.buildDeleteInv = async (req, res, next) => {
  const inv_id = parseInt(req.params.invId);
  try {
    let nav = await Util.getNav();
    const invData = await inventoryModel.getInventoryByDetailId(inv_id)
    let categorySelect = await Util.buildClassificationList(invData.classification_id)
    const invName = `${invData.inv_make} ${invData.inv_model}`;
    
    res.render("./inventory/delete-confirm", {
      title: "Delete " + invName,
      nav,
      categorySelect: categorySelect,
      errors:           null,
      inv_id:           invData.inv_id,
      inv_make:         invData.inv_make,
      inv_model:        invData.inv_model,
      inv_year:         invData.inv_year,
      inv_price:        invData.inv_price,
    })
  } catch (error) {
    console.error(error);
    error.status = 500;
    next(error);
  }
}

/* *******************************
 * DELETE INVENTORY
 ****************************** */
invCont.deleteInv = async function (req, res, next) {
  let nav = await Util.getNav()
  const { inv_id } = req.body
  const itemResult = await inventoryModel.getInventoryByDetailId(inv_id);
  const deleteResult = await inventoryModel.removeInv(inv_id);
  //const itemName = `${itemResult.inv_make}` +  `${itemResult.inv_model}`
  //const itemName = `${itemResult.inv_make} ${itemResult.inv_model}`
  const itemName = `${itemResult.inv_make} ${itemResult.inv_model}`;

  if (deleteResult) {
    req.flash("notice", `<h2 class="flashMsg">The inventory ${itemName} was successfully deleted.<h2>`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", `<h2 class="flashMsg">Sorry, the delete failed.</h2>`)
    res.status(501).render("inventory/delete-confirmation", {
    title: "Delete Item" + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


module.exports = invCont;
