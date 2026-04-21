import { MOBILE_LAYOUT_MAX_WIDTH } from './breakpoints.js';

let previousViewportWidth = null;
let previousViewportHeight = null;
let previousViewportMode = null;
let viewportSyncFrame = 0;

export function getViewportMode(viewportWidth = window.innerWidth) {
    return viewportWidth <= MOBILE_LAYOUT_MAX_WIDTH ? 'mobile' : 'pc';
}

export function syncViewportSize() {
    const viewportHeight = Math.round(window.visualViewport?.height || window.innerHeight);
    const viewportWidth = Math.round(window.visualViewport?.width || window.innerWidth);
    const nextViewportMode = getViewportMode(viewportWidth);
    const lastViewportWidth = previousViewportWidth ?? viewportWidth;
    const lastViewportHeight = previousViewportHeight ?? viewportHeight;
    const lastViewportMode = previousViewportMode ?? nextViewportMode;
    const isFirstSync = previousViewportWidth === null || previousViewportHeight === null;
    const heightChanged = viewportHeight !== lastViewportHeight;
    const widthChanged = viewportWidth !== lastViewportWidth;
    const modeChanged = nextViewportMode !== lastViewportMode;

    if (!isFirstSync && !heightChanged && !widthChanged && !modeChanged) {
        return;
    }

    document.documentElement.style.setProperty('--app-height', `${viewportHeight}px`);
    document.documentElement.style.setProperty('--app-width', `${viewportWidth}px`);

    previousViewportHeight = viewportHeight;
    previousViewportWidth = viewportWidth;
    previousViewportMode = nextViewportMode;

    if (!heightChanged && !widthChanged && !modeChanged) {
        return;
    }

    window.dispatchEvent(
        new CustomEvent('app:viewport-resized', {
            detail: {
                height: viewportHeight,
                width: viewportWidth,
                previousHeight: lastViewportHeight,
                previousWidth: lastViewportWidth,
                mode: nextViewportMode,
                previousMode: lastViewportMode,
                heightChanged,
                widthChanged,
                modeChanged,
            },
        }),
    );
}

export function scheduleViewportSync() {
    cancelAnimationFrame(viewportSyncFrame);
    viewportSyncFrame = requestAnimationFrame(() => {
        syncViewportSize();
    });
}
