const Util = require("../utilities/");


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



module.exports = { buildLogin }