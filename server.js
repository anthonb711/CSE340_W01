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
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const Util = require("./utilities/index")
const app = express();
const static = require("./routes/static");
const { getNav } = require("./utilities");


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
//app.get("/inv", Util.handleErrors(inventoryRoute.make500));

// rid of nusance 404 error
app.get('/favicon.ico', (req, res) => res.status(204).end());

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
