const Util = require("../utilities/");
const accountModel = require("../models/account-model")


const buildLogin = async (req, res, next) => {
  try {
    let nav = await Util.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
    })
  }catch (error) {
  console.error(error);
  error.status = 500;
  error.message = "SERVER ERROR"
  next(error);
  }
};

const builRegistration = async (req, res, next) => {
    try {
    let nav = await Util.getNav();
    res.render("account/registration", {
      title: "Register",
      nav,
    })
  }catch (error) {
  console.error(error);
  error.status = 500;
  error.message = "SERVER ERROR"
  next(error);
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await Util.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

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
    })
  }
}

module.exports = { 
  buildLogin,
  builRegistration,
  registerAccount
 
 }