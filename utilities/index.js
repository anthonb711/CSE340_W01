const jwt = require("jsonwebtoken");
require("dotenv").config();
const acctModel = require("../models/account-model");
const invModel = require("../models/inventory-model");
const cartModel = require("../models/cart-model");
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList = '<select name="classification_id" id="classificationList" required >'

    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory Detail view HTML
* ************************************ */
Util.buildDetailCard = async function(data){
  let grid
  const dataStringified = JSON.stringify(data)
  if(dataStringified.length > 0){
    const vehicle = data;
    grid = '<div id="detailContainer"> <img id="detailImg" src="'
      + vehicle.inv_image
      + '" alt="Image of '
      + vehicle.inv_make + ' '
      + vehicle.inv_model 
      + '">'
    grid += '<h2 id="details">' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details' + '</h2>';
    grid += '<div id="price" class="card"><span><strong>Price: $' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</strong></span></div>'
    grid += '<div id="descrip" class="lightCard"><span class="heavyLight"><strong>Description: </strong>'
         + vehicle.inv_description + '</span></div>'
    grid += '<div id="color" class="card"><span><strong>Color: </strong>'
         + vehicle.inv_color + '</span></div>'
    grid += '<div id="miles" class="lightCard"><span><strong>Miles: </strong>'
         + new Intl.NumberFormat ('en-US').format(vehicle.inv_miles) + '</span></div>'
    grid += '</div>'
    grid += `<div id="btnContainer"><form action="/cart/add-to-art/" method="post" 
            class="addToCartBtn"><button>Add to Cart</button></form></div>`
   
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicle could be found could be found.</p>'
  }
  return grid
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
  Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}


/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Check Account Type
 * ************************************ */
 Util.checkAcctType = (req, res, next) => {
  if(res.locals.loggedin && (res.locals.accountData.account_type === "Employee" ||
                             res.locals.accountData.account_type === "Admin")) {
    next(); 
  } else {
    req.flash("notice", "ACCESS DENIED");
    return res.redirect("/account/login");
 }
}

 /* ****************************************
 *  GET ACCOUNT DATA FOR USER LOGGED IN
 * ************************************ */
 Util.getLoggedInData = (req, res, next) => {

  if(res.locals.loggedin ) {
    return res.locals.accountData;
  } else {
    return false;
 }
}

 /* ****************************************
 *  MAKE USERNAME
 * ************************************ */
 Util.makeUsername = (accountData) => {
  if (accountData) {
    const userName = accountData.account_firstname.charAt(0) + accountData.account_lastname;
    return userName;
  } else {
    return false;
  }
}

/* **************************************
* BUILD THE CART LIST VIEW HTML
* ************************************ */
Util.buildCartList = async function(data){
 
  let cartList
  if(data.length > 0){
    cartList = '<ul id="cart-list">'
    data.forEach(cartItem => { 
      cartList += '<li class="cart-card divider">'
        + '<a href="#" class="cart-card__image"><img src="'
        + cartItem.inv_thumbnail
        + '" alt="Image of '
        + cartItem.inv_make + ' '
        + cartItem.inv_model + '"></a>'
      cartList += '<a class="cart-card__link" href="'
        + 'inv/detail/'
        + cartItem.inv_id + '">'
        + '<h2 class="cart-card__cardName">'
        + cartItem.inv_make + ' '
        + cartItem.inv_model + '</h2></a>'
      cartList += '<p class="cart-card__colorMiles">'
        + 'Color: '
        + cartItem.inv_color.charAt(0).toUpperCase()
        + cartItem.inv_color.slice(1)+ ' '
        +' Miles: '
        + new Intl.NumberFormat ('en-US').format(cartItem.inv_miles) + '</p>'
      cartList += '<p class="cart-card__quantity">QTY: '
        + cartItem.quantity + '</p>'
      cartList += '<p class="cart-card__price">'
        + '$' + new Intl.NumberFormat ('en-US').format(cartItem.total_price) 
        + '</p>'
      cartList += '<form id="loginForm" class="cart-card__removeBtn" action="/cart/' 
        + cartItem.cart_id + '"'+ 'method="post"><button id="removeFromCart" title="Remove item from cart" >'
        + '<svg id="removeIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="50px" height="50px"><g fill="#000000" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(3.2,3.2)"><path d="M37,6c-1.64497,0 -3,1.35503 -3,3v1h-9.52734c-1.89168,0 -3.62621,1.07202 -4.47266,2.76367l-1.11719,2.23633h-3.38281c-1.92119,0 -3.5,1.57881 -3.5,3.5c0,1.92119 1.57881,3.5 3.5,3.5h0.58008l3.61719,43.41602c0.21549,2.58219 2.3924,4.58398 4.98438,4.58398h30.63867c2.59122,0 4.76693,-2.0018 4.98242,-4.58398l3.61719,-43.41602h0.58008c1.92119,0 3.5,-1.57881 3.5,-3.5c0,-1.92119 -1.57881,-3.5 -3.5,-3.5h-3.38281l-1.11719,-2.23633c-0.84645,-1.69165 -2.58098,-2.76367 -4.47266,-2.76367h-9.52734v-1c0,-1.64497 -1.35503,-3 -3,-3zM37,8h6c0.56503,0 1,0.43497 1,1v1h-8v-1c0,-0.56503 0.43497,-1 1,-1zM24.47266,12h10.35938c0.10799,0.01785 0.21818,0.01785 0.32617,0h9.67383c0.10799,0.01785 0.21818,0.01785 0.32617,0h10.36914c1.13832,0 2.17404,0.63986 2.68359,1.6582l1.67187,3.3418h4.61719c0.84081,0 1.5,0.65919 1.5,1.5c0,0.84081 -0.65919,1.5 -1.5,1.5h-0.41406h-48.17188h-0.41406c-0.84081,0 -1.5,-0.65919 -1.5,-1.5c0,-0.84081 0.65919,-1.5 1.5,-1.5h4.61719l1.67187,-3.3418c0.50955,-1.01835 1.54527,-1.6582 2.68359,-1.6582zM24,15c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM28,15c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM32,15c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM36,15c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM40,15c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM44,15c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM48,15c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM52,15c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM56,15c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM18.08594,22h43.82812l-3.60547,43.24805c-0.13051,1.56381 -1.4195,2.75195 -2.98828,2.75195h-30.63867c-1.57003,0 -2.85973,-1.18814 -2.99023,-2.75195zM54.76953,26.02734l-0.6875,0.57617l-0.08008,0.3418l-0.00586,0.09961l0.35742,0.82227l0.87305,0.20508l0.68555,-0.57617l0.08008,-0.3418l0.00586,-0.09961l-0.35742,-0.82227zM39.7168,26.04102l-0.6543,0.61133l-0.0625,0.34766v0.09961l0.40234,0.80078l0.88086,0.1582l0.6543,-0.61133l0.0625,-0.34766v-0.09961l-0.40234,-0.80078zM24.66602,26.05859l-0.62109,0.64648l-0.04297,0.34961l0.00586,0.09961l0.44336,0.77734l0.88867,0.11133l0.62109,-0.64648l0.04297,-0.35156l-0.00586,-0.09961l-0.44336,-0.77734zM54.54688,30.12109l-0.68555,0.57617l-0.08203,0.34375l-0.00391,0.09961l0.35742,0.82031l0.87109,0.20508l0.6875,-0.57422l0.08008,-0.34375l0.00586,-0.09961l-0.35742,-0.82227zM39.7168,30.14063l-0.6543,0.61328l-0.0625,0.3457v0.09961l0.40234,0.80273l0.88086,0.15625l0.6543,-0.61133l0.0625,-0.34766v-0.09961l-0.40234,-0.80078zM24.88672,30.15234l-0.62109,0.64648l-0.04297,0.34961l0.00586,0.09961l0.44336,0.77734l0.88867,0.11133l0.62109,-0.64648l0.04297,-0.34961l-0.00391,-0.09961l-0.44531,-0.7793zM54.32617,34.21484l-0.6875,0.57617l-0.08008,0.34375l-0.00586,0.09961l0.35742,0.82031l0.87305,0.20703l0.6875,-0.57617l0.08008,-0.34375l0.00586,-0.09961l-0.35742,-0.82227zM39.7168,34.24023l-0.6543,0.61328l-0.0625,0.3457v0.10156l0.40234,0.80078l0.88086,0.1582l0.6543,-0.61328l0.0625,-0.3457v-0.10156l-0.40234,-0.80078zM25.10742,34.24609l-0.61914,0.64648l-0.04492,0.34961l0.00586,0.09961l0.44336,0.77734l0.89063,0.11133l0.61914,-0.64648l0.04492,-0.34961l-0.00586,-0.09961l-0.44531,-0.7793zM54.10547,38.30859l-0.6875,0.57617l-0.08008,0.34375l-0.00586,0.09961l0.35742,0.82227l0.87305,0.20508l0.68555,-0.57617l0.08203,-0.34375l0.00391,-0.09961l-0.35742,-0.82227zM25.32813,38.33984l-0.61914,0.64648l-0.04297,0.34961l0.00391,0.09961l0.44531,0.7793l0.88867,0.10938l0.62109,-0.64648l0.04297,-0.34961l-0.00586,-0.09961l-0.44336,-0.7793zM39.7168,38.3418l-0.6543,0.61133l-0.0625,0.34766v0.09961l0.40234,0.80078l0.88086,0.1582l0.6543,-0.61328l0.0625,-0.3457v-0.09961l-0.40234,-0.80273zM53.88281,42.40234l-0.68555,0.57617l-0.08008,0.34375l-0.00586,0.09961l0.35742,0.82227l0.87109,0.20508l0.6875,-0.57617l0.08008,-0.34375l0.00586,-0.09961l-0.35742,-0.82031zM25.55078,42.43359l-0.62109,0.64648l-0.04297,0.34961l0.00586,0.09961l0.44336,0.7793l0.88867,0.10938l0.62109,-0.64648l0.04297,-0.34961l-0.00586,-0.09961l-0.44336,-0.7793zM39.7168,42.44141l-0.6543,0.61133l-0.0625,0.34766v0.09961l0.40234,0.80078l0.88086,0.1582l0.6543,-0.61133l0.0625,-0.34766v-0.09961l-0.40234,-0.80078zM53.66211,46.49805l-0.68555,0.57422l-0.08203,0.34375l-0.00586,0.09961l0.35938,0.82227l0.87109,0.20508l0.6875,-0.57617l0.08008,-0.34375l0.00586,-0.09961l-0.35742,-0.82031zM25.77148,46.52734l-0.62109,0.64648l-0.04297,0.34961l0.00586,0.09961l0.44336,0.7793l0.89063,0.10938l0.61914,-0.64648l0.04492,-0.34961l-0.00586,-0.09961l-0.44531,-0.77734zM39.7168,46.54102l-0.6543,0.61133l-0.0625,0.34766v0.09961l0.40234,0.80078l0.88086,0.1582l0.6543,-0.61133l0.0625,-0.34766v-0.09961l-0.40234,-0.80078zM53.44141,50.5918l-0.6875,0.57617l-0.08008,0.3418l-0.00586,0.09961l0.35742,0.82227l0.87305,0.20508l0.68555,-0.57617l0.08203,-0.3418l0.00391,-0.10156l-0.35742,-0.82031zM25.99219,50.62109l-0.61914,0.64648l-0.04297,0.34961l0.00391,0.10156l0.44531,0.77734l0.88867,0.10938l0.62109,-0.64648l0.04297,-0.34961l-0.00586,-0.09961l-0.44336,-0.77734zM39.7168,50.64063l-0.6543,0.61328l-0.0625,0.3457v0.09961l0.40234,0.80273l0.88086,0.15625l0.6543,-0.61133l0.0625,-0.34766v-0.09961l-0.40234,-0.80078zM53.21875,54.68555l-0.68555,0.57617l-0.08008,0.3418l-0.00586,0.09961l0.35742,0.82227l0.87305,0.20508l0.68555,-0.57617l0.08008,-0.3418l0.00586,-0.09961l-0.35742,-0.82227zM26.21484,54.7168l-0.62109,0.64648l-0.04297,0.34961l0.00586,0.09961l0.44336,0.77734l0.88867,0.11133l0.62109,-0.64648l0.04297,-0.35156l-0.00586,-0.09961l-0.44336,-0.77734zM39.7168,54.74023l-0.6543,0.61328l-0.0625,0.3457v0.10156l0.40234,0.80078l0.88086,0.1582l0.6543,-0.61328l0.0625,-0.3457v-0.10156l-0.40234,-0.80078zM52.99805,58.7793l-0.68555,0.57617l-0.08203,0.3418l-0.00391,0.10156l0.35742,0.82031l0.87109,0.20508l0.6875,-0.57422l0.08008,-0.34375l0.00586,-0.09961l-0.35742,-0.82227zM26.43555,58.81055l-0.62109,0.64648l-0.04297,0.34961l0.00586,0.09961l0.44336,0.77734l0.89063,0.11133l0.61914,-0.64648l0.04297,-0.34961l-0.00391,-0.10156l-0.44531,-0.77734zM39.7168,58.8418l-0.6543,0.61133l-0.0625,0.34766v0.09961l0.40234,0.80078l0.88086,0.1582l0.6543,-0.61328l0.0625,-0.3457v-0.09961l-0.40234,-0.80273zM52.77734,62.87305l-0.6875,0.57617l-0.08008,0.34375l-0.00586,0.09961l0.35742,0.82031l0.87305,0.20703l0.68555,-0.57617l0.08203,-0.34375l0.00586,-0.09961l-0.35937,-0.82227zM26.65625,62.9043l-0.61914,0.64648l-0.04492,0.34961l0.00586,0.09961l0.44531,0.77734l0.88867,0.11133l0.62109,-0.64648l0.04297,-0.34961l-0.00586,-0.09961l-0.44336,-0.7793zM39.7168,62.94141l-0.6543,0.61133l-0.0625,0.34766v0.09961l0.40234,0.80078l0.88086,0.1582l0.6543,-0.61133l0.0625,-0.34766v-0.09961l-0.40234,-0.80078z">'
        + '</path></g></g></svg>'
        + ' </button></form></li>'
    })
    cartList += '</ul>'
  } else {
    cartList = '<p><h2>YOUR CART IS EMPTY</h2></p>';

  }
  return cartList;
}


/* **************************************
* BUILD THE CLIENT LIST FOR CART MANAGEMENT
* ************************************ */
Util.buildClientList = async function (account_id = null) {
    let data = await acctModel.getClients();
    
    let clientList = '<select name="client" id="clientList" required >'

    clientList += "<option value=''>Choose a Client</option>"
    data.rows.forEach((row) => {
      clientList += '<option value="' + row.account_id + '"'
      if (
        account_id != null &&
        row.account_id == account_id
      ) {
        clientList += " selected "
      }
      clientList += ">" + row.account_firstname + ' ' + row.account_lastname + ' | ID: ' + row.account_id + "</option>"
    })
    clientList += "</select>"
    return clientList
  }

module.exports = Util

