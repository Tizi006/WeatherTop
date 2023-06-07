const express = require("express");
const dotenv = require("dotenv");
const {urlencoded} = require("express");
const pg = require("pg");
const session = require("express-session");
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

app = express();
//turn on serving static files (required for delivering css to client)
app.use(express.static("public"));
//configure template engine
app.set("views", "views");
app.set("view engine", "pug");
//session
app.use(session({
    secret: "thisIsTotallySecret",
    cookie: {maxAge: 999999999},
    resave: false,
    saveUninitialized: false,
}));

//Homepage
app.get("/", function (request, response) {
    request.session.destroy();
    response.render("Login");
});
app.post("/signIn", urlencodedParser, function (request, response) {
    signIn(request, response);
});
app.post("/signUp", urlencodedParser, function (request, response) {
    if (request.body.newemail !== "" && request.body.username !== "" && request.body.usersurname !== "" && request.body.newpassword !== "") {
        dbClient.query("select email from users where email=$1 ", [request.body.newemail],
            function (dbError, dbResponse) {
                if (dbError) {
                    console.error(dbError);
                }
                if (dbResponse.rows.length === 0) {
                    dbClient.query("insert into users (email,name,surname,password) values($1,$2,$3,$4)", [request.body.newemail, request.body.username, request.body.usersurname, request.body.newpassword],
                        function (dbError) {
                            if (dbError) {
                                console.error(dbError);
                                response.redirect("/");
                            } else {
                                //setting emil and username to sign in
                                request.body.email = request.body.newemail;
                                request.body.password = request.body.newpassword
                                signIn(request, response);
                            }
                        })

                }

            })
    }
});

function signIn(request, response) {
    if (request.body.email !== "" && request.body.password !== "") {
        dbClient.query("select id from users where email=$1 and password=$2", [request.body.email, request.body.password],
            function (dbError, dbResponse) {
                if (dbError) {
                    console.error(dbError);
                }
                if (dbResponse.rows.length !== 0) {
                    //login
                    request.session.user = dbResponse.rows[0].id;
                    response.redirect("/Dashboard");
                } else {
                    response.redirect("/");
                }
            })
    }
}

//Dashboard
app.get("/dashboard", function (request, response) {
    dbClient.query(
        "SELECT s.id, s.name,s.lat,s.lon, j.weathercode, j.temperature, j.wind, j.pressure FROM stations s LEFT JOIN ( SELECT station_id, weathercode, temperature, wind, pressure, time  FROM weatherdata w WHERE (station_id, time) IN (  SELECT station_id, MAX(time)  FROM weatherdata GROUP BY station_id  )  ) j ON s.id = j.station_id where user_id=$1",
        [request.session.user],
        function (dbError, dbResponseStations) {
            if (dbError) {
                console.error(dbError);
                return;
            }
            if (request.session.user === undefined) {
                response.redirect("/");
            } else {
                response.render("Dashboard", {data: dbResponseStations.rows});
            }
        }
    );
});
app.post("/dashboard", urlencodedParser, function (request, response) {
    if (request.body.titel !== "" && request.body.lat !== "" && request.body.lon !== "") {
        dbClient.query("insert into stations (name, lon, lat,user_id) values ($1,$2,$3,$4)", [request.body.titel, request.body.lat, request.body.lon, request.session.user],
            function (dbError) {
                if (dbError) {
                    console.error(dbError);
                }
            })
    }
    response.redirect("/dashboard");
});
app.get("/stations/delete/:id", function (request, response) {
    dbClient.query("select user_id from stations where id=$1", [request.params.id], async function (dbError, dbResponseUser) {
        if (dbResponseUser.rows.length === 0) {
            response.render("error", {text: "Ups! Station nicht gefunden"});
        } else {
            if (dbResponseUser.rows[0].user_id === request.session.user) {
                dbClient.query(" delete from stations where id=$1", [request.params.id])
                await dbClient.query(" delete from weatherdata where station_id=$1", [request.params.id])
            } else {
                response.render("error", {text: "Ups! Station gehört einen anderen User"});
            }
        }
        response.redirect("/dashboard");
    })
});

//Station
app.get("/stations/:id", function (request, response) {
    //first single values
    dbClient.query("select w.id, weathercode ,temperature ,wind,winddirection ,pressure ,time from stations s join weatherdata w on s.id =w.station_id where station_id =$1 order by time desc", [request.params.id],
        function (dbError, dbResponse) {
            //minMaxValues
            dbClient.query("WITH weather_trends AS (select case WHEN temperature < lag(temperature) OVER (ORDER BY time DESC) THEN 1 WHEN temperature > lag(temperature) OVER (ORDER BY time DESC) THEN -1 ELSE 0 END AS temperature_trend, case WHEN wind < lag(wind) OVER (ORDER BY time DESC) THEN 1 WHEN wind > lag(wind) OVER (ORDER BY time DESC) THEN -1 ELSE 0 END AS wind_trend, case WHEN pressure < lag(pressure) OVER (ORDER BY time DESC) THEN 1 WHEN pressure > lag(pressure) OVER (ORDER BY time DESC) THEN -1 ELSE 0 END AS pressure_trend from weatherdata where station_id = $1 ORDER by time desc LIMIT 2) select wt.temperature_trend, wt.wind_trend, wt.pressure_trend, s.mintemp, s.maxtemp, s.minwind, s.maxwind, s.minpressure, s.maxpressure FROM weather_trends wt CROSS JOIN ( SELECT min(temperature) AS mintemp, max(temperature) AS maxtemp, min(wind) AS minwind, max(wind) AS maxwind, min(pressure) AS minpressure, max(pressure) AS maxpressure FROM stations s JOIN weatherdata w ON s.id = w.station_id WHERE s.id = $1) s OFFSET 1 FETCH FIRST ROW ONLY;",
                [request.params.id],
                function (dbError, dbResponseMinMax) {
                    //for each reading
                    dbClient.query("select * from stations where id=$1", [request.params.id],
                        function (dbError, dbResponseStation) {
                        if (dbResponseStation.rows.length === 0) {
                            response.render("error", {text: "Ups! Station nicht gefunden"});
                        } else {
                            if (dbResponseStation.rows[0].user_id === request.session.user) {
                                //if no readings
                                if (dbResponse.rows.length === 0) {
                                    const d = []
                                    d.push({
                                        id: "",
                                        weathercode: "undefined",
                                        temperature: "undefined",
                                        wind: "undefined",
                                        winddirection:"undefined",
                                        pressure: "undefined",
                                        time: "undefined"
                                    });
                                    response.render("Station", {data: d, station: dbResponseStation.rows[0]});
                                } else {
                                    //if no minMax Values
                                    if (dbResponseMinMax.rows.length === 0) {
                                        const minmax = [];
                                        minmax.push({
                                            mintemp: dbResponse.rows[0].temperature,
                                            maxtemp: dbResponse.rows[0].temperature,
                                            minwind: dbResponse.rows[0].wind,
                                            maxwind: dbResponse.rows[0].wind,
                                            minpressure: dbResponse.rows[0].pressure,
                                            maxpressure: dbResponse.rows[0].pressure,
                                            temperature_trend: 0,
                                            wind_trend: 0,
                                            pressure_trend: 0
                                        })
                                        response.render("Station", {
                                            data: dbResponse.rows,
                                            station: dbResponseStation.rows[0],
                                            minmax: minmax
                                        });
                                    } else {
                                        response.render("Station", {
                                            data: dbResponse.rows,
                                            station: dbResponseStation.rows[0],
                                            minmax: dbResponseMinMax.rows[0]
                                        });
                                    }
                                }
                            } else {
                                response.render("error", {text: "Ups! Station gehört einen anderen User"});
                            }
                        }
                    })

                })
        })
});
app.post("/stations/:id", urlencodedParser, function (request, response) {
    if (request.body.code !== "" && request.body.temp !== "" && request.body.wind !== "" && request.body.winddir !== "" && request.body.pressure !== "") {
        dbClient.query("insert into weatherdata (station_id,weathercode,temperature,wind,winddirection,pressure) values($1,$2,$3,$4,$5,$6)", [request.params.id, request.body.code, request.body.temp, request.body.wind, request.body.winddir, request.body.pressure],
            function (dbError) {
                if (dbError) {
                    console.error(dbError);
                }
            })
    }
    response.redirect(`/stations/${request.params.id}`);
});
app.get("/stations/delete/reading/:id", function (request, response) {
    dbClient.query("select user_id, station_id from weatherdata w join stations s on w.station_id=s.id where w.id=$1", [request.params.id], function (dbError, dbResponseUser) {
        if (dbResponseUser.rows.length === 0) {
            response.render("error", {text: "Ups! Eintrag nicht gefunden"});
        } else {
            if (dbResponseUser.rows[0].user_id === request.session.user) {
                dbClient.query(" delete from weatherdata  where id=$1", [request.params.id])
            } else {
                response.render("error", {text: "Ups! Station mit Reading gehört einen anderen User"});
            }
        }
        response.redirect(`/stations/${dbResponseUser.rows[0].station_id}`);
    })
});

app.listen(PORT, function () {
    console.log(`Weathertop running and listening on port ${PORT}`);
});


