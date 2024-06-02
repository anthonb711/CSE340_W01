const pool = require ("../database/");

/* *******************************
 * GET ALL CART DATA
 * Should only be available to employee & admin account types
 ****************************** */
async function getAllCarts() {
  return await pool.query("SELECT * FROM public.cart")
};

/* *******************************
 * GET CART BY ACCOUNT ID
 ****************************** */
async function getCartByAcctId(account_id) {
try {
  const data = await pool.query(
    `SELECT * FROM public.cart AS c
    JOIN public.inventory AS i
      ON c.inv_id = i.inv_id
    WHERE c.account_id = $1`,
  [account_id]
  )
  return data.rows
} catch(error) {
  console.error("cart/model get cart by account id error" + error)
  };
};

/* *******************************
 * GET TOTAL PRICE BY ACCOUNT ID
 ****************************** */
async function getCartTotalByAccId(account_id) {
try {
  const data = await pool.query(
    `SELECT  SUM(total_price) AS total_sum
    FROM public.cart
    WHERE account_id = $1`,
  [account_id]
  )
  return data.rows[0]
} catch(error) {
  console.error("cart/model get cart total by account ID error" + error)
  };
};

/* *******************************
 * GET CART BY INVENTORY ID
 ****************************** */
async function getCartByInvId(inv_id) {
try {
  const data = await pool.query(
    `SELECT * FROM public.cart AS c
    JOIN public.inventory AS i
    ON c.inv_id = i.inv_id
    WHERE i.inv_id = $1`,
  [account_id]
  )
  return data.rows
} catch(error) {
  console.error("cart/model get cart by inventory id error" + error)
  };
};

/* *******************************
 * ADD INVENTORY TO CART
 * //TODO: check if inv_id exisits in a cart
 ****************************** */
async function addInventoryToCart(account_id, inv_id, quantity, added_date, 
  status, total_price ) {
  try {
    const sql = 
    `INSERT INTO inventory ( account_id, inv_id, quantity, 
        added_date, status, total_price) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`

    return await pool.query(sql, [account_id, inv_id, quantity, added_date, 
  status, total_price])

  }catch (error) {
  console.error();
  return error.message
  }
}

/* *******************************
 * UPDATE INVENTORY CART STATUS
 ****************************** */
async function updateStatusByInvId(status, inv_id) {
  try {
    const sql =
      "UPDATE public.cart SET status = $1, WHERE inv_id = $2 RETURNING *"
    const data = await pool.query(sql, [ status, inv_id ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* *******************************
 * REMOVE CART ENTITY
 ****************************** */
async function removeCartEntity(cart_id) {
  try {
    const sql = "DELETE FROM public.cart WHERE cart_id = $1";
    const data = await pool.query(sql, [cart_id])
  return data
  } catch (error) {
    new Error("Delete Cart Entity Error");
  }
}

/* *******************************
 * DELETE USER CART
 ****************************** */
async function deleteUserCart(account_id) {
  try {
    const sql = "DELETE FROM public.cart WHERE account_id = $1";
    const data = await pool.query(sql, [account_id])
  return data
  } catch (error) {
    new Error("Delete Cart User Error");
  }
}


module.exports = {
  getAllCarts,
  getCartByAcctId,
  getCartByInvId,
  getCartTotalByAccId,
  addInventoryToCart,
  updateStatusByInvId,
  removeCartEntity,
  deleteUserCart
}

