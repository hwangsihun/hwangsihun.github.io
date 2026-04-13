const MAIN4_GRID_COLUMN_PRESETS = [
    'minmax(0, 10fr) minmax(0, 1.5fr) minmax(0, 1.5fr) minmax(0, 1.5fr)',
    'minmax(0, 1.5fr) minmax(0, 10fr) minmax(0, 1.5fr) minmax(0, 1.5fr)',
    'minmax(0, 1.5fr) minmax(0, 1.5fr) minmax(0, 10fr) minmax(0, 1.5fr)',
    'minmax(0, 1.5fr) minmax(0, 1.5fr) minmax(0, 1.5fr) minmax(0, 10fr)',
];

export function initializeMain4FunctionGrid() {
    const functionGrid = document.querySelector('.wrapper_main4_function_grid');
    const functionCards = Array.from(functionGrid?.querySelectorAll('.wrapper_main4_function_card') || []);

    if (!functionGrid || !functionCards.length) return;

    let activeCard = functionGrid.querySelector('.wrapper_main4_function_card.is_active');

    if (!activeCard) {
        activeCard = functionCards[0] || null;
    }

    function setActiveCard(nextActiveCard) {
        if (!nextActiveCard) return;

        const activeCardIndex = functionCards.findIndex((functionCard) => functionCard === nextActiveCard);
        const gridColumns =
            MAIN4_GRID_COLUMN_PRESETS[activeCardIndex] || MAIN4_GRID_COLUMN_PRESETS[0];

        functionCards.forEach((functionCard) => {
            const isActive = functionCard === nextActiveCard;
            const quickLinkButton = functionCard.querySelector('.btn_quickLink');

            functionCard.classList.toggle('is_active', isActive);
            functionCard.setAttribute('tabindex', '0');

            if (quickLinkButton) {
                quickLinkButton.disabled = !isActive;
                quickLinkButton.tabIndex = isActive ? 0 : -1;

                if (isActive) {
                    quickLinkButton.removeAttribute('aria-hidden');
                } else {
                    quickLinkButton.setAttribute('aria-hidden', 'true');
                }
            }
        });

        functionGrid.style.setProperty('--main4-grid-columns', gridColumns);
        activeCard = nextActiveCard;
    }

    if (functionGrid.dataset.main4FunctionGridInitialized === 'true') {
        setActiveCard(activeCard);
        return;
    }

    functionCards.forEach((functionCard) => {
        functionCard.addEventListener('pointerenter', () => {
            setActiveCard(functionCard);
        });

        functionCard.addEventListener('click', () => {
            setActiveCard(functionCard);
        });

        functionCard.addEventListener('focus', () => {
            setActiveCard(functionCard);
        });

        functionCard.addEventListener('focusin', () => {
            setActiveCard(functionCard);
        });

        functionCard.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                setActiveCard(functionCard);
                event.preventDefault();
            }
        });
    });

    functionGrid.dataset.main4FunctionGridInitialized = 'true';
    setActiveCard(activeCard);
}

export function initializeMain4PartnersMarquee() {
    const marqueeElement = document.querySelector('.wrapper_main4_partners_marquee');
    const marqueeTrack = marqueeElement?.querySelector('.wrapper_main4_partners_track');
    const sourceGroup = marqueeTrack?.querySelector('.wrapper_main4_partners_group');

    if (!marqueeElement || !marqueeTrack || !sourceGroup) return;

    const clonedGroups = Array.from(marqueeTrack.querySelectorAll('.wrapper_main4_partners_group')).slice(1);
    clonedGroups.forEach((clonedGroup) => clonedGroup.remove());

    const trackGap = parseFloat(window.getComputedStyle(marqueeTrack).gap || '0');
    const sourceWidth = Math.ceil(sourceGroup.getBoundingClientRect().width);

    if (!sourceWidth) return;

    const cycleWidth = sourceWidth + trackGap;
    const viewportWidth = window.innerWidth;
    const requiredCopies = Math.max(3, Math.ceil((viewportWidth * 2 + cycleWidth) / cycleWidth));

    for (let copyIndex = 1; copyIndex < requiredCopies; copyIndex += 1) {
        const clonedGroup = sourceGroup.cloneNode(true);
        clonedGroup.setAttribute('aria-hidden', 'true');

        clonedGroup.querySelectorAll('img').forEach((imageElement) => {
            imageElement.alt = '';
        });

        marqueeTrack.appendChild(clonedGroup);
    }

    marqueeTrack.style.setProperty('--main4-partners-cycle-width', `${cycleWidth}px`);
}
