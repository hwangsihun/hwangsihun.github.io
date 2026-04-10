import './components/common/pagination/index.js';
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

const SNAP_SECTION_SELECTOR = '.snap_section, .snap_visual_section, .footer_section';
const SNAP_MIN_WIDTH = 768;
const SNAP_MIN_HEIGHT = 901;
const HEADER_SUBMENU_ITEMS = {
    akl: [
        { label: '소개', target: '#main-1' },
        { label: '공간/시설', target: '#main-3' },
        { label: '프로그램', target: '#main-4' },
        { label: '입주기업', target: '#main-5' },
    ],
    rental: [
        { label: '공간/시설', target: '#main-3' },
        { label: '대관 안내', target: '#main-3' },
        { label: '이용 안내', target: '#main-3' },
    ],
    biz: [
        { label: '프로그램', target: '#main-4' },
        { label: '비즈컨설팅', target: '#main-1' },
        { label: '입주기업', target: '#main-5' },
    ],
    community: [
        { label: '공지사항', target: '#main-2' },
        { label: '공모소식', target: '#main-2' },
        { label: '뉴스레터', target: '#main-2' },
    ],
    archive: [
        { label: '페스티벌', target: '#main-4' },
        { label: '기술용어 사전', target: '#main-4' },
        { label: '자료실', target: '#main-5' },
    ],
};

const MOBILE_SIDEBAR_MENU_ITEMS = [
    { id: 'akl', label: '아트코리아랩', items: HEADER_SUBMENU_ITEMS.akl },
    { id: 'rental', label: '대관/시설', items: HEADER_SUBMENU_ITEMS.rental },
    { id: 'biz', label: '비즈센터', items: HEADER_SUBMENU_ITEMS.biz },
    { id: 'community', label: '커뮤니티', items: HEADER_SUBMENU_ITEMS.community },
    { id: 'archive', label: '아카이브', items: HEADER_SUBMENU_ITEMS.archive },
    {
        id: 'mypage',
        label: '마이페이지',
        items: [{ label: '신청 내역' }, { label: '관심 프로그램' }, { label: '회원정보' }],
    },
];

const MOBILE_SIDEBAR_ACCORDION_DURATION = 280;

const MAIN2_PRELOAD_IMAGE_SOURCES = [
    '/assets/imgs/img/example_1.png',
    '/assets/imgs/img/example_2.png',
    '/assets/imgs/img/example_3.png',
    '/assets/imgs/img/keyVisual_4.svg',
    '/assets/imgs/img/keyVisual_4_1.svg',
];

function getViewportMode(viewportWidth = window.innerWidth) {
    return viewportWidth >= 768 ? 'pc' : 'mobile';
}

let previousViewportWidth = null;
let previousViewportHeight = null;
let previousViewportMode = null;

function syncViewportSize() {
    const viewportHeight = Math.round(window.visualViewport?.height || window.innerHeight);
    const viewportWidth = Math.round(window.visualViewport?.width || window.innerWidth);
    const nextViewportMode = getViewportMode(viewportWidth);
    const lastViewportWidth = previousViewportWidth ?? viewportWidth;
    const lastViewportHeight = previousViewportHeight ?? viewportHeight;
    const lastViewportMode = previousViewportMode ?? nextViewportMode;

    document.documentElement.style.setProperty('--app-height', `${viewportHeight}px`);
    document.documentElement.style.setProperty('--app-width', `${viewportWidth}px`);

    window.dispatchEvent(
        new CustomEvent('app:viewport-resized', {
            detail: {
                height: viewportHeight,
                width: viewportWidth,
                previousHeight: lastViewportHeight,
                previousWidth: lastViewportWidth,
                mode: nextViewportMode,
                previousMode: lastViewportMode,
                heightChanged: viewportHeight !== lastViewportHeight,
                widthChanged: viewportWidth !== lastViewportWidth,
                modeChanged: nextViewportMode !== lastViewportMode,
            },
        }),
    );

    previousViewportHeight = viewportHeight;
    previousViewportWidth = viewportWidth;
    previousViewportMode = nextViewportMode;
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
        toggleButton.setAttribute('aria-label', isUserPaused ? '\uC7AC\uC0DD' : '\uC815\uC9C0');
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

function syncGallerySwiperLayouts() {
    SWIPER_SECTION_CONFIGS.forEach((config) => {
        document.querySelector(config.sectionSelector)?.__syncGallerySwiperLayout?.();
    });
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

function preloadMain2Assets() {
    if (document.body?.dataset.main2AssetsPreloaded === 'true') return;

    document.body.dataset.main2AssetsPreloaded = 'true';
    MAIN2_PRELOAD_IMAGE_SOURCES.forEach((src) => {
        preloadImageSource(src);
    });
}

let hasInitializedGallerySwipers = false;

function ensureGallerySwipersInitialized() {
    if (hasInitializedGallerySwipers || typeof Swiper === 'undefined') return;

    initializeGallerySwipers();
    hasInitializedGallerySwipers = true;
}

function getSnapRoot() {
    return document.querySelector('.snap_page');
}

function getSnapSections(snapRoot = getSnapRoot()) {
    return Array.from(snapRoot?.querySelectorAll(SNAP_SECTION_SELECTOR) || []);
}

function getSnapSectionScrollTop(snapRoot, section) {
    if (!snapRoot || !section) return 0;

    const alignToViewportBottom =
        section.classList.contains('footer_section') ||
        section.dataset.snapAlign === 'end';
    const sectionScrollTop = alignToViewportBottom
        ? section.offsetTop + section.offsetHeight - snapRoot.clientHeight
        : section.offsetTop;

    return Math.max(0, Math.min(snapRoot.scrollHeight - snapRoot.clientHeight, sectionScrollTop));
}

function getClosestSnapSectionState(snapRoot, sections = getSnapSections(snapRoot)) {
    if (!snapRoot || !sections.length) return null;

    return sections.reduce(
        (closestSectionState, section, index) => {
            const sectionScrollTop = getSnapSectionScrollTop(snapRoot, section);
            const distance = Math.abs(snapRoot.scrollTop - sectionScrollTop);

            if (distance < closestSectionState.distance) {
                return {
                    section,
                    index,
                    distance,
                    scrollTop: sectionScrollTop,
                };
            }

            return closestSectionState;
        },
        {
            section: sections[0],
            index: 0,
            distance: Number.POSITIVE_INFINITY,
            scrollTop: getSnapSectionScrollTop(snapRoot, sections[0]),
        },
    );
}

function getSnapViewportHeight() {
    return window.visualViewport?.height || window.innerHeight;
}

function isSnapScrollEnabled() {
    return window.innerWidth >= SNAP_MIN_WIDTH && getSnapViewportHeight() >= SNAP_MIN_HEIGHT;
}

function syncActiveSnapSectionPosition() {
    const snapRoot = getSnapRoot();

    if (!snapRoot || !isSnapScrollEnabled()) return;

    const sections = getSnapSections(snapRoot);

    if (!sections.length) return;

    requestAnimationFrame(() => {
        const activeSectionState = getClosestSnapSectionState(snapRoot, sections);

        if (!activeSectionState) return;

        snapRoot.scrollTop = activeSectionState.scrollTop;
    });
}

function initializeSideSectionNavigation() {
    const sideSectionNavigation = document.querySelector('.container_side_section_navigation');
    const snapRoot = getSnapRoot();
    const currentSectionText = sideSectionNavigation?.querySelector('.text_section_nav_current');
    const sectionNavButtons = Array.from(
        sideSectionNavigation?.querySelectorAll('.btn_section_nav_dot[data-section-nav-target]') || [],
    );

    if (
        !sideSectionNavigation ||
        !snapRoot ||
        !currentSectionText ||
        !sectionNavButtons.length ||
        sideSectionNavigation.dataset.sideSectionNavInitialized === 'true'
    ) {
        return;
    }

    const sectionNavigationItems = sectionNavButtons
        .map((sectionNavButton) => {
            const targetSection = document.querySelector(sectionNavButton.dataset.sectionNavTarget);

            if (!targetSection) return null;

            return {
                button: sectionNavButton,
                section: targetSection,
            };
        })
        .filter(Boolean);

    if (!sectionNavigationItems.length) return;

    let sideSectionNavUpdateFrame = 0;

    function updateActiveSectionNavigation() {
        const activeSectionState = getClosestSnapSectionState(
            snapRoot,
            sectionNavigationItems.map((sectionNavigationItem) => sectionNavigationItem.section),
        );
        const activeSectionIndex = sectionNavigationItems.findIndex(
            (sectionNavigationItem) => sectionNavigationItem.section === activeSectionState?.section,
        );
        const nextActiveIndex = activeSectionIndex === -1 ? 0 : activeSectionIndex;

        sectionNavigationItems.forEach((sectionNavigationItem, sectionIndex) => {
            const isActive = sectionIndex === nextActiveIndex;

            sectionNavigationItem.button.classList.toggle('is_active', isActive);

            if (isActive) {
                sectionNavigationItem.button.setAttribute('aria-current', 'true');
            } else {
                sectionNavigationItem.button.removeAttribute('aria-current');
            }
        });

        currentSectionText.textContent = String(nextActiveIndex + 1);
    }

    function scheduleSectionNavigationUpdate() {
        cancelAnimationFrame(sideSectionNavUpdateFrame);
        sideSectionNavUpdateFrame = requestAnimationFrame(updateActiveSectionNavigation);
    }

    sectionNavigationItems.forEach((sectionNavigationItem) => {
        sectionNavigationItem.button.addEventListener('click', () => {
            snapRoot.scrollTo({
                top: getSnapSectionScrollTop(snapRoot, sectionNavigationItem.section),
                behavior: 'smooth',
            });
        });
    });

    snapRoot.addEventListener('scroll', scheduleSectionNavigationUpdate, { passive: true });
    window.addEventListener('app:viewport-resized', scheduleSectionNavigationUpdate);

    sideSectionNavigation.dataset.sideSectionNavInitialized = 'true';
    updateActiveSectionNavigation();
}

function initializeScrollTopButton() {
    const scrollTopButton = document.querySelector('.btn_scroll_top');
    const snapRoot = getSnapRoot();

    if (!scrollTopButton || !snapRoot || scrollTopButton.dataset.scrollTopInitialized === 'true') return;

    scrollTopButton.addEventListener('click', () => {
        snapRoot.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });

    scrollTopButton.dataset.scrollTopInitialized = 'true';
}

function initializeGlobalHeader() {
    const headerElement = document.querySelector('.container_header_global');
    const snapRoot = getSnapRoot();
    const headerGnbHolder = headerElement?.querySelector('[data-header-gnb]');
    const headerGnbBar = headerElement?.querySelector('.wrapper_header_gnb');
    const headerLogoButtons = Array.from(document.querySelectorAll('.btn_header_logo[data-header-target]'));
    const headerMenuButtons = Array.from(headerElement?.querySelectorAll('.btn_header_gnb[data-header-menu]') || []);
    const submenuContainer = headerElement?.querySelector('.container_header_submenu');
    const submenuList = headerElement?.querySelector('[data-header-submenu-list]');

    if (!headerElement || !snapRoot || !headerGnbHolder || !headerGnbBar || !submenuContainer || !submenuList || headerElement.dataset.headerInitialized === 'true') return;

    let headerUpdateFrame = 0;
    let activeMenuButton = null;

    headerMenuButtons.forEach((headerMenuButton, menuIndex) => {
        if (!headerMenuButton.id) {
            headerMenuButton.id = `header-gnb-button-${menuIndex + 1}`;
        }
    });

    function closeSubmenu(options = {}) {
        const { restoreFocus = false } = options;
        const previousActiveMenuButton = activeMenuButton;

        activeMenuButton = null;
        submenuContainer.hidden = true;
        submenuList.innerHTML = '';
        submenuList.removeAttribute('aria-labelledby');
        headerElement.classList.remove('is_submenu_open');

        headerMenuButtons.forEach((headerMenuButton) => {
            headerMenuButton.classList.remove('is_active');
            headerMenuButton.setAttribute('aria-expanded', 'false');
        });

        if (restoreFocus) {
            previousActiveMenuButton?.focus();
        }
    }

    function openSubmenu(menuButton) {
        if (!menuButton || getViewportMode() !== 'pc') return;

        const submenuItems = HEADER_SUBMENU_ITEMS[menuButton.dataset.headerMenu] || [];

        if (!submenuItems.length) {
            closeSubmenu();
            return;
        }

        activeMenuButton = menuButton;
        submenuList.innerHTML = '';

        const submenuFragment = document.createDocumentFragment();
        submenuItems.forEach((submenuItem) => {
            const submenuButton = document.createElement('button');

            submenuButton.type = 'button';
            submenuButton.className = 'btn_header_submenu';
            submenuButton.textContent = submenuItem.label;
            submenuButton.dataset.headerTarget = submenuItem.target;
            submenuFragment.appendChild(submenuButton);
        });

        submenuList.appendChild(submenuFragment);
        submenuList.setAttribute('aria-labelledby', menuButton.id);
        syncSubmenuWidth();
        submenuContainer.hidden = false;
        headerElement.classList.add('is_submenu_open');

        headerMenuButtons.forEach((headerMenuButton) => {
            const isActive = headerMenuButton === menuButton;

            headerMenuButton.classList.toggle('is_active', isActive);
            headerMenuButton.setAttribute('aria-expanded', String(isActive));
        });
    }

    function moveMenuFocus(step) {
        if (!headerMenuButtons.length) return;

        const activeIndex = headerMenuButtons.findIndex(
            (headerMenuButton) => headerMenuButton === document.activeElement,
        );
        const nextIndex =
            activeIndex === -1
                ? 0
                : (activeIndex + step + headerMenuButtons.length) % headerMenuButtons.length;

        headerMenuButtons[nextIndex]?.focus();
    }

    function focusSubmenuButton(step) {
        const submenuButtons = Array.from(submenuList.querySelectorAll('.btn_header_submenu'));

        if (!submenuButtons.length) return;

        const activeIndex = submenuButtons.findIndex((submenuButton) => submenuButton === document.activeElement);
        const nextIndex =
            activeIndex === -1
                ? 0
                : (activeIndex + step + submenuButtons.length) % submenuButtons.length;

        submenuButtons[nextIndex]?.focus();
    }

    function syncSubmenuWidth() {
        const gnbWidth = headerGnbBar.offsetWidth;

        if (!gnbWidth) return;

        headerGnbHolder.style.setProperty('--header-gnb-width', `${gnbWidth}px`);
    }

    function updateHeaderState() {
        syncSubmenuWidth();

        if (getViewportMode() !== 'pc') {
            closeSubmenu();
        }
    }

    function scheduleHeaderUpdate() {
        cancelAnimationFrame(headerUpdateFrame);
        headerUpdateFrame = requestAnimationFrame(updateHeaderState);
    }

    function scrollToHeaderTarget(targetSelector) {
        const targetSection = document.querySelector(targetSelector);

        if (!targetSection) return;

        snapRoot.scrollTo({
            top: getSnapSectionScrollTop(snapRoot, targetSection),
            behavior: 'smooth',
        });
    }

    headerMenuButtons.forEach((headerMenuButton) => {
        headerMenuButton.addEventListener('pointerenter', () => {
            openSubmenu(headerMenuButton);
        });

        headerMenuButton.addEventListener('focusin', () => {
            openSubmenu(headerMenuButton);
        });

        headerMenuButton.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                moveMenuFocus(1);
                event.preventDefault();
            }

            if (event.key === 'ArrowLeft') {
                moveMenuFocus(-1);
                event.preventDefault();
            }

            if (event.key === 'Home') {
                headerMenuButtons[0]?.focus();
                event.preventDefault();
            }

            if (event.key === 'End') {
                headerMenuButtons.at(-1)?.focus();
                event.preventDefault();
            }

            if (event.key === 'ArrowDown') {
                openSubmenu(headerMenuButton);
                requestAnimationFrame(() => {
                    submenuList.querySelector('.btn_header_submenu')?.focus();
                });
                event.preventDefault();
            }
        });
    });

    headerElement.addEventListener('click', (event) => {
        const headerTargetButton = event.target.closest('[data-header-target]');

        if (!headerTargetButton) return;

        const targetSelector = headerTargetButton.dataset.headerTarget;
        scrollToHeaderTarget(targetSelector);

        if (headerTargetButton.classList.contains('btn_header_submenu')) {
            closeSubmenu();
        }
    });

    headerLogoButtons.forEach((headerLogoButton) => {
        headerLogoButton.addEventListener('click', () => {
            scrollToHeaderTarget(headerLogoButton.dataset.headerTarget);
        });
    });

    submenuList.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            focusSubmenuButton(1);
            event.preventDefault();
        }

        if (event.key === 'ArrowLeft') {
            focusSubmenuButton(-1);
            event.preventDefault();
        }

        if (event.key === 'Home') {
            submenuList.querySelector('.btn_header_submenu')?.focus();
            event.preventDefault();
        }

        if (event.key === 'End') {
            submenuList.querySelector('.btn_header_submenu:last-child')?.focus();
            event.preventDefault();
        }

        if (event.key === 'ArrowUp') {
            activeMenuButton?.focus();
            event.preventDefault();
        }
    });

    headerGnbHolder.addEventListener('pointerleave', () => {
        closeSubmenu();
    });

    headerGnbHolder.addEventListener('focusout', () => {
        requestAnimationFrame(() => {
            if (!headerGnbHolder.contains(document.activeElement)) {
                closeSubmenu();
            }
        });
    });

    headerElement.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;

        closeSubmenu({ restoreFocus: true });
    });

    snapRoot.addEventListener('scroll', scheduleHeaderUpdate, { passive: true });
    window.addEventListener('app:viewport-resized', scheduleHeaderUpdate);

    headerElement.dataset.headerInitialized = 'true';
    closeSubmenu();
    scheduleHeaderUpdate();
}

function initializeMain4FunctionGrid() {
    const functionGrid = document.querySelector('.wrapper_main4_function_grid');
    const functionCards = Array.from(functionGrid?.querySelectorAll('.wrapper_main4_function_card') || []);

    if (!functionGrid || !functionCards.length) return;

    const activeCard = functionGrid.querySelector('.wrapper_main4_function_card.is_active');

    if (!activeCard) {
        functionCards[0]?.classList.add('is_active');
    }

    if (functionGrid.dataset.main4FunctionGridInitialized === 'true') return;

    function setActiveCard(nextActiveCard) {
        if (!nextActiveCard) return;

        functionCards.forEach((functionCard) => {
            functionCard.classList.toggle('is_active', functionCard === nextActiveCard);
        });
    }

    functionCards.forEach((functionCard) => {
        functionCard.addEventListener('pointerenter', () => {
            setActiveCard(functionCard);
        });

        functionCard.addEventListener('focusin', () => {
            setActiveCard(functionCard);
        });
    });

    functionGrid.dataset.main4FunctionGridInitialized = 'true';
}

function initializeMain4PartnersMarquee() {
    const marqueeElement = document.querySelector('.wrapper_main4_partners_marquee');
    const marqueeTrack = marqueeElement?.querySelector('.wrapper_main4_partners_track');
    const sourceGroup = marqueeTrack?.querySelector('.wrapper_main4_partners_group');

    if (!marqueeElement || !marqueeTrack || !sourceGroup) return;

    const clonedGroups = Array.from(marqueeTrack.querySelectorAll('.wrapper_main4_partners_group')).slice(1);
    clonedGroups.forEach((clonedGroup) => clonedGroup.remove());

    const trackGap = parseFloat(window.getComputedStyle(marqueeTrack).gap || '0');
    const sourceWidth = Math.ceil(sourceGroup.getBoundingClientRect().width);

    if (!sourceWidth) return;

    const cycleWidth = sourceWidth + trackGap;
    const viewportWidth = window.innerWidth;
    const requiredCopies = Math.max(3, Math.ceil((viewportWidth * 2 + cycleWidth) / cycleWidth));

    for (let copyIndex = 1; copyIndex < requiredCopies; copyIndex += 1) {
        const clonedGroup = sourceGroup.cloneNode(true);
        clonedGroup.setAttribute('aria-hidden', 'true');

        clonedGroup.querySelectorAll('img').forEach((imageElement) => {
            imageElement.alt = '';
        });

        marqueeTrack.appendChild(clonedGroup);
    }

    marqueeTrack.style.setProperty('--main4-partners-cycle-width', `${cycleWidth}px`);
}

function initializeFooterFamilySite() {
    const familySiteRoot = document.querySelector('.wrapper_footer_family_site');
    const familySiteButton = familySiteRoot?.querySelector('.btn_footer_family_site');
    const familySiteLinks = familySiteRoot?.querySelector('.wrapper_footer_family_links');
    const familySiteItems = Array.from(familySiteRoot?.querySelectorAll('.btn_footer_family_link') || []);

    if (
        !familySiteRoot ||
        !familySiteButton ||
        !familySiteLinks ||
        !familySiteItems.length ||
        familySiteRoot.dataset.familySiteInitialized === 'true'
    ) {
        return;
    }

    function setExpanded(isExpanded) {
        familySiteRoot.classList.toggle('is_open', isExpanded);
        familySiteButton.setAttribute('aria-expanded', String(isExpanded));
        familySiteLinks.hidden = !isExpanded;
    }

    familySiteButton.addEventListener('click', () => {
        const nextExpanded = familySiteButton.getAttribute('aria-expanded') !== 'true';
        setExpanded(nextExpanded);

        if (nextExpanded) {
            familySiteItems[0]?.focus();
        }
    });

    familySiteButton.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
            setExpanded(true);
            familySiteItems[0]?.focus();
            event.preventDefault();
        }
    });

    familySiteLinks.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setExpanded(false);
            familySiteButton.focus();
            event.preventDefault();
        }
    });

    familySiteRoot.addEventListener('focusout', () => {
        requestAnimationFrame(() => {
            if (!familySiteRoot.contains(document.activeElement)) {
                setExpanded(false);
            }
        });
    });

    familySiteRoot.dataset.familySiteInitialized = 'true';
    setExpanded(false);
}

function renderMobileSidebarMenu(sidebarList) {
    if (!sidebarList || sidebarList.dataset.mobileSidebarRendered === 'true') return;

    const fragment = document.createDocumentFragment();

    MOBILE_SIDEBAR_MENU_ITEMS.forEach((menuItem) => {
        const itemElement = document.createElement('li');
        const toggleButton = document.createElement('button');
        const labelElement = document.createElement('span');
        const iconElement = document.createElement('span');
        const horizontalLineElement = document.createElement('span');
        const verticalLineElement = document.createElement('span');
        const panelElement = document.createElement('ul');

        itemElement.className = 'item_mobile_sidebar_menu';

        toggleButton.type = 'button';
        toggleButton.className = 'btn_mobile_sidebar_menu flex_row_between bg_white';
        toggleButton.dataset.mobileSidebarToggle = menuItem.id;
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.setAttribute('aria-controls', `mobile-sidebar-panel-${menuItem.id}`);

        labelElement.className = 'text_mobile_sidebar_menu';
        labelElement.textContent = menuItem.label;

        iconElement.className = 'icon_mobile_sidebar_toggle';
        iconElement.setAttribute('aria-hidden', 'true');

        horizontalLineElement.className =
            'line_mobile_sidebar_toggle line_mobile_sidebar_toggle_horizontal';
        verticalLineElement.className =
            'line_mobile_sidebar_toggle line_mobile_sidebar_toggle_vertical';

        iconElement.appendChild(horizontalLineElement);
        iconElement.appendChild(verticalLineElement);
        toggleButton.appendChild(labelElement);
        toggleButton.appendChild(iconElement);

        panelElement.className = 'list_mobile_sidebar_submenu flex_col_start bg_lightGray';
        panelElement.id = `mobile-sidebar-panel-${menuItem.id}`;
        panelElement.hidden = true;

        menuItem.items.forEach((submenuItem) => {
            const submenuListItem = document.createElement('li');
            const submenuButton = document.createElement('button');

            submenuListItem.className = 'item_mobile_sidebar_submenu';
            submenuButton.type = 'button';
            submenuButton.className = 'btn_mobile_sidebar_submenu';
            submenuButton.textContent = submenuItem.label;

            if (submenuItem.target) {
                submenuButton.dataset.headerTarget = submenuItem.target;
            }

            submenuListItem.appendChild(submenuButton);
            panelElement.appendChild(submenuListItem);
        });

        itemElement.appendChild(toggleButton);
        itemElement.appendChild(panelElement);
        fragment.appendChild(itemElement);
    });

    sidebarList.appendChild(fragment);
    sidebarList.dataset.mobileSidebarRendered = 'true';
}

function initializeMobileSidebarMenu() {
    const sidebar = document.querySelector('[data-mobile-sidebar]');
    const sidebarList = sidebar?.querySelector('[data-mobile-sidebar-list]');
    const openButton = document.querySelector('.btn_header_menu');
    const closeButton = sidebar?.querySelector('[data-mobile-sidebar-close]');
    const snapRoot = getSnapRoot();

    if (
        !sidebar ||
        !sidebarList ||
        !openButton ||
        !closeButton ||
        !snapRoot ||
        sidebar.dataset.mobileSidebarInitialized === 'true'
    ) {
        return;
    }

    renderMobileSidebarMenu(sidebarList);

    const accordionButtons = Array.from(sidebarList.querySelectorAll('[data-mobile-sidebar-toggle]'));
    const submenuButtons = Array.from(sidebarList.querySelectorAll('.btn_mobile_sidebar_submenu'));

    function getSidebarFocusableElements() {
        return Array.from(
            sidebar.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'),
        ).filter((element) => !element.closest('[hidden]'));
    }

    function syncOpenButtonState(isOpen) {
        const openButtonIcon = openButton.querySelector('.icon_header_menu');

        openButton.setAttribute('aria-expanded', String(isOpen));
        openButton.setAttribute('aria-label', isOpen ? '전체 메뉴 닫기' : '전체 메뉴');

        if (openButtonIcon) {
            openButtonIcon.src = isOpen ? '/assets/imgs/icons/close.svg' : '/assets/imgs/icons/sideMenu.svg';
        }
    }

    function setAccordionExpanded(button, isExpanded, options = {}) {
        const { immediate = false } = options;
        const panelId = button.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;

        if (!panel) return;

        button.setAttribute('aria-expanded', String(isExpanded));
        window.clearTimeout(panel.__hideTimer);

        if (immediate) {
            panel.classList.toggle('is_open', isExpanded);
            panel.hidden = !isExpanded;
            return;
        }

        if (isExpanded) {
            panel.hidden = false;
            requestAnimationFrame(() => {
                panel.classList.add('is_open');
            });
            return;
        }

        panel.classList.remove('is_open');
        panel.__hideTimer = window.setTimeout(() => {
            if (button.getAttribute('aria-expanded') === 'false') {
                panel.hidden = true;
            }
        }, MOBILE_SIDEBAR_ACCORDION_DURATION);
    }

    function closeAllAccordions(exceptButton = null, options = {}) {
        accordionButtons.forEach((button) => {
            if (button === exceptButton) return;

            setAccordionExpanded(button, false, options);
        });
    }

    function setSidebarOpen(isOpen, options = {}) {
        const { restoreFocus = true } = options;

        if (isOpen && getViewportMode() !== 'mobile') return;

        if (isOpen) {
            closeAllAccordions(null, { immediate: true });
        }

        sidebar.hidden = !isOpen;
        sidebar.setAttribute('aria-hidden', String(!isOpen));
        document.body.classList.toggle('is_mobile_sidebar_open', isOpen);
        syncOpenButtonState(isOpen);

        if (isOpen) {
            requestAnimationFrame(() => {
                closeButton.focus();
            });
            return;
        }

        closeAllAccordions(null, { immediate: true });

        if (restoreFocus) {
            openButton.focus();
        }
    }

    openButton.addEventListener('click', () => {
        if (getViewportMode() !== 'mobile') return;

        const shouldOpen = openButton.getAttribute('aria-expanded') !== 'true';
        setSidebarOpen(shouldOpen);
    });

    closeButton.addEventListener('click', () => {
        setSidebarOpen(false);
    });

    accordionButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const shouldExpand = button.getAttribute('aria-expanded') !== 'true';

            closeAllAccordions(button);
            setAccordionExpanded(button, shouldExpand);
        });
    });

    submenuButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const targetSelector = button.dataset.headerTarget;
            const targetSection = targetSelector ? document.querySelector(targetSelector) : null;

            setSidebarOpen(false, { restoreFocus: false });

            if (!targetSection) return;

            snapRoot.scrollTo({
                top: getSnapSectionScrollTop(snapRoot, targetSection),
                behavior: 'smooth',
            });
        });
    });

    sidebar.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setSidebarOpen(false);
            event.preventDefault();
            return;
        }

        if (event.key !== 'Tab') return;

        const focusableElements = getSidebarFocusableElements();

        if (!focusableElements.length) return;

        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements.at(-1);

        if (event.shiftKey && document.activeElement === firstFocusableElement) {
            lastFocusableElement?.focus();
            event.preventDefault();
        }

        if (!event.shiftKey && document.activeElement === lastFocusableElement) {
            firstFocusableElement?.focus();
            event.preventDefault();
        }
    });

    window.addEventListener('app:viewport-resized', () => {
        if (getViewportMode() !== 'mobile' && openButton.getAttribute('aria-expanded') === 'true') {
            setSidebarOpen(false, { restoreFocus: false });
        }
    });

    sidebar.dataset.mobileSidebarInitialized = 'true';
    syncOpenButtonState(false);
    closeAllAccordions(null, { immediate: true });
    setSidebarOpen(false, { restoreFocus: false });
}

if (typeof Swiper !== 'undefined') {
    ensureGallerySwipersInitialized();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        ensureGallerySwipersInitialized();
    });
}

initializeMain4FunctionGrid();
initializeMain4PartnersMarquee();
initializeSideSectionNavigation();
initializeScrollTopButton();
initializeGlobalHeader();
initializeFooterFamilySite();
initializeMobileSidebarMenu();
preloadMain2Assets();

scheduleViewportSync();
window.addEventListener('resize', scheduleViewportSync);
window.addEventListener('orientationchange', scheduleViewportSync);
window.addEventListener('app:viewport-resized', (event) => {
    const { widthChanged = false, heightChanged = false, modeChanged = false } = event.detail || {};

    if (!widthChanged && !heightChanged && !modeChanged) {
        return;
    }

    syncGallerySwiperLayouts();
    syncActiveSnapSectionPosition();
    initializeMain4PartnersMarquee();
});
window.visualViewport?.addEventListener('resize', scheduleViewportSync);

window.addEventListener('load', () => {
    scheduleViewportSync();
    initializeMain4FunctionGrid();
    initializeMain4PartnersMarquee();
    initializeSideSectionNavigation();
    initializeScrollTopButton();
    initializeGlobalHeader();
    initializeFooterFamilySite();
    initializeMobileSidebarMenu();
    preloadMain2Assets();

    ensureGallerySwipersInitialized();
});





