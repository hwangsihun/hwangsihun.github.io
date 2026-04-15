import { getViewportMode } from '../core/viewport.js';
import {
    MOBILE_SIDEBAR_ACCORDION_DURATION,
    MOBILE_SIDEBAR_MENU_ITEMS,
} from '../data/header-menu.js';

function renderMobileSidebarMenu(sidebarList) {
    if (!sidebarList || sidebarList.dataset.mobileSidebarRendered === 'true') return;

    const fragment = document.createDocumentFragment();

    MOBILE_SIDEBAR_MENU_ITEMS.forEach((menuItem) => {
        const itemElement = document.createElement('li');
        const toggleButton = document.createElement('button');
        const labelElement = document.createElement('span');
        const iconElement = document.createElement('span');
        const horizontalLineElement = document.createElement('span');
        const verticalLineElement = document.createElement('span');
        const panelElement = document.createElement('ul');

        itemElement.className = 'item_mobile_sidebar_menu';

        toggleButton.type = 'button';
        toggleButton.className = 'btn_mobile_sidebar_menu flex_row_between bg_white';
        toggleButton.dataset.mobileSidebarToggle = menuItem.id;
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.setAttribute('aria-controls', `mobile-sidebar-panel-${menuItem.id}`);

        labelElement.className = 'text_mobile_sidebar_menu';
        labelElement.textContent = menuItem.label;

        iconElement.className = 'icon_mobile_sidebar_toggle';
        iconElement.setAttribute('aria-hidden', 'true');

        horizontalLineElement.className =
            'line_mobile_sidebar_toggle line_mobile_sidebar_toggle_horizontal';
        verticalLineElement.className = 'line_mobile_sidebar_toggle line_mobile_sidebar_toggle_vertical';

        iconElement.appendChild(horizontalLineElement);
        iconElement.appendChild(verticalLineElement);
        toggleButton.appendChild(labelElement);
        toggleButton.appendChild(iconElement);

        panelElement.className = 'list_mobile_sidebar_submenu flex_col_start bg_lightGray';
        panelElement.id = `mobile-sidebar-panel-${menuItem.id}`;
        panelElement.hidden = true;

        menuItem.items.forEach((submenuItem) => {
            const submenuListItem = document.createElement('li');
            const submenuButton = document.createElement('button');

            submenuListItem.className = 'item_mobile_sidebar_submenu';
            submenuButton.type = 'button';
            submenuButton.className = 'btn_mobile_sidebar_submenu';
            submenuButton.textContent = submenuItem.label;

            submenuListItem.appendChild(submenuButton);
            panelElement.appendChild(submenuListItem);
        });

        itemElement.appendChild(toggleButton);
        itemElement.appendChild(panelElement);
        fragment.appendChild(itemElement);
    });

    sidebarList.appendChild(fragment);
    sidebarList.dataset.mobileSidebarRendered = 'true';
}

export function initializeMobileSidebarMenu() {
    const sidebar = document.querySelector('[data-mobile-sidebar]');
    const sidebarList = sidebar?.querySelector('[data-mobile-sidebar-list]');
    const openButton = document.querySelector('.btn_header_menu');

    if (
        !sidebar ||
        !sidebarList ||
        !openButton ||
        sidebar.dataset.mobileSidebarInitialized === 'true'
    ) {
        return;
    }

    renderMobileSidebarMenu(sidebarList);

    const accordionButtons = Array.from(sidebarList.querySelectorAll('[data-mobile-sidebar-toggle]'));

    function getSidebarFocusableElements() {
        return Array.from(
            sidebar.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'),
        ).filter((element) => !element.closest('[hidden]'));
    }

    function syncOpenButtonState(isOpen) {
        const openButtonIcon = openButton.querySelector('.icon_header_menu');

        openButton.setAttribute('aria-expanded', String(isOpen));
        openButton.setAttribute('aria-label', isOpen ? '전체 메뉴 닫기' : '전체 메뉴');

        if (openButtonIcon) {
            openButtonIcon.src = isOpen ? '/assets/imgs/icons/close.svg' : '/assets/imgs/icons/sideMenu.svg';
        }
    }

    function setAccordionExpanded(button, isExpanded, options = {}) {
        const { immediate = false } = options;
        const panelId = button.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;

        if (!panel) return;

        button.setAttribute('aria-expanded', String(isExpanded));
        window.clearTimeout(panel.__hideTimer);

        if (immediate) {
            panel.classList.toggle('is_open', isExpanded);
            panel.hidden = !isExpanded;
            return;
        }

        if (isExpanded) {
            panel.hidden = false;
            requestAnimationFrame(() => {
                panel.classList.add('is_open');
            });
            return;
        }

        panel.classList.remove('is_open');
        panel.__hideTimer = window.setTimeout(() => {
            if (button.getAttribute('aria-expanded') === 'false') {
                panel.hidden = true;
            }
        }, MOBILE_SIDEBAR_ACCORDION_DURATION);
    }

    function closeAllAccordions(exceptButton = null, options = {}) {
        accordionButtons.forEach((button) => {
            if (button === exceptButton) return;

            setAccordionExpanded(button, false, options);
        });
    }

    function setSidebarOpen(isOpen, options = {}) {
        const { restoreFocus = true } = options;

        if (isOpen && getViewportMode() !== 'mobile') return;

        if (isOpen) {
            closeAllAccordions(null, { immediate: true });
        }

        sidebar.hidden = !isOpen;
        sidebar.setAttribute('aria-hidden', String(!isOpen));
        document.body.classList.toggle('is_mobile_sidebar_open', isOpen);
        syncOpenButtonState(isOpen);

        closeAllAccordions(null, { immediate: true });

        if (!isOpen && restoreFocus) {
            openButton.focus();
        }
    }

    openButton.addEventListener('click', () => {
        if (getViewportMode() !== 'mobile') return;

        const shouldOpen = openButton.getAttribute('aria-expanded') !== 'true';
        setSidebarOpen(shouldOpen);
    });

    accordionButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const shouldExpand = button.getAttribute('aria-expanded') !== 'true';

            closeAllAccordions(button);
            setAccordionExpanded(button, shouldExpand);
        });
    });

    sidebar.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setSidebarOpen(false);
            event.preventDefault();
            return;
        }

        if (event.key !== 'Tab') return;

        const focusableElements = getSidebarFocusableElements();

        if (!focusableElements.length) {
            if (!event.shiftKey) {
                openButton.focus();
                event.preventDefault();
            }
            return;
        }

        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements.at(-1);

        if (event.shiftKey && document.activeElement === firstFocusableElement) {
            openButton.focus();
            event.preventDefault();
        }

        if (!event.shiftKey && document.activeElement === lastFocusableElement) {
            openButton.focus();
            event.preventDefault();
        }
    });

    window.addEventListener('app:viewport-resized', () => {
        if (getViewportMode() !== 'mobile' && openButton.getAttribute('aria-expanded') === 'true') {
            setSidebarOpen(false, { restoreFocus: false });
        }
    });

    sidebar.dataset.mobileSidebarInitialized = 'true';
    syncOpenButtonState(false);
    closeAllAccordions(null, { immediate: true });
    setSidebarOpen(false, { restoreFocus: false });
}

