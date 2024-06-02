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
 *  BUILD LOGOUT
 ****************************** */
const buildLogout = async (req, res, next) => {
  try {
    res.clearCookie("jwt");
    res.redirect("/")
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
    const acctId = res.locals.accountData.account_id; 
    const welcomeBasic = res.locals.accountData.account_firstname;

    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      welcomeBasic,
      acctId
    })

  } catch (error) {
  console.error(error);
  error.status = 500;
  error.message = "SERVER ERROR"
  next(error);
  }
}
/* *******************************
 * BUILD UPDATE INFO VIEW
 ****************************** */
async function buildUpdateInfo (req, res, next) {
       const account_id = parseInt(req.params.acctId);
   try {
      let nav = await Util.getNav();
      const acctInfo = await accountModel.getAcctById(account_id);

      res.render("account/updateInfo", {
         title: "Update Account Information",
         nav,
         errors:  null,
         account_id,
         welcomeBasic: acctInfo.account_firstname,
         account_firstname: acctInfo.account_firstname,
         account_lastname: acctInfo.account_lastname,
         account_email: acctInfo.account_email
       })
   } catch (errors) {
     req.flash("notice", errors)
   }
}

/* *******************************
 * PROCESS UPDATE INFO - POST ROUTE
 ****************************** */
async function updateInfo (req, res, next) {
  let nav = await Util.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  
    const updateResult = await accountModel.updateInfo(
      account_firstname, account_lastname, account_email, account_id)

  if (updateResult) {
    const accountName = updateResult.account_firstname+ " " + 
      updateResult.account_lastname;

const flashMsg = `
  The account details for ${accountName} were successfully updated. <h3>Updated Account Details</h3>
  <ul id="acctDetails">
    <li>First Name: ${updateResult.account_firstname}</li>
    <li>Last Name: ${updateResult.account_last}</li>
    <li>Email Address: ${updateResult.account_email}</li>
  </ul>`;


    req.flash("notice", flashMsg)
    res.redirect("/account/")
  } else {
    const accountName = `${account_firstname} ${account_lastname}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/updateInfo", {
    title: "Update Info for " + accountName,
    nav,
    errors: null,
    welcomeBasic: account_firstname,
    account_firstname,
    account_lastname,
    account_email,
    account_id
    
    })
  }
}

/* *******************************
 * PROCESS UPDATE PASSWORD - POST ROUTE
 ****************************** */
async function updatePwd (req, res, next) {
  let nav = await Util.getNav()
  const { account_firstname, account_lastname, account_email, account_password, account_id } = req.body

    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password change.')
    res.status(500).render("account/updateInfo", {
      title: "Update Account Info",
      nav,
      errors: null,
    })
  }
    // pass the hashed password into model to be updated in DB
    const updateResult = await accountModel.updatePwd(hashedPassword, account_id)


  if (updateResult) {
    const accountName = `${updateResult.account_firstname} 
      ${updateResult.account_lastname}`;

      const flashMsg = `
      The password for ${accountName} was successfully updated.
      <h3>Account Details</h3>
      <ul id="acctDetails">
        <li>First Name: ${updateResult.account_firstname} </li>
        <li>Last Name: ${updateResult.account_last} </li>
        <li>Email Address: ${updateResult.account_email} </li>
        </ul>`;

    req.flash("notice", flashMsg)
    res.status(202).render("account/management", {
    title: "Update Info for " + accountName,
    nav,
    errors: null,
    welcomeBasic: account_firstname,
    account_firstname,
    account_lastname,
    account_email,
    account_id,
    acctId: account_id,
    })

    } else {
    const accountName = `${account_firstname} ${account_lastname}`
    req.flash("notice", "Sorry, the update failed.")
    res.render("account/updateInfo/", {
    title: "Update Info for " + accountName,
    nav,
    errors: null,
    welcomeBasic: account_firstname,
    account_firstname,
    account_lastname,
    account_email,
    account_id,
    })
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
        //await bcrypt.compare(account_password, accountData.account_password)
  try {
      const result = await bcrypt.compare(account_password, accountData.account_password)
    if (result) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
    return res.redirect("/account/")
    } else {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
   })
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}






module.exports = { 
  buildLogin,
  buildLogout,
  builRegistration,
  registerAccount,
  acctLogin,
  buildAcctManagement,
  buildUpdateInfo,
  updateInfo,
  updatePwd
 }