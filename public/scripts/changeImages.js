let img;
const detailedCard = document.querySelector('.detailed-card');
const weathercode=  document.querySelector('.weather-code').textContent;
switch (weathercode) {
    case "200": //Thunderstorm
        img = "../images/thunderstrom.jpg";
        break;
    case "300": //drizzle
        img = "../images/drizzle.jpg";
        break;
    case "500": //Rain
        img = "../images/rain.jpg";
        break;
    case "600": //Snow
        img = "../images/snow.jpg";
        break;
    case "800": //clear
        img = "../images/cloudy.jpg";
        break;
    default: //sunset
        img = "../images/sunset.jpg";
        break;
}
detailedCard.style.backgroundImage = ` url("../images/upperwaves.svg"), url("../images/waves.svg"), url(${img})`;