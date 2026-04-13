import {
    SNAP_MIN_HEIGHT,
    SNAP_MIN_WIDTH,
    getSnapRoot,
    getSnapSectionScrollTop,
    getSnapSections,
} from '../core/snap.js';
import { waitForMain2Warmup } from '../features/gallery-swipers.js';

const DEFAULT_DURATION = 1200;
const DEFAULT_WHEEL_THRESHOLD = 10;

function easeInOutCubic(progress) {
    if (progress < 0.5) {
        return 4 * progress * progress * progress;
    }

    return 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

export function initializeCustomScrollSnap() {
    const snapRoot = getSnapRoot();

    if (!snapRoot || snapRoot.dataset.customScrollSnapInitialized === 'true') return;

    const sections = getSnapSections(snapRoot);

    if (sections.length === 0) return;

    const duration = Number(snapRoot.dataset.snapDuration) || DEFAULT_DURATION;
    const wheelThreshold = Number(snapRoot.dataset.snapWheelThreshold) || DEFAULT_WHEEL_THRESHOLD;
    let isAnimating = false;
    let isPreparingTargetSection = false;
    let touchStartY = 0;

    function getViewportHeight() {
        return window.visualViewport?.height || window.innerHeight;
    }

    function isSnapEnabled() {
        return window.innerWidth >= SNAP_MIN_WIDTH && getViewportHeight() >= SNAP_MIN_HEIGHT;
    }

    function animateToSection(targetSection) {
        if (!targetSection || isAnimating) return;

        isAnimating = true;

        const startScrollTop = snapRoot.scrollTop;
        const targetScrollTop = getSnapSectionScrollTop(snapRoot, targetSection);
        const distance = targetScrollTop - startScrollTop;
        const startTime = performance.now();
        const isFirstMain2Entry =
            targetSection.id === 'main-2' && document.body?.dataset.main2FirstEntryComplete !== 'true';
        const effectiveDuration = isFirstMain2Entry ? Math.min(duration, 560) : duration;

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / effectiveDuration, 1);
            const easedProgress = easeInOutCubic(progress);

            snapRoot.scrollTop = startScrollTop + distance * easedProgress;

            if (progress < 1) {
                requestAnimationFrame(step);
                return;
            }

            isAnimating = false;

            if (targetSection.id === 'main-2') {
                document.body.dataset.main2FirstEntryComplete = 'true';
            }
        }

        requestAnimationFrame(step);
    }

    function getCurrentSectionIndex() {
        const currentScrollTop = snapRoot.scrollTop;
        let closestIndex = 0;
        let smallestDistance = Number.POSITIVE_INFINITY;

        sections.forEach((section, index) => {
            const sectionScrollTop = getSnapSectionScrollTop(snapRoot, section);
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
        const targetSection = sections[nextIndex];

        if (nextIndex === safeIndex) return;
        if (!targetSection) return;

        if (targetSection.id === 'main-2' && document.body?.dataset.main2WarmupReady !== 'true') {
            if (isPreparingTargetSection) return;

            isPreparingTargetSection = true;
            waitForMain2Warmup().finally(() => {
                isPreparingTargetSection = false;
                animateToSection(targetSection);
            });
            return;
        }

        animateToSection(targetSection);
    }

    snapRoot.addEventListener(
        'wheel',
        (event) => {
            if (!isSnapEnabled()) return;

            event.preventDefault();

            if (isAnimating || isPreparingTargetSection || Math.abs(event.deltaY) < wheelThreshold) return;

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
            if (!isSnapEnabled() || isAnimating || isPreparingTargetSection) return;

            const touchEndY = event.changedTouches[0].clientY;
            const deltaY = touchStartY - touchEndY;

            if (Math.abs(deltaY) < 40) return;

            moveToAdjacentSection(deltaY > 0 ? 1 : -1);
        },
        { passive: true },
    );

    snapRoot.dataset.customScrollSnapInitialized = 'true';
}
