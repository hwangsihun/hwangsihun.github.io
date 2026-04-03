# JSP Frontend Guide

## Recommended JSP View Structure

```text
src/
  main.js
  components/
    common/
      buttons/
    calendar/
    gallery/
  pages/
    home.js
  style/
    fonts.css
    global.css
    layout.css
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

- `src/components/common/`에는 버튼, 링크, 카드, 헤더처럼 여러 화면에서 다시 쓰는 마크업과 동작을 둡니다.
- `src/components/*`에는 캘린더, 갤러리처럼 위젯 단위의 스크립트를 둡니다.
- `src/pages/*`에는 페이지 전용 스크립트를 둡니다.
- JSP에서는 공통 마크업을 `include`나 tag file로 분리하는 편이 관리에 유리합니다.

## Framework Recommendation

### Best fit for this project

- Vite + Vanilla JS + plain CSS utilities

### Good when small interactions grow

- Vite + Vanilla JS + plain CSS components
- Vite + Alpine.js + plain CSS
- Vite + htmx + plain CSS

### Usually overkill for JSP-coupled publishing

- React / Vue / Next / Nuxt

JSP가 HTML을 직접 렌더링하는 구조라면, 프론트는 서버 렌더링 중심으로 두고 가벼운 스크립트와 공통 CSS 유틸리티를 조합하는 방식이 가장 무난합니다.
