require("dotenv").config();
const jwt = require("jsonwebtoken")
const Util = require("../utilities/");
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs");

/* *******************************
 *  BUILD LOGIN
 ****************************** */
const buildLogin = async (req, res, next) => {
  try {
    let nav = await Util.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }catch (error) {
  console.error(error);
  error.status = 500;
  error.message = "SERVER ERROR"
  next(error);
  }
};

/* *******************************
 * BUILD REGISTRATION
 ****************************** */
const builRegistration = async (req, res, next) => {
    try {
    let nav = await Util.getNav();
    res.render("account/registration", {
      title: "Register",
      nav,
      errors: null,
    })
  }catch (error) {
  console.error(error);
  error.status = 500;
  error.message = "SERVER ERROR"
  next(error);
  }
}

/* *******************************
 * BUILD ACCT MANAGMENT
 ****************************** */
const buildAcctManagement = async (req, res, next) => {
  try {
    let nav = await Util.getNav();
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    })

  } catch (error) {
  console.error(error);
  error.status = 500;
  error.message = "SERVER ERROR"
  next(error);
  }
}

/* ****************************************
*  PROCESS REGISTRATION
* *************************************** */
async function registerAccount(req, res) {
  let nav = await Util.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )
console.log(regResult)
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  PROCESS LOGIN ATTEMPT
* *************************************** */
async function acctLogin (req, res) {
  let nav = await Util.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAcctByEmail(account_email)
  if(!accountData) { // check for email if not found then... 
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
   })
    return
  } // Email was found try... 
        
  try {
      const result = await bcrypt.compare(account_password, accountData.account_password)
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
    return res.redirect("/account/")
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}






module.exports = { 
  buildLogin,
  builRegistration,
  registerAccount,
  acctLogin,
  buildAcctManagement
 
 }