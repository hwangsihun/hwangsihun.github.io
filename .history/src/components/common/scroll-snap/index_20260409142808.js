const SNAP_ROOT_SELECTOR = '.snap_page';
const SNAP_SECTION_SELECTOR = '.snap_section, .snap_visual_section, .footer_section';
const SNAP_MIN_WIDTH = 768;
const SNAP_MIN_HEIGHT = 901;
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

    function getMaxScrollTop() {
        return Math.max(0, snapRoot.scrollHeight - snapRoot.clientHeight);
    }

    function getViewportHeight() {
        return window.visualViewport?.height || window.innerHeight;
    }

    function isSnapEnabled() {
        return window.innerWidth >= SNAP_MIN_WIDTH && getViewportHeight() >= SNAP_MIN_HEIGHT;
    }

    function getTargetScrollTop(targetSection) {
        if (!targetSection) return snapRoot.scrollTop;

        const alignToViewportBottom =
            targetSection.classList.contains('footer_section') ||
            targetSection.dataset.snapAlign === 'end';

        const targetScrollTop = alignToViewportBottom
            ? targetSection.offsetTop + targetSection.offsetHeight - snapRoot.clientHeight
            : targetSection.offsetTop;

        return Math.max(0, Math.min(getMaxScrollTop(), targetScrollTop));
    }

    function animateToSection(targetSection) {
        if (!targetSection || isAnimating) return;

        isAnimating = true;

        const startScrollTop = snapRoot.scrollTop;
        const targetScrollTop = getTargetScrollTop(targetSection);
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
        const currentScrollTop = snapRoot.scrollTop;
        let closestIndex = 0;
        let smallestDistance = Number.POSITIVE_INFINITY;

        sections.forEach((section, index) => {
            const sectionScrollTop = getTargetScrollTop(section);
            const distance = Math.abs(currentScrollTop - sectionScrollTop);

            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestIndex = index;
            }
        });

        return closestIndex;
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
            if (!isSnapEnabled()) return;

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
            if (!isSnapEnabled() || isAnimating) return;

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








