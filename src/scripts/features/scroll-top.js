import { getSnapRoot } from '../core/snap.js';

export function initializeScrollTopButton() {
    const scrollTopButton = document.querySelector('.btn_scroll_top');
    const snapRoot = getSnapRoot();

    if (!scrollTopButton || !snapRoot || scrollTopButton.dataset.scrollTopInitialized === 'true') return;

    scrollTopButton.addEventListener('click', () => {
        snapRoot.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });

    scrollTopButton.dataset.scrollTopInitialized = 'true';
}
