function getImg(weathercode){
    switch (weathercode/100) {
        case 2: //Thunderstorm
            return  "/images/thunderstrom.jpg";
        case 3: //drizzle
            return "/images/drizzle.jpg";
        case 5: //Rain
            return "/images/rain.jpg";
        case 6: //Snow
            return "/images/snow.jpg";
        case 7: //mist
            return "/images/mist.jpg";
        case 8: //clear
            return "/images/cloudy.jpg";
        default: //sunset
            return "/images/sunset.jpg";
    }
}
function getTemp(temperature){
    const temperatues = [
        { label: "/images/icons/temperature/thermometer-snow.svg", min: -99999,  max: -15 },
        { label: "/images/icons/temperature/thermometer.svg", min: -15, max: 0 },
        { label: "/images/icons/temperature/thermometer-low.svg", min: 0, max: 15 },
        { label: "/images/icons/temperature/thermometer-half.svg", min: 15, max: 22 },
        { label: "/images/icons/temperature/thermometer-high.svg", min: 22, max: 25 },
        { label: "/images/icons/temperature/thermometer-sun.svg", min: 30,max: 99999 }
    ];
    //Match directions
    for (let i = 0; i < temperatues.length; i++) {
        if (temperature >= temperatues[i].min && temperature < temperatues[i].max) {
            return temperatues[i].label;
        }
    }
    return "undefined";
}
function translateCode(weathercode){
    switch (weathercode/100) {
        case 2: //Thunderstorm
            return  "Gewitter";
        case 3: //drizzle
            return "Nieselregen";
        case 5: //Rain
            return "Regen";
        case 6: //Snow
            return "Snow";
        case 7: //mist
            return "Nebel";
        case 8: //clear
            return "Sonnig";
        default: //sunset
            return "";
    }
}
function translateWindDirection(direction) {
    direction = Number(direction);
    direction = (direction + 360) % 360;
console.log(direction)
    const directions = [
        { label: "N", min: 348.75, max: 360 },
        { label: "N", min: 0, max: 11.25 },
        { label: "NNE", min: 11.25, max: 33.75 },
        { label: "NE", min: 33.75, max: 56.25 },
        { label: "ENE", min: 56.25, max: 78.75 },
        { label: "E", min: 78.75, max: 101.25 },
        { label: "ESE", min: 101.25, max: 123.75 },
        { label: "SE", min: 123.75, max: 146.25 },
        { label: "SSE", min: 146.25, max: 168.75 },
        { label: "S", min: 168.75, max: 191.25 },
        { label: "SSW", min: 191.25, max: 213.75 },
        { label: "SW", min: 213.75, max: 236.25 },
        { label: "WSW", min: 236.25, max: 258.75 },
        { label: "W", min: 258.75, max: 281.25 },
        { label: "WNW", min: 281.25, max: 303.75 },
        { label: "NW", min: 303.75, max: 326.25 },
        { label: "NNW", min: 326.25, max: 348.75 }
    ];

    for (let i = 0; i < directions.length; i++) {
        if (direction >= directions[i].min && direction < directions[i].max) {
            return directions[i].label;
        }
    }
    return "";
}
function getTrend(trendcode){
    switch (trendcode) {
        case "-1": //down
            return  "/images/icons/arrow-down-right.svg";
        case "1": //up
            return "/images/icons/arrow-up-right.svg";
        case"0": //same
            return "/images/icons/arrow-right.svg";
        default: //none
            return "";
    }
}