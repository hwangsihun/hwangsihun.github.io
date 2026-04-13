import { scheduleViewportSync } from './core/viewport.js';
import { syncActiveSnapSectionPosition } from './core/snap.js';
import {
    ensureGallerySwipersInitialized,
    preloadMain2Assets,
    syncGallerySwiperLayouts,
} from './features/gallery-swipers.js';
import { initializeFooterFamilySite } from './features/footer-family-site.js';
import { initializeGlobalHeader } from './features/header.js';
import { initializeMain1HeaderOverlay } from './features/main1-header.js';
import {
    initializeMain4FunctionGrid,
    initializeMain4PartnersMarquee,
} from './features/main4.js';
import { initializeMobileSidebarMenu } from './features/mobile-sidebar.js';
import { initializeScrollTopButton } from './features/scroll-top.js';
import { initializeSideSectionNavigation } from './features/section-navigation.js';
import { initializeCalendarModule } from './modules/calendar.js';
import { initializeCustomScrollSnap } from './modules/scroll-snap.js';

let siteInitialized = false;

function initializeSite() {
    if (siteInitialized) return;

    siteInitialized = true;

    preloadMain2Assets();
    initializeCalendarModule();
    initializeCustomScrollSnap();
    initializeMain4FunctionGrid();
    initializeMain4PartnersMarquee();
    initializeSideSectionNavigation();
    initializeScrollTopButton();
    initializeGlobalHeader();
    initializeMobileSidebarMenu();
    initializeMain1HeaderOverlay();
    initializeFooterFamilySite();
    ensureGallerySwipersInitialized();
}

function handleViewportResize(event) {
    const { widthChanged = false, heightChanged = false, modeChanged = false } = event.detail || {};

    if (!widthChanged && !heightChanged && !modeChanged) {
        return;
    }

    syncGallerySwiperLayouts();
    syncActiveSnapSectionPosition();
    initializeMain4PartnersMarquee();
}

window.addEventListener('resize', scheduleViewportSync);
window.addEventListener('orientationchange', scheduleViewportSync);
window.visualViewport?.addEventListener('resize', scheduleViewportSync);
window.addEventListener('app:viewport-resized', handleViewportResize);

scheduleViewportSync();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSite, { once: true });
} else {
    initializeSite();
}

window.addEventListener('load', () => {
    scheduleViewportSync();
    initializeMain4PartnersMarquee();
    syncGallerySwiperLayouts();
    syncActiveSnapSectionPosition();
    ensureGallerySwipersInitialized();
});
