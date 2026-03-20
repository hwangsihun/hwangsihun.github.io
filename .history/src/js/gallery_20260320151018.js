// Swiper Gallery Initialization
// Swiper 라이브러리가 로드된 후 초기화
function initializeGallerySwiper() {
    const swiperContainer = document.querySelector('.swiper-container');

    if (!swiperContainer) return;

    // Swiper 초기화
    const swiper = new Swiper('.swiper-container', {
        // 기본 설정
        direction: 'horizontal',
        loop: true,
        slidesPerView: 1,

        // 자동 재생
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },

        // 페이지네이션
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
        },

        // 네비게이션 버튼
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // 효과 및 속도
        effect: 'slide',
        speed: 800,

        // 마우스 드래그 및 터치 제스처
        grabCursor: true,  // 마우스 커서를 grab 모양으로
        allowTouchMove: true,  // 터치 이동 허용
        touchRatio: 1,
        touchAngle: 45,
        touchEventsTarget: 'wrapper',

        // 반응형 설정
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 1,
            },
            992: {
                slidesPerView: 1,
            },
        },
    });

    // 현재 슬라이드 번호 업데이트 함수
    function updateSlideCounter() {
        const currentSlideEl = document.querySelector('.current-slide');
        const totalSlidesEl = document.querySelector('.total-slides');

        if (currentSlideEl && totalSlidesEl) {
            // loop 모드일 때 실제 슬라이드 번호 계산
            const realTotalSlides = swiper.slides.length > 6 ? 3 : swiper.slides.length;
            const currentIndex = (swiper.realIndex % realTotalSlides) + 1;
            currentSlideEl.textContent = currentIndex;
            totalSlidesEl.textContent = realTotalSlides;
        }
    }

    // 초기 슬라이드 번호 설정
    updateSlideCounter();

    // 슬라이드 변경 시 카운터 업데이트
    swiper.on('slideChange', () => {
        updateSlideCounter();
    });

    // 마우스 오버 시 자동 재생 중지
    if (swiperContainer) {
        swiperContainer.addEventListener('mouseenter', () => {
            swiper.autoplay.stop();
        });

        swiperContainer.addEventListener('mouseleave', () => {
            swiper.autoplay.start();
        });
    }
}

// Swiper 라이브러리가 로드되면 초기화
if (typeof Swiper !== 'undefined') {
    initializeGallerySwiper();
} else {
    // 혹시 모르니 DOMContentLoaded에서도 재확인
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof Swiper !== 'undefined') {
            initializeGallerySwiper();
        }
    });
}

// window 로드 시 최종 초기화
window.addEventListener('load', () => {
    if (typeof Swiper !== 'undefined' && !document.querySelector('.swiper-initialized')) {
        initializeGallerySwiper();
    }
});
