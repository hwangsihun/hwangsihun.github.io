import './style/global.css';
import './style/layout.css';
import './style/responsive.css';
import './style/swiper-custom.css';
import './components/common/buttons/pagination/index.js';
import './components/common/calendar/index.js';
import './components/common/scroll-snap/index.js';
import './pages/home.js';
const SWIPER_SECTION_CONFIGS = [
    {
        sectionSelector: '#main-2',
        swiperSelector: '.main2-swiper',
        paginationSelector: '.main2-swiper-pagination',
        progressSelector: '.main2-swiper-progress',
        progressFillSelector: '.main2-swiper-progress-fill',
        controlsSelector: '.wrapper_pagination_pc',
    },
    {
        sectionSelector: '#main-3',
        swiperSelector: '.main3-swiper',
        paginationSelector: '.main3-swiper-pagination',
        progressSelector: '.main3-swiper-progress',
        progressFillSelector: '.main3-swiper-progress-fill',
        prevButtonSelector: '[data-main3-swiper-controls] [data-pagination-button="prev"]',
        toggleButtonSelector: '[data-main3-swiper-controls] [data-pagination-button="stop"]',
        nextButtonSelector: '[data-main3-swiper-controls] [data-pagination-button="next"]',
    },
];

const SWIPER_BASE_OPTIONS = {
    direction: 'horizontal',
    loop: false,
    rewind: true,
    slidesPerView: 1,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        reverseDirection: false,
    },
    effect: 'slide',
    speed: 800,
    grabCursor: true,
    allowTouchMove: true,
    simulateTouch: true,
    touchRatio: 1,
    touchAngle: 45,
    touchEventsTarget: 'wrapper',
};

function syncViewportSize() {
    const viewportHeight = Math.round(window.visualViewport?.height || window.innerHeight);
    const viewportWidth = Math.round(window.visualViewport?.width || window.innerWidth);

    document.documentElement.style.setProperty('--app-height', `${viewportHeight}px`);
    document.documentElement.style.setProperty('--app-width', `${viewportWidth}px`);

    window.dispatchEvent(
        new CustomEvent('app:viewport-resized', {
            detail: {
                height: viewportHeight,
                width: viewportWidth,
            },
        }),
    );
}

let viewportSyncFrame = 0;

function scheduleViewportSync() {
    cancelAnimationFrame(viewportSyncFrame);
    viewportSyncFrame = requestAnimationFrame(() => {
        syncViewportSize();
    });
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function initializeGallerySwiper(config) {
    const mainSection = document.querySelector(config.sectionSelector);
    const swiperContainer = mainSection?.querySelector(config.swiperSelector);

    if (!mainSection || !swiperContainer) return;

    if (typeof mainSection.__cleanupGallerySwiper === 'function') {
        mainSection.__cleanupGallerySwiper();
    }

    const totalSlides = swiperContainer.querySelectorAll('.swiper-slide').length;

    if (!totalSlides) return;

    const progressTrack = mainSection.querySelector(config.progressSelector);
    const progressFill = mainSection.querySelector(config.progressFillSelector);
    const controlsRoot = config.controlsSelector
        ? mainSection.querySelector(config.controlsSelector)
        : null;
    const paginationButtons = controlsRoot?.querySelectorAll('.btn_pagination_pc') ?? [];
    const prevButton = config.prevButtonSelector
        ? mainSection.querySelector(config.prevButtonSelector)
        : paginationButtons[0];
    const toggleButton = config.toggleButtonSelector
        ? mainSection.querySelector(config.toggleButtonSelector)
        : paginationButtons[1];
    const nextButton = config.nextButtonSelector
        ? mainSection.querySelector(config.nextButtonSelector)
        : paginationButtons[2];
    const cleanupFns = [];
    let isUserPaused = false;
    let isProgressDragging = false;

    const swiper = new Swiper(swiperContainer, {
        ...SWIPER_BASE_OPTIONS,
        initialSlide: 0,
        pagination: {
            el: mainSection.querySelector(config.paginationSelector),
            clickable: false,
        },
    });

    function bind(target, eventName, handler, options) {
        if (!target) return;

        target.addEventListener(eventName, handler, options);
        cleanupFns.push(() => target.removeEventListener(eventName, handler, options));
    }

    function updateSlideState(realIndex = swiper.realIndex) {
        const currentIndex = realIndex + 1;

        if (progressFill) {
            const segmentWidth = 100 / totalSlides;
            const segmentOffset = realIndex * segmentWidth;

            progressFill.style.width = `${segmentWidth}%`;
            progressFill.style.left = `${segmentOffset}%`;
        }

        if (progressTrack) {
            progressTrack.setAttribute('role', 'slider');
            progressTrack.setAttribute('tabindex', '0');
            progressTrack.setAttribute('aria-valuemin', '1');
            progressTrack.setAttribute('aria-valuemax', String(totalSlides));
            progressTrack.setAttribute('aria-valuenow', String(currentIndex));
            progressTrack.setAttribute('aria-valuetext', `${currentIndex} / ${totalSlides}`);
        }
    }

    function updateToggleState() {
        if (!toggleButton) return;

        toggleButton.classList.toggle('is_paused', isUserPaused);
        toggleButton.setAttribute('aria-label', isUserPaused ? '\uC7AC\uC0DD' : '\uC815\uC9C0');

        const toggleIcon = toggleButton.querySelector('img');

        if (toggleButton.dataset.paginationButton === 'stop' && toggleIcon) {
            toggleIcon.src = isUserPaused ? '/assets/imgs/icons/start.svg' : '/assets/imgs/icons/stop.svg';
            toggleIcon.alt = isUserPaused ? 'start' : 'stop';
            toggleIcon.className = '';
        }
    }

    function getRealIndexFromPointer(clientX) {
        if (!progressTrack || totalSlides === 1) return swiper.realIndex;

        const rect = progressTrack.getBoundingClientRect();
        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);

        return Math.round(ratio * (totalSlides - 1));
    }

    function syncSlideFromPointer(clientX) {
        const targetIndex = getRealIndexFromPointer(clientX);

        if (targetIndex !== swiper.realIndex) {
            swiper.slideTo(targetIndex, 0, false);
            return;
        }

        updateSlideState(targetIndex);
    }

    function stopAutoplayForInteraction() {
        if (!isUserPaused) {
            swiper.autoplay.stop();
        }
    }

    function resumeAutoplayAfterInteraction() {
        if (!isUserPaused) {
            swiper.autoplay.start();
        }
    }

    function handleProgressPointerDown(event) {
        if (!progressTrack) return;

        isProgressDragging = true;
        progressTrack.setPointerCapture?.(event.pointerId);
        stopAutoplayForInteraction();
        syncSlideFromPointer(event.clientX);
        event.preventDefault();
    }

    function handleProgressPointerMove(event) {
        if (!isProgressDragging) return;

        syncSlideFromPointer(event.clientX);
    }

    function handleProgressPointerUp(event) {
        if (!isProgressDragging || !progressTrack) return;

        isProgressDragging = false;
        progressTrack.releasePointerCapture?.(event.pointerId);
        resumeAutoplayAfterInteraction();
    }

    function handleProgressKeydown(event) {
        if (event.key === 'ArrowLeft') {
            swiper.slidePrev();
            event.preventDefault();
        }

        if (event.key === 'ArrowRight') {
            swiper.slideNext();
            event.preventDefault();
        }
    }

    bind(prevButton, 'click', () => {
        swiper.slidePrev();
    });

    bind(nextButton, 'click', () => {
        swiper.slideNext();
    });

    bind(swiperContainer, 'mouseenter', stopAutoplayForInteraction);
    bind(swiperContainer, 'mouseleave', resumeAutoplayAfterInteraction);

    bind(toggleButton, 'click', () => {
        isUserPaused = !isUserPaused;

        if (isUserPaused) {
            swiper.autoplay.stop();
        } else {
            swiper.autoplay.start();
        }

        updateToggleState();
    });

    bind(progressTrack, 'pointerdown', handleProgressPointerDown);
    bind(progressTrack, 'pointermove', handleProgressPointerMove);
    bind(progressTrack, 'pointerup', handleProgressPointerUp);
    bind(progressTrack, 'pointercancel', handleProgressPointerUp);
    bind(progressTrack, 'keydown', handleProgressKeydown);

    swiper.slideTo(0, 0, false);
    updateSlideState();
    updateToggleState();
    swiper.on('slideChange', () => updateSlideState());

    mainSection.__cleanupGallerySwiper = () => {
        cleanupFns.forEach((cleanup) => cleanup());

        if (swiperContainer.swiper) {
            swiperContainer.swiper.destroy(true, true);
        }

        delete mainSection.__syncGallerySwiperLayout;
        delete mainSection.__cleanupGallerySwiper;
    };

    mainSection.__syncGallerySwiperLayout = () => {
        swiper.update();
        updateSlideState();
    };
}

function initializeGallerySwipers() {
    SWIPER_SECTION_CONFIGS.forEach(initializeGallerySwiper);
}

function syncGallerySwiperLayouts() {
    SWIPER_SECTION_CONFIGS.forEach((config) => {
        document.querySelector(config.sectionSelector)?.__syncGallerySwiperLayout?.();
    });
}

function syncActiveSnapSectionPosition() {
    const snapRoot = document.querySelector('.snap_page');

    if (!snapRoot) return;

    const sections = Array.from(snapRoot.querySelectorAll('.snap_section, .snap_visual_section'));

    if (!sections.length) return;

    requestAnimationFrame(() => {
        const currentCenter = snapRoot.scrollTop + snapRoot.clientHeight / 2;
        const activeSection =
            sections.find((section) => {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;

                return currentCenter >= top && currentCenter < bottom;
            }) || sections[0];

        snapRoot.scrollTop = activeSection.offsetTop;
    });
}

if (typeof Swiper !== 'undefined') {
    initializeGallerySwipers();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof Swiper !== 'undefined') {
            initializeGallerySwipers();
        }
    });
}

scheduleViewportSync();
window.addEventListener('resize', scheduleViewportSync);
window.addEventListener('orientationchange', scheduleViewportSync);
window.addEventListener('app:viewport-resized', () => {
    syncGallerySwiperLayouts();
    syncActiveSnapSectionPosition();
});
window.visualViewport?.addEventListener('resize', scheduleViewportSync);
window.visualViewport?.addEventListener('scroll', scheduleViewportSync);

window.addEventListener('load', () => {
    scheduleViewportSync();

    if (typeof Swiper !== 'undefined') {
        initializeGallerySwipers();
        window.setTimeout(() => {
            initializeGallerySwipers();
        }, 0);
    }
});
