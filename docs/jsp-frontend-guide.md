# JSP Frontend Guide

## Recommended JSP View Structure

```text
src/
  scripts/
    core/
    data/
    features/
    modules/
    main.js
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

- `src/scripts/`를 JS 단일 루트로 두고, 하위에서 책임만 나눕니다.
- `src/scripts/core/`에는 뷰포트, 스냅 좌표 같은 앱 공통 계산을 둡니다.
- `src/scripts/modules/`에는 캘린더, 페이지네이션처럼 재사용 가능한 위젯 스크립트를 둡니다.
- `src/scripts/features/`에는 헤더, 모바일 오버레이, 메인 섹션 인터랙션처럼 화면 구조에 가까운 동작을 둡니다.
- `src/scripts/data/`에는 메뉴나 UI 설정값처럼 작은 정적 데이터를 둡니다.
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
