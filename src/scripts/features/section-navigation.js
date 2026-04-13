import {
    getClosestSnapSectionState,
    getSnapRoot,
    getSnapSectionScrollTop,
} from '../core/snap.js';
import { waitForMain2Warmup } from './gallery-swipers.js';

export function initializeSideSectionNavigation() {
    const sideSectionNavigation = document.querySelector('.container_side_section_navigation');
    const snapRoot = getSnapRoot();
    const currentSectionText = sideSectionNavigation?.querySelector('.text_section_nav_current');
    const sectionNavButtons = Array.from(
        sideSectionNavigation?.querySelectorAll('.btn_section_nav_dot[data-section-nav-target]') || [],
    );

    if (
        !sideSectionNavigation ||
        !snapRoot ||
        !currentSectionText ||
        !sectionNavButtons.length ||
        sideSectionNavigation.dataset.sideSectionNavInitialized === 'true'
    ) {
        return;
    }

    const sectionNavigationItems = sectionNavButtons
        .map((sectionNavButton) => {
            const targetSection = document.querySelector(sectionNavButton.dataset.sectionNavTarget);

            if (!targetSection) return null;

            return {
                button: sectionNavButton,
                section: targetSection,
            };
        })
        .filter(Boolean);

    if (!sectionNavigationItems.length) return;

    let sideSectionNavUpdateFrame = 0;

    function updateActiveSectionNavigation() {
        const activeSectionState = getClosestSnapSectionState(
            snapRoot,
            sectionNavigationItems.map((sectionNavigationItem) => sectionNavigationItem.section),
        );
        const activeSectionIndex = sectionNavigationItems.findIndex(
            (sectionNavigationItem) => sectionNavigationItem.section === activeSectionState?.section,
        );
        const nextActiveIndex = activeSectionIndex === -1 ? 0 : activeSectionIndex;

        sectionNavigationItems.forEach((sectionNavigationItem, sectionIndex) => {
            const isActive = sectionIndex === nextActiveIndex;

            sectionNavigationItem.button.classList.toggle('is_active', isActive);

            if (isActive) {
                sectionNavigationItem.button.setAttribute('aria-current', 'true');
            } else {
                sectionNavigationItem.button.removeAttribute('aria-current');
            }
        });

        currentSectionText.textContent = String(nextActiveIndex + 1);
    }

    function scheduleSectionNavigationUpdate() {
        cancelAnimationFrame(sideSectionNavUpdateFrame);
        sideSectionNavUpdateFrame = requestAnimationFrame(updateActiveSectionNavigation);
    }

    sectionNavigationItems.forEach((sectionNavigationItem) => {
        sectionNavigationItem.button.addEventListener('click', async () => {
            if (
                sectionNavigationItem.section.id === 'main-2' &&
                document.body?.dataset.main2WarmupReady !== 'true'
            ) {
                await waitForMain2Warmup();
            }

            snapRoot.scrollTo({
                top: getSnapSectionScrollTop(snapRoot, sectionNavigationItem.section),
                behavior: 'smooth',
            });
        });
    });

    snapRoot.addEventListener('scroll', scheduleSectionNavigationUpdate, { passive: true });
    window.addEventListener('app:viewport-resized', scheduleSectionNavigationUpdate);

    sideSectionNavigation.dataset.sideSectionNavInitialized = 'true';
    updateActiveSectionNavigation();
}
