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

app.get("/", function (request, response) {
    response.render("Login");
});
app.get("/dashboard", function (request, response) {
    response.render("Dashboard");
});
app.get("/stations/1", function (request, response) {
    let data = [{wetter: "800", temp: "20.32", wind: "0.89", pressure: "1016"},
        {wetter: "800", temp: "20.32", wind: "0.89", pressure: "1016"},
        {wetter: "400", temp: "32.5", wind: "15", pressure: "90"},
        {wetter: "400", temp: "32.5", wind: "15", pressure: "90"},
        {wetter: "800", temp: "11.16", wind: "2.23", pressure: "1024"},
        {wetter: "800", temp: "11.16", wind: "2.23", pressure: "1024"},
        {wetter: "800", temp: "-6.14", wind: "1.15", pressure: "1027"}]
    response.render("Station.pug", {data: data});
});

app.listen(PORT, function () {
    console.log(`Weathertop running and listening on port ${PORT}`);
});
