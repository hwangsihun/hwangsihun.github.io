const PAGINATION_BUTTON_SELECTOR = '.wrapper_main3_swiper_button[data-icon]';

const PAGINATION_ICON_MAP = {
    next: true,
    prev: true,
    stop: true,
    link: true,
    plus: true,
    start: true,
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
    const label = element.dataset.label || `${iconType} button`;

    element.innerHTML = `
        <button
            type="button"
            class="btn_subFunc_pc flex_row_center bg_white text_black line_lightGray"
            data-pagination-button="${iconType}"
            data-icon="${iconType}"
            aria-label="${label}"
        ></button>
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
