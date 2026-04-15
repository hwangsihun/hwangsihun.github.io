export const SNAP_SECTION_SELECTOR = '.snap_section, .footer_section';
export const SNAP_MIN_WIDTH = 768;
export const SNAP_MIN_HEIGHT = 1101;

export function getSnapRoot() {
    return document.querySelector('.snap_page');
}

export function getSnapSections(snapRoot = getSnapRoot()) {
    return Array.from(snapRoot?.querySelectorAll(SNAP_SECTION_SELECTOR) || []);
}

export function getSnapSectionScrollTop(snapRoot, section) {
    if (!snapRoot || !section) return 0;

    const alignToViewportBottom =
        section.classList.contains('footer_section') ||
        section.dataset.snapAlign === 'end';
    const sectionScrollTop = alignToViewportBottom
        ? section.offsetTop + section.offsetHeight - snapRoot.clientHeight
        : section.offsetTop;

    return Math.max(0, Math.min(snapRoot.scrollHeight - snapRoot.clientHeight, sectionScrollTop));
}

export function getClosestSnapSectionState(snapRoot, sections = getSnapSections(snapRoot)) {
    if (!snapRoot || !sections.length) return null;

    return sections.reduce(
        (closestSectionState, section, index) => {
            const sectionScrollTop = getSnapSectionScrollTop(snapRoot, section);
            const distance = Math.abs(snapRoot.scrollTop - sectionScrollTop);

            if (distance < closestSectionState.distance) {
                return {
                    section,
                    index,
                    distance,
                    scrollTop: sectionScrollTop,
                };
            }

            return closestSectionState;
        },
        {
            section: sections[0],
            index: 0,
            distance: Number.POSITIVE_INFINITY,
            scrollTop: getSnapSectionScrollTop(snapRoot, sections[0]),
        },
    );
}

export function getSnapViewportHeight() {
    return window.visualViewport?.height || window.innerHeight;
}

export function isSnapScrollEnabled() {
    return window.innerWidth >= SNAP_MIN_WIDTH && getSnapViewportHeight() >= SNAP_MIN_HEIGHT;
}

export function syncActiveSnapSectionPosition() {
    const snapRoot = getSnapRoot();

    if (!snapRoot || !isSnapScrollEnabled()) return;

    const sections = getSnapSections(snapRoot);

    if (!sections.length) return;

    requestAnimationFrame(() => {
        const activeSectionState = getClosestSnapSectionState(snapRoot, sections);

        if (!activeSectionState) return;

        snapRoot.scrollTop = activeSectionState.scrollTop;
    });
}
