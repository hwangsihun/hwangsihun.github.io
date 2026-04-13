export function initializeFooterFamilySite() {
    const familySiteRoot = document.querySelector('.wrapper_footer_family_site');
    const familySiteButton = familySiteRoot?.querySelector('.btn_footer_family_site');
    const familySiteLinks = familySiteRoot?.querySelector('.wrapper_footer_family_links');
    const familySiteItems = Array.from(familySiteRoot?.querySelectorAll('.btn_footer_family_link') || []);

    if (
        !familySiteRoot ||
        !familySiteButton ||
        !familySiteLinks ||
        !familySiteItems.length ||
        familySiteRoot.dataset.familySiteInitialized === 'true'
    ) {
        return;
    }

    function setExpanded(isExpanded) {
        familySiteRoot.classList.toggle('is_open', isExpanded);
        familySiteButton.setAttribute('aria-expanded', String(isExpanded));
        familySiteLinks.hidden = !isExpanded;
    }

    familySiteButton.addEventListener('click', () => {
        const nextExpanded = familySiteButton.getAttribute('aria-expanded') !== 'true';

        setExpanded(nextExpanded);

        if (nextExpanded) {
            familySiteItems[0]?.focus();
        }
    });

    familySiteButton.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
            setExpanded(true);
            familySiteItems[0]?.focus();
            event.preventDefault();
        }
    });

    familySiteLinks.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setExpanded(false);
            familySiteButton.focus();
            event.preventDefault();
        }
    });

    familySiteRoot.addEventListener('focusout', () => {
        requestAnimationFrame(() => {
            if (!familySiteRoot.contains(document.activeElement)) {
                setExpanded(false);
            }
        });
    });

    familySiteRoot.dataset.familySiteInitialized = 'true';
    setExpanded(false);
}
