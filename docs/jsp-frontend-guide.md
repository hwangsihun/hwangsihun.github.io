# JSP Frontend Guide

## Recommended JSP View Structure

```text
src/
  main.js
  components/
    common/
    calendar/
    gallery/
  pages/
    home.js
  style/
    global.css
    fonts.css
    swiper-custom.css

WEB-INF/
  views/
    layout/
    include/
    pages/
      home.jsp
      archive/
      biz/
```

## Practical Rule

- `src/components/common/`에는 버튼, 헤더, 카드, 탭처럼 여러 페이지에서 다시 쓰는 단위를 둡니다.
- `src/components/*`에는 특정 위젯 단위의 JS를 둡니다.
- `src/pages/*`에는 페이지 전용 스크립트를 둡니다.
- JSP에서는 공통 마크업을 `include`나 tag file로 분리합니다.

## Framework Recommendation

### Best fit for this project

- Vite + Tailwind + Vanilla JS

### Good when small interactions grow

- Vite + Tailwind + Alpine.js
- Vite + Tailwind + htmx

### Usually overkill for JSP-coupled publishing

- React / Vue / Next / Nuxt

백엔드가 JSP로 HTML을 직접 렌더링하는 구조라면, 퍼블리셔 실무에서는 보통 서버 렌더링을 유지하고 프론트는 빌드 도구와 유틸리티 CSS, 가벼운 상호작용 레이어만 얹는 편이 운영이 쉽습니다.
