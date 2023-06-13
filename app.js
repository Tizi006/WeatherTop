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
const dbClient = new pg.Client({connectionString: process.env.DB_CON_STRING, ssl: {rejectUnauthorized: false}});
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



//Dashboard
app.get("/dashboard", async function (request, response) {
    if (request.session.user === undefined) {
        response.redirect("/");
    } else {
        try {
            //async structure needed for loading minmax values correctly
            const dbResponseStations = await new Promise((resolve, reject) => {
                dbClient.query(
                    "SELECT s.id, s.name, s.lat, s.lon, j.weathercode, j.temperature, j.wind, j.winddirection, j.pressure FROM stations s LEFT JOIN (SELECT station_id, weathercode, temperature, wind, winddirection, pressure, time FROM weatherdata w WHERE (station_id, time) IN (SELECT station_id, MAX(time) FROM weatherdata GROUP BY station_id)) j ON s.id = j.station_id WHERE user_id = $1",
                    [request.session.user],
                    (dbError, dbResponseStations) => {
                        if (dbError) {
                            reject(dbError);
                        } else {
                            resolve(dbResponseStations);
                        }
                    }
                );
            });

            const minmaxPromises = dbResponseStations.rows.map((row) => {
                return new Promise((resolve, reject) => {
                    dbClient.query(
                        "WITH weather_trends AS (SELECT CASE WHEN temperature < LAG(temperature) OVER (ORDER BY time DESC) THEN 1 WHEN temperature > LAG(temperature) OVER (ORDER BY time DESC) THEN -1 ELSE 0 END AS temperature_trend, CASE WHEN wind < LAG(wind) OVER (ORDER BY time DESC) THEN 1 WHEN wind > LAG(wind) OVER (ORDER BY time DESC) THEN -1 ELSE 0 END AS wind_trend, CASE WHEN pressure < LAG(pressure) OVER (ORDER BY time DESC) THEN 1 WHEN pressure > LAG(pressure) OVER (ORDER BY time DESC) THEN -1 ELSE 0 END AS pressure_trend FROM weatherdata WHERE station_id = $1 ORDER BY time DESC LIMIT 2) SELECT wt.temperature_trend, wt.wind_trend, wt.pressure_trend, s.mintemp, s.maxtemp, s.minwind, s.maxwind, s.minpressure, s.maxpressure FROM weather_trends wt CROSS JOIN (SELECT MIN(temperature) AS mintemp, MAX(temperature) AS maxtemp, MIN(wind) AS minwind, MAX(wind) AS maxwind, MIN(pressure) AS minpressure, MAX(pressure) AS maxpressure FROM stations s JOIN weatherdata w ON s.id = w.station_id WHERE s.id = $1) s OFFSET 1 FETCH FIRST ROW ONLY;",
                        [row.id],
                        (dbError, dbResponseMinMax) => {
                            if (dbError) {
                                reject(dbError);
                            } else {
                                if (dbResponseMinMax.rows.length === 0) {
                                    resolve(null);
                                } else {
                                    resolve(dbResponseMinMax.rows[0]);
                                }
                            }
                        }
                    );
                });
            });
            const minmax = await Promise.all(minmaxPromises);
            response.render("Dashboard", {data: dbResponseStations.rows, minmax: minmax});
        } catch (error) {
            console.error(error);
        }
    }
});

app.post("/dashboard", urlencodedParser, async function (request, response) {
    //set lat/lon automatically
    if (request.body.titel !== "" && request.body.lat === "" && request.body.lon === "") {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${request.body.titel}&appid=${process.env.API_KEY}`;
        const apiresponse = await fetch(url);
        const apidata = await apiresponse.json();
        console.log(apidata)
        if (apiresponse.status === 200) {
            request.body.lat=apidata.coord.lat;
            request.body.lon=apidata.coord.lon;

        }
    }
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
    // First single values
    dbClient.query("select w.id, weathercode, temperature, wind, winddirection, pressure, time from stations s join weatherdata w on s.id = w.station_id where station_id = $1 order by time desc", [request.params.id],
        function (dbError, dbResponse) {
            // MinMaxValues
            dbClient.query("WITH weather_trends AS (select case WHEN temperature < lag(temperature) OVER (ORDER BY time DESC) THEN 1 WHEN temperature > lag(temperature) OVER (ORDER BY time DESC) THEN -1 ELSE 0 END AS temperature_trend, case WHEN wind < lag(wind) OVER (ORDER BY time DESC) THEN 1 WHEN wind > lag(wind) OVER (ORDER BY time DESC) THEN -1 ELSE 0 END AS wind_trend, case WHEN pressure < lag(pressure) OVER (ORDER BY time DESC) THEN 1 WHEN pressure > lag(pressure) OVER (ORDER BY time DESC) THEN -1 ELSE 0 END AS pressure_trend from weatherdata where station_id = $1 ORDER by time desc LIMIT 2) select wt.temperature_trend, wt.wind_trend, wt.pressure_trend, s.mintemp, s.maxtemp, s.minwind, s.maxwind, s.minpressure, s.maxpressure FROM weather_trends wt CROSS JOIN (SELECT min(temperature) AS mintemp, max(temperature) AS maxtemp, min(wind) AS minwind, max(wind) AS maxwind, min(pressure) AS minpressure, max(pressure) AS maxpressure FROM stations s JOIN weatherdata w ON s.id = w.station_id WHERE s.id = $1) s OFFSET 1 FETCH FIRST ROW ONLY;",
                [request.params.id],
                function (dbError, dbResponseMinMax) {
                    // For each reading
                    dbClient.query("select * from stations where id=$1", [request.params.id],
                        function (dbError, dbResponseStation) {
                            if (dbResponseStation.rows.length === 0) {
                                response.render("error", {text: "Ups! Station nicht gefunden"});
                            } else {
                                if (dbResponseStation.rows[0].user_id === request.session.user) {

                                    response.render("Station", {
                                        data: dbResponse.rows,
                                        station: dbResponseStation.rows[0],
                                        minmax: dbResponseMinMax.rows[0]
                                    });
                                } else {
                                    response.render("error", {text: "Ups! Station gehört einem anderen User"});
                                }
                            }
                        }
                    )
                    ;
                });
        })
    ;
})

app.post("/stations/:id", urlencodedParser, function (request, response) {
    if (request.body.code !== "" && request.body.temp !== "" && request.body.wind !== "" && request.body.winddir !== "" && request.body.pressure !== "") {
        addReading(request);
    }
    response.redirect(`/stations/${request.params.id}`);
});

app.post("/stations/autoReading/:id/:name", urlencodedParser, async function (request, response) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${request.params.name}&appid=${process.env.API_KEY}&units=metric`;
    const apiresponse = await fetch(url);
    const apidata = await apiresponse.json();
    if (apiresponse.status !== 200) {
        response.render("error", {text: `Ups! Station mit Namen: ${request.params.name} nicht in Real-live gefunden`});
    } else {
        console.log(apidata)
        request.body.code=apidata.weather[0].id;
        request.body.temp=apidata.main.temp;
        request.body.wind=apidata.wind.speed;
        request.body.winddir=apidata.wind.deg;
        request.body.pressure=apidata.main.pressure;
        addReading(request);
        response.redirect("back");
    }
})

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

//functions
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

function addReading(request) {
    dbClient.query("insert into weatherdata (station_id,weathercode,temperature,wind,winddirection,pressure) values($1,$2,$3,$4,$5,$6)", [request.params.id, request.body.code, request.body.temp, request.body.wind, request.body.winddir, request.body.pressure],
        function (dbError) {
            if (dbError) {
                console.error(dbError);
            }
        })
}


