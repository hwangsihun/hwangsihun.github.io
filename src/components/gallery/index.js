function initializeGallerySwiper() {
    const mainSection = document.querySelector('#main-2');
    const swiperContainer = mainSection?.querySelector('.main2-swiper');
    const controlsRoot = mainSection?.querySelector('.wrapper_pagination_pc');

    if (!mainSection || !swiperContainer) return;

    if (swiperContainer.swiper) {
        swiperContainer.swiper.destroy(true, true);
    }

    const totalSlides = swiperContainer.querySelectorAll('.swiper-slide').length;
    const progressFill = mainSection.querySelector('.main2-swiper-progress-fill');
    const paginationButtons = controlsRoot?.querySelectorAll('.btn_pagination_pc');
    const prevButton = paginationButtons?.[0];
    const toggleButton = paginationButtons?.[1];
    const nextButton = paginationButtons?.[2];
    let isUserPaused = false;

    const swiper = new Swiper(swiperContainer, {
        direction: 'horizontal',
        loop: false,
        rewind: true,
        initialSlide: totalSlides - 1,
        slidesPerView: 1,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            reverseDirection: true,
        },
        pagination: {
            el: mainSection.querySelector('.main2-swiper-pagination'),
            clickable: false,
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
        const currentIndex = totalSlides - swiper.realIndex;

        if (progressFill) {
            const segmentWidth = 100 / totalSlides;
            const segmentOffset = (currentIndex - 1) * segmentWidth;

            progressFill.style.width = `${segmentWidth}%`;
            progressFill.style.left = `${segmentOffset}%`;
        }
    }

    function updateToggleState() {
        if (!toggleButton) return;

        toggleButton.classList.toggle('is_paused', isUserPaused);
        toggleButton.setAttribute('aria-label', isUserPaused ? '재생' : '정지');
    }

    prevButton?.addEventListener('click', () => {
        swiper.slideNext();
    });

    nextButton?.addEventListener('click', () => {
        swiper.slidePrev();
    });

    swiper.slideTo(totalSlides - 1, 0, false);
    updateSlideState();
    updateToggleState();

    swiper.on('slideChange', updateSlideState);

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

        updateToggleState();
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
    if (typeof Swiper !== 'undefined') {
        initializeGallerySwiper();
    }
});