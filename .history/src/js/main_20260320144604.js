// main.js

const sections = document.querySelectorAll('#main-1, #main-2');
let isScrolling = false;

function scrollToSection(targetY) {
    if (isScrolling) return;
    isScrolling = true;

    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 600; // 이동 시간(ms)
    let startTime = null;

    function animateScroll(time) {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easing: easeInOutCubic
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

// 마우스 휠 이벤트 처리
window.addEventListener(
    'wheel',
    (e) => {
        e.preventDefault();
        if (isScrolling) return;

        const direction = e.deltaY > 0 ? 1 : -1;
        const currentScroll = window.scrollY;

        let nextSection;
        if (direction > 0) {
            nextSection = Array.from(sections).find((s) => s.offsetTop > currentScroll);
        } else {
            const reversed = Array.from(sections).reverse();
            nextSection = reversed.find((s) => s.offsetTop < currentScroll);
        }

        if (nextSection) scrollToSection(nextSection.offsetTop);
    },
    { passive: false },
);

// 터치 스와이프 대응 (모바일)
let touchStartY = 0;

window.addEventListener(
    'touchstart',
    (e) => {
        touchStartY = e.touches[0].clientY;
    },
    { passive: true },
);

window.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchStartY - touchEndY;
    if (Math.abs(delta) < 50) return; // 너무 짧은 스와이프 무시
    const direction = delta > 0 ? 1 : -1;
    const currentScroll = window.scrollY;

    let nextSection;
    if (direction > 0) {
        nextSection = Array.from(sections).find((s) => s.offsetTop > currentScroll);
    } else {
        const reversed = Array.from(sections).reverse();
        nextSection = reversed.find((s) => s.offsetTop < currentScroll);
    }

    if (nextSection) scrollToSection(nextSection.offsetTop);
});
