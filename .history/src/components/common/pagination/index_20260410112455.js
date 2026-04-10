const PAGINATION_BUTTON_SELECTOR = '[data-icon]';

const PAGINATION_ICON_MAP = {
    next: {
        src: '/assets/imgs/icons/next,prev.svg',
        alt: 'next',
        imageClass: 'rotate180',
    },
    prev: {
        src: '/assets/imgs/icons/next,prev.svg',
        alt: 'prev',
        imageClass: '',
    },
    stop: {
        src: '/assets/imgs/icons/stop.svg',
        alt: 'stop',
        imageClass: '',
    },
    link: {
        src: '/assets/imgs/icons/link.svg',
        alt: 'link',
        imageClass: '',
    },
};

function resolveIconType(element) {
    const preferredType = element.dataset.icon;
    if (preferredType && PAGINATION_ICON_MAP[preferredType]) {
        return preferredType;
    }

    return 'link';
}

function createPaginationButton(element) {
    const iconType = resolveIconType(element);
    const iconConfig = PAGINATION_ICON_MAP[iconType];
    const label = element.dataset.label || `${iconType} button`;

    element.innerHTML = `
        <button
            type="button"
            class="btn_notice_plus_pc "
            data-pagination-button="${iconType}"
            aria-label="${label}"
        >
            <img
                src="${iconConfig.src}"
                alt="${iconConfig.alt}"
                class="${iconConfig.imageClass}"
            >
        </button>
    `;
}

function initializePaginationButtons() {
    document.querySelectorAll(PAGINATION_BUTTON_SELECTOR).forEach(createPaginationButton);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePaginationButtons);
} else {
    initializePaginationButtons();
}
