function getImg(weathercode){
    switch (Number.parseInt(weathercode/100)) {
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
        { label: "/images/icons/temperature/thermometer-half.svg", min: 15, max: 24 },
        { label: "/images/icons/temperature/thermometer-high.svg", min: 24, max: 27 },
        { label: "/images/icons/temperature/thermometer-sun.svg", min: 27,max: 99999 }
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
    switch (Number.parseInt(weathercode/100)) {
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
    direction = parseFloat(direction);
    direction = (direction + 360) % 360;
    const directions = [
        'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW',
        'WSW', 'W', 'WNW', 'NW', 'NNW'
    ];

    // range [0, 360)
    const normalizedAngle = ((direction % 360) + 360) % 360;
    const index = Math.floor(normalizedAngle / 22.5);
    // Return the corresponding direction
    return index>=0&&index<=15? "Richtung: "+ directions[index]:'';
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