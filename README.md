# ARTSKOREALAB Renewal

## Current Structure

```text
assets/
  imgs/
pages/
  README.md
src/
  components/
    calendar/
    common/
    gallery/
  pages/
    home.js
  style/
    fonts.css
    global.css
    swiper-custom.css
  main.js
index.html
```

## Why This Was Reorganized

- `src/main.js` was the real entry, but `index.html` also loaded extra module files directly.
- `src/js/main.js` and `src/main.js` had confusingly similar names.
- Reusable UI behavior like calendar and gallery lived next to page logic instead of component logic.
- `pages/` existed but had no purpose documented.

## Suggested JSP Mapping

- `src/components/common/` -> shared JSP include candidates
- `src/components/calendar/` -> widget-level behavior
- `src/components/gallery/` -> widget-level behavior
- `src/pages/home.js` -> page-specific behavior for the main screen
- `pages/` -> static preview HTML collection before JSP conversion
