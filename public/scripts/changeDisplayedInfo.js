const cards = (document.querySelectorAll('.card'));
cards.forEach((card, index) => {
        const buttons = card.querySelectorAll('.displayed-selector');
        const dataElements = card.querySelectorAll('.parameter-box');

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
        newcard.style.animationDelay = `${(cards.length - 1) * 0.4}s`
        // Handles background
        const weathercode = card.querySelector('.weather-code').textContent;
        const cardId = `card-${index}`;
        card.setAttribute('id', cardId);
        document.getElementById(cardId).style.backgroundImage = `url("../images/waves.svg"), url(${getImg(weathercode)})`;
        //weathercode
        //card.querySelector('.weather-code').textContent = translateCode(weathercode);
        //trends
        const temptrend = card.querySelector('.temp-trend').alt
        const windtrend = card.querySelector('.wind-trend').alt
        const pressuretrend = card.querySelector('.pressure-trend').alt
        card.querySelector('.temp-trend').src = getTrend(temptrend)
        card.querySelector('.wind-trend').src = getTrend(windtrend)
        card.querySelector('.pressure-trend').src = getTrend(pressuretrend)
        //windDirection
        card.querySelector('.wind-dir').textContent = translateWindDirection(parseFloat(card.querySelector('.wind-dir').textContent))
        //temp
        card.querySelector('.temp-img').src = getTemp(card.querySelector('.temp-img').alt)
    }
);

