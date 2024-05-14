/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const session = require("express-session")
const pool = require('./database/')
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const Util = require("./utilities/index")
const app = express();
const static = require("./routes/static");
const { getNav } = require("./utilities");



/* *******************************
 * Middleware
 ****************************** */
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Message Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next();
});

/* ***********************
 * View Engine and Templates
 *************************/
app
    .set("view engine", "ejs")
    .use(expressLayouts)
    .set("layout", "./layouts/layouts"); // not at views root


/* ***********************
 * Routes
 *************************/
app.use(static);
// Index Route
app.get("/", Util.handleErrors(baseController.buildHome));

app.get('/favicon.ico', (req, res) => res.status(204).end());
// File Not Found Route - must be last route in list

// Inventory Routes
app.use("/inv", inventoryRoute);

// Account Routes
app.use("/account", accountRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'You look lost.'})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await Util.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404) {message = err.message} else {message = "Oh no! There was a crash. Maybe try a different route?"}

  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 4000;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
