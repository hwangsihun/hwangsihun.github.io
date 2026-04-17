export const MOBILE_LAYOUT_MAX_WIDTH = 992;
export const MOBILE_HEADER_MAX_WIDTH = 992;
export const SNAP_SCROLL_DISABLED_MAX_HEIGHT = 800;

export function createMaxWidthMediaQuery(maxWidth) {
    return `(max-width: ${maxWidth}px)`;
}

export const MOBILE_HEADER_MEDIA_QUERY = createMaxWidthMediaQuery(MOBILE_HEADER_MAX_WIDTH);
