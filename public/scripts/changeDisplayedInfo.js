const cards =(document.querySelectorAll('.card'));
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
});
