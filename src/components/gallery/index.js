function initializeGallerySwiper() {
    const mainSection = document.querySelector('#main-2');
    const swiperContainer = mainSection?.querySelector('.main2-swiper');

    if (!mainSection || !swiperContainer) return;

    const totalSlides = swiperContainer.querySelectorAll('.swiper-slide').length;
    const progressFill = mainSection.querySelector('.main2-swiper-progress-fill');
    const toggleButton = mainSection.querySelector('.main2-swiper-toggle');
    const toggleIcon = toggleButton?.querySelector('[data-role="toggle-icon"]');
    let isUserPaused = false;

    const swiper = new Swiper(swiperContainer, {
        direction: 'horizontal',
        loop: true,
        loopFillGroupWithBlank: false,
        slidesPerView: 1,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: mainSection.querySelector('.main2-swiper-pagination'),
            type: 'bullets',
            clickable: true,
        },
        navigation: {
            nextEl: mainSection.querySelector('.main2-swiper-next'),
            prevEl: mainSection.querySelector('.main2-swiper-prev'),
        },
        effect: 'slide',
        speed: 800,
        grabCursor: true,
        allowTouchMove: true,
        simulateTouch: true,
        touchRatio: 1,
        touchAngle: 45,
        touchEventsTarget: 'wrapper',
    });

    function updateSlideState() {
        const currentSlideEl = mainSection.querySelector('.current-slide');
        const totalSlidesEl = mainSection.querySelector('.total-slides');
        const currentIndex = (swiper.realIndex % totalSlides) + 1;

        if (currentSlideEl && totalSlidesEl) {
            currentSlideEl.textContent = String(currentIndex).padStart(2, '0');
            totalSlidesEl.textContent = String(totalSlides).padStart(2, '0');
        }

        if (progressFill) {
            const segmentWidth = 100 / totalSlides;
            const segmentOffset = (currentIndex - 1) * segmentWidth;

            progressFill.style.width = `${segmentWidth}%`;
            progressFill.style.left = `${segmentOffset}%`;
        }
    }

    function updateToggleIcon() {
        if (!toggleButton || !toggleIcon) return;

        toggleIcon.textContent = isUserPaused ? '\u25B6' : '\u2016';
        toggleButton.setAttribute('aria-label', isUserPaused ? 'play slide' : 'pause slide');
    }

    updateSlideState();
    updateToggleIcon();

    swiper.on('slideChange', () => {
        updateSlideState();
    });

    swiperContainer.addEventListener('mouseenter', () => {
        if (!isUserPaused) {
            swiper.autoplay.stop();
        }
    });

    swiperContainer.addEventListener('mouseleave', () => {
        if (!isUserPaused) {
            swiper.autoplay.start();
        }
    });

    toggleButton?.addEventListener('click', () => {
        isUserPaused = !isUserPaused;

        if (isUserPaused) {
            swiper.autoplay.stop();
        } else {
            swiper.autoplay.start();
        }

        updateToggleIcon();
    });
}

if (typeof Swiper !== 'undefined') {
    initializeGallerySwiper();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof Swiper !== 'undefined') {
            initializeGallerySwiper();
        }
    });
}

window.addEventListener('load', () => {
    if (typeof Swiper !== 'undefined' && !document.querySelector('#main-2 .swiper-initialized')) {
        initializeGallerySwiper();
    }
});
