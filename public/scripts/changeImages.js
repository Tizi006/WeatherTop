//background
const detailedCard = document.querySelector('.detailed-card');
let weathercode=  document.querySelector('.weather-code').textContent;
detailedCard.style.backgroundImage = ` url("../images/upperwaves.svg"), url(${getImg(weathercode)})`;
//weather-code
document.querySelector('.weather-code').textContent =translateCode(weathercode);
//trends
const  temp=document.querySelector('.temp-trend').alt
const  wind=document.querySelector('.wind-trend').alt
const  pressure=document.querySelector('.pressure-trend').alt
document.querySelector('.temp-trend').src=getTrend(temp)
document.querySelector('.wind-trend').src=getTrend(wind)
document.querySelector('.pressure-trend').src=getTrend(pressure)
//windDirection
document.querySelector('.wind-dir').textContent =translateWindDirection(parseFloat(document.querySelector('.wind-dir').textContent.trim().substring(document.querySelector('.wind-dir').textContent.length-1)))
//temp
document.querySelector('.temp-img').src=getTemp(document.querySelector('.temp-img').alt)
