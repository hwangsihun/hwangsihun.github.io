document.addEventListener('DOMContentLoaded', () => {
    updateMonthDisplay();
    initializeCalendar();
    initializeMobileCalendar();
});

const highlightDates = [
    '2026-04-02',
    '2026-04-05',
    '2026-04-09',
    '2026-04-12',
    '2026-04-16',
    '2026-04-17',
    '2026-04-23',
    '2026-04-26',
];

function getDateStyle(iso, dayOfWeek) {
    const isWeekend = [0, 6].includes(dayOfWeek);
    const isHighlighted = highlightDates.includes(iso);

    return {
        isWeekend,
        isHighlighted,
        bgColor: isWeekend ? '#EDEDED' : isHighlighted ? '#0A66FF' : 'transparent',
        textColor: isWeekend ? '#D1D5DB' : isHighlighted ? '#ffffff' : '#111827',
        dayNameColor: isWeekend ? '#8F8F8F' : isHighlighted ? '#0A66FF' : '#111827',
    };
}

function getLocalISODate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function updateMonthDisplay() {
    const monthElements = document.querySelectorAll('.current-month');
    const today = new Date();
    const currentMonth = today.getMonth() + 1;

    monthElements.forEach((element) => {
        element.textContent = currentMonth;
    });
}

function initializeCalendar() {
    const dateBar = document.getElementById('date-bar');
    if (!dateBar) return;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const getDaysInMonth = (year, month) => {
        const days = [];
        const date = new Date(year, month, 1);

        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        return days;
    };

    const days = getDaysInMonth(currentYear, currentMonth);
    let weekWrapper = document.createElement('div');
    weekWrapper.className = 'flex gap8';

    days.forEach((dayItem, index) => {
        const container = document.createElement('div');
        container.className = 'flex col aic';

        const dayNameDiv = document.createElement('div');
        dayNameDiv.textContent = dayItem
            .toLocaleDateString('en-US', { weekday: 'short' })
            .toUpperCase();
        dayNameDiv.className = 'fs12 fw600 mb4px';

        const dateCircle = document.createElement('div');
        dateCircle.textContent = dayItem.getDate();
        dateCircle.className = 'flex_aic jcc w32px h32px rfull fs16 fw600';

        const iso = getLocalISODate(dayItem.getFullYear(), dayItem.getMonth(), dayItem.getDate());
        const style = getDateStyle(iso, dayItem.getDay());

        dateCircle.style.backgroundColor = style.bgColor;
        dateCircle.style.color = style.textColor;
        dayNameDiv.style.color = style.dayNameColor;

        container.appendChild(dayNameDiv);
        container.appendChild(dateCircle);
        weekWrapper.appendChild(container);

        if (dayItem.getDay() === 0 || index === days.length - 1) {
            dateBar.appendChild(weekWrapper);

            if (index !== days.length - 1) {
                const separator = document.createElement('div');
                separator.style.width = '1px';
                separator.style.height = '44px';
                separator.style.borderRight = '1px dashed black';
                separator.style.marginLeft = '8px';
                separator.style.marginRight = '8px';
                dateBar.appendChild(separator);
            }

            weekWrapper = document.createElement('div');
            weekWrapper.className = 'flex gap4';
        }
    });
}

function initializeMobileCalendar() {
    const calendarGrid = document.getElementById('mobile-calendar-grid');
    if (!calendarGrid) return;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    calendarGrid.innerHTML = '';

    for (let index = 0; index < startingDayOfWeek; index += 1) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-empty-cell';
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        const iso = getLocalISODate(currentYear, currentMonth, day);
        const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
        const style = getDateStyle(iso, dayOfWeek);
        const dateCell = document.createElement('div');

        dateCell.className = 'calendar-mobile-date';

        if (style.isWeekend || style.isHighlighted) {
            const span = document.createElement('span');
            span.className = 'calendar-mobile-highlight';
            span.style.backgroundColor = style.bgColor;
            span.style.color = style.isHighlighted ? '#ffffff' : style.textColor;
            span.textContent = day;
            dateCell.appendChild(span);
        } else {
            dateCell.textContent = day;
        }

        calendarGrid.appendChild(dateCell);
    }
}
