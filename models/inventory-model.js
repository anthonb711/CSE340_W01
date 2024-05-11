const pool = require ("../database/");

/* *******************************
 * Get all calssification data
 ****************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
};

/* *******************************
 * Get all inventory items and classification_name by classification_id
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
  console.error("getclassificatiosbyid error" + error)
  };
};

/* *******************************
 * Get inventory detail on vehicle by detail_id
 ****************************** */
async function getInventoryByDetailId(detail_id) {
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
module.exports = { 
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByDetailId
 };

