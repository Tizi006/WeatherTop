const cards = (document.querySelectorAll('.card'));
cards.forEach((card, index) => {
        const buttons = card.querySelectorAll('.displayed-selector');
        const dataElements = card.querySelectorAll('.card-data');

        // Set initial display to "none" for windview and pressureview
        const windview = card.querySelector('.wind-data');
        const pressureview = card.querySelector('.pressure-data');
        windview.style.display = 'none';
        pressureview.style.display = 'none';

        buttons.forEach((button) => {
            if (button.dataset.target === 'temp') {
                button.classList.add('active');
            }
        });

        card.addEventListener('click', (event) => {
            const targetButton = event.target.closest('.displayed-selector');
            if (!targetButton) return;

            const target = targetButton.dataset.target;

            buttons.forEach((button) => {
                if (button.dataset.target === target) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });

            dataElements.forEach((dataElement) => {
                if (dataElement.classList.contains(`${target}-data`)) {
                    dataElement.style.display = 'flex';
                } else {
                    dataElement.style.display = 'none';
                }
            });
        });

        // Handles animation
        card.style.animationDelay = `${index * 0.4}s`;
        const newcard = (document.querySelector('#new-card'));
        newcard.style.animationDelay = `${(cards.length-1) * 0.4}s`
        // Handles background
        let img;
        const weathercode = card.querySelector('.weather-code').textContent;
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
            case "700": //mist
                img = "../images/mist.jpg";
                break;
            case "800": //clear
                img = "../images/cloudy.jpg";
                break;
            default: //sunset
                img = "../images/sunset.jpg";
                break;
        }
        const cardId = `card-${index}`;
        card.setAttribute('id', cardId);
        document.getElementById(cardId).style.backgroundImage = `url("../images/waves.svg"), url(${img})`;
    }
);

