window.addEventListener('scroll', function() {
    const element = document.querySelector("nav");
    let scrollPosition = window.scrollY;

    if (scrollPosition > 0) {
        element.classList.add('invisible');
    } else {
        element.classList.remove('invisible');
    }
});