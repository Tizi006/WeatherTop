const express = require("express");
const dotenv = require("dotenv");
const {urlencoded} = require("express");
const pg = require("pg");
const {data} = require("express-session/session/cookie");
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
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
app.get("/dashboard", renderDashboard)
app.post("/dashboard", urlencodedParser, function (request, response) {
    const titel = request.params.titel;
    const lat = request.params.lat;
    const lon = request.params.lon;
    //  if(titel!=null&&lat!=null&&lon!=null){
    dbClient.query("insert into stations (name, lon, lat,user_id) values ('bob',49.99,40.00,1)")
    //  }
    renderDashboard(request, response);
});

function renderDashboard(request, response) {
    let stations, values;

    dbClient.query(
        "SELECT name, lon, lat FROM stations WHERE user_id = 1",
        function (dbError, dbResponse) {
            if (dbError) {
                console.error(dbError);
                return;
            }

            stations = dbResponse.rows;

            dbClient.query(
                "SELECT w.station_id, weathercode, temperature, wind, pressure FROM stations s LEFT JOIN weatherdata w ON s.id = w.station_id WHERE w.id IN (SELECT MIN(id) FROM weatherdata GROUP BY station_id)",
                function (dbError, dbResponse) {
                    if (dbError) {
                        console.error(dbError);
                        return;
                    }

                    values = dbResponse.rows;
                    const data = mergeArrays(stations, values);
                    response.render("Dashboard", { data: data });
                }
            );
        }
    );
}

function mergeArrays(stations, values) {
    const mergedData = [];

    for (const station of stations) {
        const matchingValue = values.find((value) => value.station_id === station.id);
        const data = {
            ...station,
            ...(matchingValue || { weathercode: 0, temperature: 0, wind: 0, pressure: 0 }),
        };
        mergedData.push(data);
    }

    return mergedData;
}



app.get("/stations/:id", function (request, response) {
    dbClient.query("select * from stations s join weatherdata w on s.id =w.station_id where station_id =$1 order by time desc", [request.params.id], function (dbError, dbResponse) {
        if (dbResponse.rows.length === 0) {
            response.render("error", {text: "Ups! Station nicht gefunden"});
        } else {
            response.render("Station", {data: dbResponse.rows});
        }
    })
});

app.listen(PORT, function () {
    console.log(`Weathertop running and listening on port ${PORT}`);
});


