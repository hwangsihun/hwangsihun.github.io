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

    // 마우스 오버 시 자동 재생 중지
    swiperContainer.addEventListener('mouseenter', () => {
        swiper.autoplay.stop();
    });

    // 마우스 떠날 시 자동 재생 재개
    swiperContainer.addEventListener('mouseleave', () => {
        swiper.autoplay.start();
    });
}
