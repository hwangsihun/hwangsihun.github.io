let previousViewportWidth = null;
let previousViewportHeight = null;
let previousViewportMode = null;
let viewportSyncFrame = 0;

export function getViewportMode(viewportWidth = window.innerWidth) {
    return viewportWidth >= 768 ? 'pc' : 'mobile';
}

export function syncViewportSize() {
    const viewportHeight = Math.round(window.visualViewport?.height || window.innerHeight);
    const viewportWidth = Math.round(window.visualViewport?.width || window.innerWidth);
    const nextViewportMode = getViewportMode(viewportWidth);
    const lastViewportWidth = previousViewportWidth ?? viewportWidth;
    const lastViewportHeight = previousViewportHeight ?? viewportHeight;
    const lastViewportMode = previousViewportMode ?? nextViewportMode;

    document.documentElement.style.setProperty('--app-height', `${viewportHeight}px`);
    document.documentElement.style.setProperty('--app-width', `${viewportWidth}px`);

    window.dispatchEvent(
        new CustomEvent('app:viewport-resized', {
            detail: {
                height: viewportHeight,
                width: viewportWidth,
                previousHeight: lastViewportHeight,
                previousWidth: lastViewportWidth,
                mode: nextViewportMode,
                previousMode: lastViewportMode,
                heightChanged: viewportHeight !== lastViewportHeight,
                widthChanged: viewportWidth !== lastViewportWidth,
                modeChanged: nextViewportMode !== lastViewportMode,
            },
        }),
    );

    previousViewportHeight = viewportHeight;
    previousViewportWidth = viewportWidth;
    previousViewportMode = nextViewportMode;
}

export function scheduleViewportSync() {
    cancelAnimationFrame(viewportSyncFrame);
    viewportSyncFrame = requestAnimationFrame(() => {
        syncViewportSize();
    });
}
