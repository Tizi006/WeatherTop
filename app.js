const express = require("express");
const dotenv = require("dotenv");
const {urlencoded} = require("express");
const pg = require("pg");
const {data} = require("express-session/session/cookie");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

/* Reading global variables from config file */
dotenv.config();
const PORT = process.env.PORT;
//configure connection and connect to client
pg.defaults.ssl = true;
const dbClient = new pg.Client(process.env.DB_CON_STRING);
dbClient.connect();
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
    dbClient.query("select * from stations s join weatherdata w on s.id =w.station_id WHERE w.id IN (SELECT MIN(id) FROM weatherdata GROUP BY station_id);", function (dbError, dbResponse) {

            response.render("Dashboard",{data:dbResponse.rows});
    })

});
app.get("/stations/1", function (request, response) {
    dbClient.query("select * from stations s join weatherdata w on s.id =w.station_id where station_id =1;", function (dbError, dbResponse) {
        response.render("Station",{data:dbResponse.rows});
    })
});

app.listen(PORT, function () {
    console.log(`Weathertop running and listening on port ${PORT}`);
});


