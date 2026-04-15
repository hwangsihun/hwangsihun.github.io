import { getClosestSnapSectionState, getSnapRoot } from '../core/snap.js';
import { MOBILE_HEADER_MEDIA_QUERY } from '../core/breakpoints.js';

export function initializeMain1HeaderOverlay() {
    const headerElement = document.querySelector('.container_header_main1');
    const snapRoot = getSnapRoot();
    const main1Section = document.querySelector('#main-1');
    const mobileMediaQuery = window.matchMedia(MOBILE_HEADER_MEDIA_QUERY);

    if (
        !headerElement ||
        !snapRoot ||
        !main1Section ||
        headerElement.dataset.main1HeaderInitialized === 'true'
    ) {
        return;
    }

    let updateFrame = 0;

    function syncHeaderVisibility() {
        if (mobileMediaQuery.matches) {
            headerElement.classList.remove('is_hidden');
            return;
        }

        const activeSectionState = getClosestSnapSectionState(snapRoot);
        const shouldShowHeader = activeSectionState?.section === main1Section;

        headerElement.classList.toggle('is_hidden', !shouldShowHeader);
    }

    function scheduleHeaderVisibilitySync() {
        cancelAnimationFrame(updateFrame);
        updateFrame = requestAnimationFrame(syncHeaderVisibility);
    }

    snapRoot.addEventListener('scroll', scheduleHeaderVisibilitySync, { passive: true });
    window.addEventListener('app:viewport-resized', scheduleHeaderVisibilitySync);

    headerElement.dataset.main1HeaderInitialized = 'true';
    scheduleHeaderVisibilitySync();
}
