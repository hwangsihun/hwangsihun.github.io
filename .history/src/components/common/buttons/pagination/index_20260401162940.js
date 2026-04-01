const PAGINATION_BUTTON_SELECTOR = '[data-icon]';

const PAGINATION_ICON_MAP = {
    next: {
        src: '/assets/imgs/icons/next,prev.svg',
        alt: 'next',
        imgClass: 'rotate-180',
    },
    prev: {
        src: '/assets/imgs/icons/next,prev.svg',
        alt: 'prev',
        imgClass: '',
    },
    stop: {
        src: '/assets/imgs/icons/stop.svg',
        alt: 'stop',
        imgClass: '',
    },
    link: {
        src: '/assets/imgs/icons/link.svg',
        alt: 'link',
        imgClass: '',
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
    const imageClass = `h-[16px] w-[16px] ${iconConfig.imgClass}`.trim();

    element.innerHTML = `
        <button
            type="button"
            class="group flex h-[50px] w-[50px] items-center justify-center rounded-[10px] border bg-white text-[#191f28] transition-all duration-300 ease-in-out c_lightGrayLine hover:bg-black hover:text-white"
            aria-label="${label}"
        >
            <img
                src="${iconConfig.src}"
                alt="${iconConfig.alt}"
                class="${imageClass} transition-all duration-300 ease-in-out group-hover:invert"
            >
        </button>
    `;
}

function initializePaginationButtons() {
    document.querySelectorAll(PAGINATION_BUTTON_SELECTOR).forEach(createPaginationButton);
}

document.addEventListener('DOMContentLoaded', initializePaginationButtons);
