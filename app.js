const express = require("express");
const dotenv = require("dotenv");
const {urlencoded} = require("express");

/* Reading global variables from config file */
dotenv.config();
const PORT = process.env.PORT;

/*
 *
 * Express setup
 *
*/

app = express();

//turn on serving static files (required for delivering css to client)
app.use(express.static("public"));
//configure template engine
app.set("views", "views");
app.set("view engine", "pug");

app.get("/", function(request, response) {
    response.render("Login");
});
app.get("/dashboard", function(request, response) {
    response.render("Dashboard");
});
app.get("/stations/1", function(request, response) {
    response.render("Station.pug");
});

app.listen(PORT, function() {
  console.log(`Weathertop running and listening on port ${PORT}`);
});
