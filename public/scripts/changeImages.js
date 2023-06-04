const detailedCard = document.querySelector('.detailed-card');
const weathercode=  document.querySelector('.weather-code').textContent;
detailedCard.style.backgroundImage = ` url("../images/upperwaves.svg"), url(${getImg(weathercode)})`;