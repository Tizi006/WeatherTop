const cards = document.querySelectorAll('.card');

cards.forEach((card) => {
    const buttons = card.querySelectorAll('.displayed-selector');
    const dataElements = card.querySelectorAll('.card-data');

    buttons.forEach((button) => {
        button.addEventListener('click', handleButtonClick);
        if (button.dataset.target === 'temp') {
            button.classList.add('active');
        }
    });

    // Set initial display to "none" for windview and pressureview
    const windview = card.querySelector('.card-data[data-view="wind"]');
    const pressureview = card.querySelector('.card-data[data-view="pressure"]');
    windview.style.display = 'none';
    pressureview.style.display = 'none';

    function handleButtonClick(event) {
        const target = event.currentTarget.dataset.target;

        buttons.forEach((button) => {
            if (button.dataset.target === target) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        dataElements.forEach((dataElement) => {
            if (dataElement.dataset.view === target) {
                dataElement.style.display = 'flex';
            } else {
                dataElement.style.display = 'none';
            }
        });
    }
    //handles animation
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.4}s`;
    });
});