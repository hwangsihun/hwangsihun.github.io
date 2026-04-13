import { getViewportMode } from '../core/viewport.js';
import { HEADER_SUBMENU_ITEMS } from '../data/header-menu.js';

export function initializeGlobalHeader() {
    const headerElement = document.querySelector('.container_header_global');
    const headerGnbHolder = headerElement?.querySelector('[data-header-gnb]');
    const headerGnbBar = headerElement?.querySelector('.wrapper_header_gnb');
    const headerMenuButtons = Array.from(headerElement?.querySelectorAll('.btn_header_gnb[data-header-menu]') || []);
    const submenuContainer = headerElement?.querySelector('.container_header_submenu');
    const submenuList = headerElement?.querySelector('[data-header-submenu-list]');
    const logoButton = document.querySelector('.btn_header_logo');
    const mainElement = document.querySelector('main');
    const headerActionButtons = Array.from(
        document.querySelectorAll('.container_header_main1 .wrapper_header_actions .btn_header_icon'),
    );

    if (
        !headerElement ||
        !headerGnbHolder ||
        !headerGnbBar ||
        !submenuContainer ||
        !submenuList ||
        headerElement.dataset.headerInitialized === 'true'
    ) {
        return;
    }

    let headerUpdateFrame = 0;
    let activeMenuButton = null;
    let submenuCloseTimer = 0;

    headerMenuButtons.forEach((headerMenuButton, menuIndex) => {
        if (!headerMenuButton.id) {
            headerMenuButton.id = `header-gnb-button-${menuIndex + 1}`;
        }
    });

    function closeSubmenu(options = {}) {
        const { restoreFocus = false } = options;
        const previousActiveMenuButton = activeMenuButton;

        window.clearTimeout(submenuCloseTimer);
        activeMenuButton = null;
        submenuContainer.hidden = true;
        submenuList.innerHTML = '';
        submenuList.removeAttribute('aria-labelledby');
        headerElement.classList.remove('is_submenu_open');

        headerMenuButtons.forEach((headerMenuButton) => {
            headerMenuButton.classList.remove('is_active');
            headerMenuButton.closest('.item_header_gnb')?.classList.remove('is_active');
            headerMenuButton.setAttribute('aria-expanded', 'false');
        });

        if (restoreFocus) {
            previousActiveMenuButton?.focus();
        }
    }

    function cancelScheduledSubmenuClose() {
        window.clearTimeout(submenuCloseTimer);
    }

    function scheduleSubmenuClose() {
        cancelScheduledSubmenuClose();
        submenuCloseTimer = window.setTimeout(() => {
            closeSubmenu();
        }, 140);
    }

    function isFocusableAndVisible(element) {
        if (!element || element.matches(':disabled') || element.closest('[hidden]')) {
            return false;
        }

        const computedStyle = window.getComputedStyle(element);

        return computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
    }

    function getMainFocusableElements() {
        if (!mainElement) return [];

        return Array.from(
            mainElement.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'),
        ).filter((element) => isFocusableAndVisible(element));
    }

    function getVisibleHeaderActionButtons() {
        return headerActionButtons.filter((button) => isFocusableAndVisible(button));
    }

    function getSubmenuButtons() {
        return Array.from(submenuList.querySelectorAll('.btn_header_submenu'));
    }

    function focusMenuBoundary(menuIndex, direction = 'start') {
        const targetMenuButton = headerMenuButtons[menuIndex];

        if (!targetMenuButton) return;

        openSubmenu(targetMenuButton);

        requestAnimationFrame(() => {
            const submenuButtons = getSubmenuButtons();

            if (!submenuButtons.length) {
                targetMenuButton.focus();
                return;
            }

            const targetButton =
                direction === 'end' ? submenuButtons[submenuButtons.length - 1] : submenuButtons[0];

            targetButton?.focus();
        });
    }

    function syncSubmenuWidth() {
        const gnbWidth = headerGnbBar.offsetWidth;

        if (!gnbWidth) return;

        headerGnbHolder.style.setProperty('--header-gnb-width', `${gnbWidth}px`);
    }

    function openSubmenu(menuButton) {
        if (!menuButton || getViewportMode() !== 'pc') return;

        const submenuItems = HEADER_SUBMENU_ITEMS[menuButton.dataset.headerMenu] || [];

        cancelScheduledSubmenuClose();

        if (!submenuItems.length) {
            closeSubmenu();
            return;
        }

        activeMenuButton = menuButton;
        submenuList.innerHTML = '';

        const submenuFragment = document.createDocumentFragment();
        submenuItems.forEach((submenuItem) => {
            const submenuButton = document.createElement('button');

            submenuButton.type = 'button';
            submenuButton.className = 'btn_header_submenu';
            submenuButton.textContent = submenuItem.label;
            submenuFragment.appendChild(submenuButton);
        });

        submenuList.appendChild(submenuFragment);
        submenuList.setAttribute('aria-labelledby', menuButton.id);
        syncSubmenuWidth();
        submenuContainer.hidden = false;
        headerElement.classList.add('is_submenu_open');

        headerMenuButtons.forEach((headerMenuButton) => {
            const isActive = headerMenuButton === menuButton;

            headerMenuButton.classList.toggle('is_active', isActive);
            headerMenuButton.closest('.item_header_gnb')?.classList.toggle('is_active', isActive);
            headerMenuButton.setAttribute('aria-expanded', String(isActive));
        });
    }

    function moveMenuFocus(step) {
        if (!headerMenuButtons.length) return;

        const activeIndex = headerMenuButtons.findIndex(
            (headerMenuButton) => headerMenuButton === document.activeElement,
        );
        const nextIndex =
            activeIndex === -1
                ? 0
                : (activeIndex + step + headerMenuButtons.length) % headerMenuButtons.length;

        headerMenuButtons[nextIndex]?.focus();
    }

    function focusSubmenuButton(step) {
        const submenuButtons = getSubmenuButtons();

        if (!submenuButtons.length) return;

        const activeIndex = submenuButtons.findIndex((submenuButton) => submenuButton === document.activeElement);
        const nextIndex =
            activeIndex === -1
                ? 0
                : (activeIndex + step + submenuButtons.length) % submenuButtons.length;

        submenuButtons[nextIndex]?.focus();
    }

    function updateHeaderState() {
        syncSubmenuWidth();

        if (getViewportMode() !== 'pc') {
            closeSubmenu();
        }
    }

    function scheduleHeaderUpdate() {
        cancelAnimationFrame(headerUpdateFrame);
        headerUpdateFrame = requestAnimationFrame(updateHeaderState);
    }

    headerMenuButtons.forEach((headerMenuButton, menuIndex) => {
        headerMenuButton.addEventListener('click', () => {
            const isExpanded = headerMenuButton.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                closeSubmenu({ restoreFocus: false });
            } else {
                openSubmenu(headerMenuButton);
            }
        });

        headerMenuButton.addEventListener('pointerenter', () => {
            openSubmenu(headerMenuButton);
        });

        headerMenuButton.addEventListener('focusin', () => {
            openSubmenu(headerMenuButton);
        });

        headerMenuButton.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    if (menuIndex === 0) {
                        logoButton?.focus();
                    } else {
                        focusMenuBoundary(menuIndex - 1, 'end');
                    }

                    event.preventDefault();
                    return;
                }

                openSubmenu(headerMenuButton);

                requestAnimationFrame(() => {
                    const submenuButtons = getSubmenuButtons();

                    if (submenuButtons.length) {
                        submenuButtons[0]?.focus();
                        return;
                    }

                    const nextMenuButton = headerMenuButtons[menuIndex + 1];

                    if (nextMenuButton) {
                        nextMenuButton.focus();
                        return;
                    }

                    getVisibleHeaderActionButtons()[0]?.focus();
                });

                event.preventDefault();
                return;
            }

            if (event.key === 'ArrowRight') {
                moveMenuFocus(1);
                event.preventDefault();
            }

            if (event.key === 'ArrowLeft') {
                moveMenuFocus(-1);
                event.preventDefault();
            }

            if (event.key === 'Home') {
                headerMenuButtons[0]?.focus();
                event.preventDefault();
            }

            if (event.key === 'End') {
                headerMenuButtons.at(-1)?.focus();
                event.preventDefault();
            }

            if (event.key === 'ArrowDown') {
                openSubmenu(headerMenuButton);
                requestAnimationFrame(() => {
                    submenuList.querySelector('.btn_header_submenu')?.focus();
                });
                event.preventDefault();
            }
        });
    });

    logoButton?.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab' || event.shiftKey || getViewportMode() !== 'pc') {
            return;
        }

        headerMenuButtons[0]?.focus();
        event.preventDefault();
    });

    headerActionButtons.forEach((headerActionButton) => {
        headerActionButton.addEventListener('keydown', (event) => {
            if (event.key !== 'Tab' || getViewportMode() !== 'pc') {
                return;
            }

            const visibleHeaderActionButtons = getVisibleHeaderActionButtons();

            if (event.shiftKey) {
                if (headerActionButton !== visibleHeaderActionButtons[0]) {
                    return;
                }

                focusMenuBoundary(headerMenuButtons.length - 1, 'end');
                event.preventDefault();
                return;
            }

            if (headerActionButton !== visibleHeaderActionButtons.at(-1)) {
                return;
            }

            getMainFocusableElements()[0]?.focus();
            event.preventDefault();
        });
    });

    mainElement?.addEventListener(
        'keydown',
        (event) => {
            if (event.key !== 'Tab' || !event.shiftKey || getViewportMode() !== 'pc') {
                return;
            }

            const mainFocusableElements = getMainFocusableElements();

            if (event.target !== mainFocusableElements[0]) {
                return;
            }

            getVisibleHeaderActionButtons().at(-1)?.focus();
            event.preventDefault();
        },
        true,
    );

    submenuList.addEventListener('keydown', (event) => {
        const submenuButtons = getSubmenuButtons();
        const currentSubmenuButton = event.target.closest('.btn_header_submenu');
        const submenuIndex = submenuButtons.indexOf(currentSubmenuButton);
        const activeMenuIndex = headerMenuButtons.indexOf(activeMenuButton);

        if (event.key === 'Tab') {
            if (event.shiftKey) {
                if (submenuIndex === 0) {
                    activeMenuButton?.focus();
                    event.preventDefault();
                }

                return;
            }

            if (submenuIndex === submenuButtons.length - 1) {
                const nextMenuButton = headerMenuButtons[activeMenuIndex + 1];

                if (nextMenuButton) {
                    nextMenuButton.focus();
                    event.preventDefault();
                    return;
                }

                const visibleHeaderActionButtons = getVisibleHeaderActionButtons();

                if (visibleHeaderActionButtons.length) {
                    visibleHeaderActionButtons[0].focus();
                    event.preventDefault();
                }
            }

            return;
        }

        if (event.key === 'ArrowRight') {
            focusSubmenuButton(1);
            event.preventDefault();
        }

        if (event.key === 'ArrowLeft') {
            focusSubmenuButton(-1);
            event.preventDefault();
        }

        if (event.key === 'Home') {
            submenuList.querySelector('.btn_header_submenu')?.focus();
            event.preventDefault();
        }

        if (event.key === 'End') {
            submenuList.querySelector('.btn_header_submenu:last-child')?.focus();
            event.preventDefault();
        }

        if (event.key === 'ArrowUp') {
            activeMenuButton?.focus();
            event.preventDefault();
        }
    });

    headerGnbHolder.addEventListener('pointerleave', () => {
        scheduleSubmenuClose();
    });

    headerGnbBar.addEventListener('pointerenter', () => {
        cancelScheduledSubmenuClose();
    });

    submenuContainer.addEventListener('pointerenter', () => {
        cancelScheduledSubmenuClose();
    });

    submenuContainer.addEventListener('pointerleave', () => {
        scheduleSubmenuClose();
    });

    headerGnbHolder.addEventListener('focusout', () => {
        requestAnimationFrame(() => {
            if (!headerGnbHolder.contains(document.activeElement)) {
                closeSubmenu();
            }
        });
    });

    headerElement.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;

        closeSubmenu({ restoreFocus: true });
    });

    window.addEventListener('app:viewport-resized', scheduleHeaderUpdate);

    headerElement.dataset.headerInitialized = 'true';
    closeSubmenu();
    scheduleHeaderUpdate();
}
