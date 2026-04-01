const sections = document.querySelectorAll('#main-1, #main-2');
let isScrolling = false;

function scrollToSection(targetY) {
    if (isScrolling) return;
    isScrolling = true;

    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 600;
    let startTime = null;

    function animateScroll(time) {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress < 0.5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, startY + distance * ease);

        if (elapsed < duration) {
            requestAnimationFrame(animateScroll);
        } else {
            isScrolling = false;
        }
    }

    requestAnimationFrame(animateScroll);
}

window.addEventListener(
    'wheel',
    (event) => {
        event.preventDefault();
        if (isScrolling) return;

        const direction = event.deltaY > 0 ? 1 : -1;
        const currentScroll = window.scrollY;
        let nextSection;

        if (direction > 0) {
            nextSection = Array.from(sections).find((section) => section.offsetTop > currentScroll);
        } else {
            nextSection = Array.from(sections)
                .reverse()
                .find((section) => section.offsetTop < currentScroll);
        }

        if (nextSection) {
            scrollToSection(nextSection.offsetTop);
        }
    },
    { passive: false },
);

let touchStartY = 0;

window.addEventListener(
    'touchstart',
    (event) => {
        touchStartY = event.touches[0].clientY;
    },
    { passive: true },
);

window.addEventListener('touchend', (event) => {
    const touchEndY = event.changedTouches[0].clientY;
    const delta = touchStartY - touchEndY;

    if (Math.abs(delta) < 50) return;

    const direction = delta > 0 ? 1 : -1;
    const currentScroll = window.scrollY;
    let nextSection;

    if (direction > 0) {
        nextSection = Array.from(sections).find((section) => section.offsetTop > currentScroll);
    } else {
        nextSection = Array.from(sections)
            .reverse()
            .find((section) => section.offsetTop < currentScroll);
    }

    if (nextSection) {
        scrollToSection(nextSection.offsetTop);
    }
});
