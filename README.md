# ARTS KOREA LAB Renewal

## Current Structure

```text
assets/
  imgs/
pages/
  README.md
src/
  components/
    common/
      calendar/
      pagination/
      scroll-snap/
  pages/
    home.js
  style/
    fonts.css
    global.css
    layout.css
    responsive.css
    swiper-custom.css
  main.js
index.html
```

## Structure Rules

- `src/main.js`
  - shared bootstrapping entry
  - wires page-wide interactions such as swipers, section navigation, and global header behavior
- `src/components/common/`
  - reusable UI behavior modules
  - keep widget-like logic here when it can be reused without page coupling
- `src/pages/home.js`
  - reserved for home-only behavior
  - keep this as the place for future main-page scripts instead of growing `main.js` forever
- `pages/`
  - preview markup space for future sub pages before splitting into separate entries

## Notes

- Legacy wrapper files that only re-exported other modules were removed.
- Reusable widget scripts were flattened where the nested path added no value.
- Layout and visual output should stay identical; this structure only aims to make maintenance easier.
