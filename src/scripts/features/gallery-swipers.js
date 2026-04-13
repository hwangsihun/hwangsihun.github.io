import { getViewportMode } from '../core/viewport.js';

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
        filterButtonSelector: '[data-main3-filter]',
        titleSelector: '.title_main3_panel, .text_main3_slide_title',
        scheduleSelector: '.text_main3_panel_schedule',
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

const MAIN2_DESKTOP_IMAGE_SOURCES = [
    '/assets/imgs/img/poster_1.png',
    '/assets/imgs/img/poster_2.png',
    '/assets/imgs/img/poster_3.png',
];

const MAIN2_MOBILE_IMAGE_SOURCES = [
    '/assets/imgs/img/example_1.png',
    '/assets/imgs/img/example_2.png',
    '/assets/imgs/img/example_3.png',
];

const MAIN2_SHARED_IMAGE_SOURCES = [
    '/assets/imgs/img/keyVisual_4.svg',
    '/assets/imgs/img/keyVisual_4_1.svg',
];

let hasInitializedGallerySwipers = false;
let main2WarmupPromise = null;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getMain2CriticalImageSources() {
    const main2SlideImageSources =
        getViewportMode() === 'mobile' ? MAIN2_MOBILE_IMAGE_SOURCES : MAIN2_DESKTOP_IMAGE_SOURCES;

    return [...main2SlideImageSources, ...MAIN2_SHARED_IMAGE_SOURCES];
}

function getGallerySlideDefinitions(mainSection, swiperContainer) {
    if (Array.isArray(mainSection.__gallerySlideDefinitions)) {
        return mainSection.__gallerySlideDefinitions;
    }

    const slideElements = Array.from(swiperContainer.querySelectorAll('.swiper-slide'));

    mainSection.__gallerySlideDefinitions = slideElements.map((slideElement) => ({
        html: slideElement.outerHTML,
        title: slideElement.dataset.title || slideElement.querySelector('img')?.alt || '',
        schedule: slideElement.dataset.schedule || '',
        category: slideElement.dataset.category || 'all',
    }));

    return mainSection.__gallerySlideDefinitions;
}

function getFilteredGallerySlides(slideDefinitions, filterValue) {
    if (filterValue === 'space') {
        return slideDefinitions.filter((slideDefinition) => slideDefinition.category === 'space');
    }

    if (filterValue === 'equipment') {
        return slideDefinitions.filter((slideDefinition) => slideDefinition.category === 'equipment');
    }

    return slideDefinitions;
}

function initializeGallerySwiper(config) {
    const mainSection = document.querySelector(config.sectionSelector);
    const swiperContainer = mainSection?.querySelector(config.swiperSelector);

    if (!mainSection || !swiperContainer) return;

    if (typeof mainSection.__cleanupGallerySwiper === 'function') {
        mainSection.__cleanupGallerySwiper();
    }

    const swiperWrapper = swiperContainer.querySelector('.swiper-wrapper');
    const activeFilter = mainSection.dataset.activeFilter || 'all';
    const filterButtons = config.filterButtonSelector
        ? Array.from(mainSection.querySelectorAll(config.filterButtonSelector))
        : [];
    const titleElements = config.titleSelector
        ? Array.from(mainSection.querySelectorAll(config.titleSelector))
        : [];
    const scheduleElements = config.scheduleSelector
        ? Array.from(mainSection.querySelectorAll(config.scheduleSelector))
        : [];
    const slideDefinitions = getGallerySlideDefinitions(mainSection, swiperContainer);
    const activeSlides = getFilteredGallerySlides(slideDefinitions, activeFilter);

    if (swiperWrapper && activeSlides.length > 0) {
        swiperWrapper.innerHTML = activeSlides.map((slideDefinition) => slideDefinition.html).join('');
    }

    const totalSlides = swiperContainer.querySelectorAll('.swiper-slide').length;

    if (!totalSlides) return;

    const progressTrack = mainSection.querySelector(config.progressSelector);
    const progressFill = mainSection.querySelector(config.progressFillSelector);
    const controlsRoot = config.controlsSelector
        ? mainSection.querySelector(config.controlsSelector)
        : null;
    const paginationButtons = controlsRoot?.querySelectorAll('[data-pagination-button]') ?? [];
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
    let isUserPaused = mainSection.dataset.galleryAutoplayPaused === 'true';
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
        const nextTitle = activeSlides[realIndex]?.title || activeSlides[0]?.title || '';
        const nextSchedule = activeSlides[realIndex]?.schedule || activeSlides[0]?.schedule || '';

        titleElements.forEach((titleElement) => {
            titleElement.textContent = nextTitle;
        });
        scheduleElements.forEach((scheduleElement) => {
            scheduleElement.textContent = nextSchedule;
        });

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
        toggleButton.setAttribute('aria-label', isUserPaused ? '재생' : '정지');
        toggleButton.dataset.icon = isUserPaused ? 'start' : 'stop';
    }

    function updateFilterState() {
        filterButtons.forEach((filterButton) => {
            const isActive = filterButton.dataset.main3Filter === activeFilter;

            filterButton.classList.toggle('is_active', isActive);
            filterButton.setAttribute('aria-pressed', String(isActive));
        });
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
        mainSection.dataset.galleryAutoplayPaused = String(isUserPaused);

        if (isUserPaused) {
            swiper.autoplay.stop();
        } else {
            swiper.autoplay.start();
        }

        updateToggleState();
    });

    filterButtons.forEach((filterButton) => {
        bind(filterButton, 'click', () => {
            const nextFilter = filterButton.dataset.main3Filter || 'all';

            if (nextFilter === activeFilter) return;

            mainSection.dataset.activeFilter = nextFilter;
            initializeGallerySwiper(config);
        });
    });

    bind(progressTrack, 'pointerdown', handleProgressPointerDown);
    bind(progressTrack, 'pointermove', handleProgressPointerMove);
    bind(progressTrack, 'pointerup', handleProgressPointerUp);
    bind(progressTrack, 'pointercancel', handleProgressPointerUp);
    bind(progressTrack, 'keydown', handleProgressKeydown);

    swiper.slideTo(0, 0, false);
    if (isUserPaused) {
        swiper.autoplay.stop();
    }
    updateFilterState();
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

function preloadImageSource(src) {
    return new Promise((resolve) => {
        const image = new Image();

        image.decoding = 'async';
        image.src = src;

        const finalize = () => resolve();

        if (image.complete) {
            image.decode?.().catch(() => {}).finally(finalize);
            return;
        }

        image.addEventListener(
            'load',
            () => {
                image.decode?.().catch(() => {}).finally(finalize);
            },
            { once: true },
        );
        image.addEventListener('error', finalize, { once: true });
    });
}

function preloadImageElement(imageElement) {
    if (!imageElement) {
        return Promise.resolve();
    }

    const finalize = () => Promise.resolve();
    const decodeImageElement = () => imageElement.decode?.().catch(() => {});

    if (imageElement.complete && imageElement.naturalWidth > 0) {
        return decodeImageElement().then(finalize);
    }

    return new Promise((resolve) => {
        const complete = () => {
            decodeImageElement().finally(resolve);
        };

        imageElement.addEventListener('load', complete, { once: true });
        imageElement.addEventListener('error', resolve, { once: true });
    });
}

function warmMain2RenderSurface() {
    const bannerElement = document.querySelector('#main-2 .container_banner');
    const swiperElement = document.querySelector('#main-2 .main2-swiper');
    const noticeGroupElement = document.querySelector('#main-2 .notice_group_pc');

    bannerElement?.getBoundingClientRect();
    swiperElement?.getBoundingClientRect();
    noticeGroupElement?.getBoundingClientRect();
}

export function syncGallerySwiperLayouts() {
    SWIPER_SECTION_CONFIGS.forEach((config) => {
        document.querySelector(config.sectionSelector)?.__syncGallerySwiperLayout?.();
    });
}

export function waitForMain2Warmup() {
    if (document.body?.dataset.main2WarmupReady === 'true') {
        return Promise.resolve();
    }

    if (main2WarmupPromise) {
        return main2WarmupPromise;
    }

    main2WarmupPromise = Promise.all(
        [
            ...getMain2CriticalImageSources().map((src) => preloadImageSource(src)),
            preloadImageElement(document.querySelector('#main-2 .icon_visual4')),
            preloadImageElement(document.querySelector('#main-2 .bgicon_noticeBanner_1')),
            preloadImageElement(document.querySelector('#main-2 .bgicon_noticeBanner_2')),
            preloadImageElement(document.querySelector('#main-2 .bgicon_noticeBanner_3')),
            ...Array.from(
                document.querySelectorAll('#main-2 .main2-swiper .swiper-slide img'),
            ).map((imageElement) => preloadImageElement(imageElement)),
        ],
    ).then(
        () =>
            new Promise((resolve) => {
                warmMain2RenderSurface();

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        document.body.dataset.main2WarmupReady = 'true';
                        resolve();
                    });
                });
            }),
    );

    return main2WarmupPromise;
}

export function preloadMain2Assets() {
    if (document.body?.dataset.main2AssetsPreloaded === 'true') return waitForMain2Warmup();

    document.body.dataset.main2AssetsPreloaded = 'true';
    return waitForMain2Warmup();
}

export function ensureGallerySwipersInitialized() {
    if (hasInitializedGallerySwipers || typeof Swiper === 'undefined') return;

    initializeGallerySwipers();
    hasInitializedGallerySwipers = true;
}
