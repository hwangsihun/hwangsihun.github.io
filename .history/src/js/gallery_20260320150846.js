// Swiper Gallery Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeGallerySwiper();
});

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

        // 터치 제스처
        touchRatio: 1,
        touchAngle: 45,
        touchEventsTarget: 'container',

        // 반응형 설정
        breakpoints: {
            // 모바일
            0: {
                slidesPerView: 1,
            },
            // 태블릿 이상
            576: {
                slidesPerView: 1,
            },
            // 데스크톱
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
            const totalSlides = swiper.slides.length / 2; // loop 모드에서는 슬라이드가 복제됨
            const currentIndex = (swiper.realIndex % totalSlides) + 1;
            currentSlideEl.textContent = currentIndex;
            totalSlidesEl.textContent = totalSlides;
        }
    }

    // 초기 슬라이드 번호 설정
    updateSlideCounter();

    // 슬라이드 변경 시 카운터 업데이트
    swiper.on('slideChange', () => {
        updateSlideCounter();
    });

    // 마우스 오버 시 자동 재생 중지
    const swiperContainer = document.querySelector('.swiper-container');
    if (swiperContainer) {
        swiperContainer.addEventListener('mouseenter', () => {
            swiper.autoplay.stop();
        });

        swiperContainer.addEventListener('mouseleave', () => {
            swiper.autoplay.start();
        });
    }
}
