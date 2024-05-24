const pool = require ("../database/");

/* *******************************
 * Get all calssification data
 ****************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
};

/* *******************************
 * GET INVENTORY BY CLASS ID
 ****************************** */
async function getInventoryByClassificationId(classification_id) {
try {
  const data = await pool.query(
    `SELECT * FROM public.inventory AS i
    JOIN public.classification AS c
    ON i.classification_id = c.classification_id
    WHERE i.classification_id = $1`,
  [classification_id]
  )
  return data.rows
} catch(error) {
  console.error("inv/model get Classifications By Id error" + error)
  };
};

/* *******************************
 * Get inventory detail on vehicle by detail_id
 ****************************** */
async function getInventoryByDetailId(detail_id) {
  console.log(detail_id)
try {
  const data = await pool.query(
    `SELECT * FROM public.inventory AS i
    WHERE i.inv_id = $1`,
  [detail_id]
  )
 
  return data.rows
} catch(error) {
  console.error("getdetailsbyid error" + error)
  };
};
/* *******************************
 * Add new classification to DB
 ****************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])

  }catch (error) {
  console.error();
  return error.message
  }
}

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount

  } catch (error) {
    return error.message
  }
}

/* *******************************
 * Add new inventory to DB
 ****************************** */
async function addInventory(inv_make, inv_model, inv_year,inv_description, 
  inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, 
  classification_id ) {
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"

    return await pool.query(sql, [inv_make, inv_model, inv_year,inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, 
      classification_id])

  }catch (error) {
  console.error();
  return error.message
  }
}

module.exports = { 
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByDetailId,
  addClassification,
  checkExistingClassification,
  addInventory
 };

