# ARTS KOREA LAB Renewal

## Current Structure

```text
assets/
  imgs/
pages/
  README.md
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
    responsive.css
    swiper-custom.css
index.html
```

## Structure Rules

- `src/scripts/main.js`
  - shared bootstrapping entry
  - keeps initialization order only, without page feature details
- `src/scripts/core/`
  - app-wide environment utilities such as viewport and snap helpers
- `src/scripts/data/`
  - menu data and other small UI configuration sources
- `src/scripts/features/`
  - page section or layout-level behavior such as header, sidebar, marquee, and section navigation
- `src/scripts/modules/`
  - reusable widget scripts such as calendar, pagination, and custom scroll snap
- `pages/`
  - preview markup space for future sub pages before splitting into separate entries

## Notes

- `src/scripts/` is the single JS root so the project can stay easy to scan in a publishing-heavy workflow.
- Layout and visual output should stay identical; this structure only aims to make maintenance easier.
