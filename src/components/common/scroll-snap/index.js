const SNAP_ROOT_SELECTOR = '.snap_page';
const SNAP_SECTION_SELECTOR = '.snap_section, .snap_visual_section';
const DEFAULT_DURATION = 1200;
const DEFAULT_WHEEL_THRESHOLD = 20;

function easeInOutCubic(progress) {
    if (progress < 0.5) {
        return 4 * progress * progress * progress;
    }

    return 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function initializeCustomScrollSnap() {
    const snapRoot = document.querySelector(SNAP_ROOT_SELECTOR);

    if (!snapRoot) return;

    const sections = Array.from(snapRoot.querySelectorAll(SNAP_SECTION_SELECTOR));

    if (sections.length === 0) return;

    const duration = Number(snapRoot.dataset.snapDuration) || DEFAULT_DURATION;
    const wheelThreshold = Number(snapRoot.dataset.snapWheelThreshold) || DEFAULT_WHEEL_THRESHOLD;
    let isAnimating = false;
    let touchStartY = 0;

    function animateToSection(targetSection) {
        if (!targetSection || isAnimating) return;

        isAnimating = true;

        const startScrollTop = snapRoot.scrollTop;
        const targetScrollTop = targetSection.offsetTop;
        const distance = targetScrollTop - startScrollTop;
        const startTime = performance.now();

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);

            snapRoot.scrollTop = startScrollTop + distance * easedProgress;

            if (progress < 1) {
                requestAnimationFrame(step);
                return;
            }

            isAnimating = false;
        }

        requestAnimationFrame(step);
    }

    function getCurrentSectionIndex() {
        const currentCenter = snapRoot.scrollTop + snapRoot.clientHeight / 2;

        return sections.findIndex((section) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;

            return currentCenter >= top && currentCenter < bottom;
        });
    }

    function moveToAdjacentSection(direction) {
        const currentIndex = getCurrentSectionIndex();
        const safeIndex = currentIndex === -1 ? 0 : currentIndex;
        const nextIndex = Math.max(0, Math.min(sections.length - 1, safeIndex + direction));

        if (nextIndex === safeIndex) return;

        animateToSection(sections[nextIndex]);
    }

    snapRoot.addEventListener(
        'wheel',
        (event) => {
            event.preventDefault();

            if (isAnimating || Math.abs(event.deltaY) < wheelThreshold) return;

            moveToAdjacentSection(event.deltaY > 0 ? 1 : -1);
        },
        { passive: false },
    );

    snapRoot.addEventListener(
        'touchstart',
        (event) => {
            touchStartY = event.touches[0].clientY;
        },
        { passive: true },
    );

    snapRoot.addEventListener(
        'touchend',
        (event) => {
            if (isAnimating) return;

            const touchEndY = event.changedTouches[0].clientY;
            const deltaY = touchStartY - touchEndY;

            if (Math.abs(deltaY) < 40) return;

            moveToAdjacentSection(deltaY > 0 ? 1 : -1);
        },
        { passive: true },
    );
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCustomScrollSnap);
} else {
    initializeCustomScrollSnap();
}
