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