document.addEventListener('DOMContentLoaded', () => {
    updateMonthDisplay();
    initializeCalendar();
    initializeMobileCalendar();
});

const CALENDAR_SELECTOR = '.container_calendar_pc';
const TRACK_SELECTOR = '.track_calendar_pc';
const WEEKDAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
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

function createDayItem(dayItem) {
    const item = document.createElement('li');
    const label = document.createElement('strong');
    const number = document.createElement('span');
    const iso = getLocalISODate(dayItem.getFullYear(), dayItem.getMonth(), dayItem.getDate());
    const style = getDateStyle(iso, dayItem.getDay());

    item.className = 'item_calendar_pc';
    label.className = `label_calendar_pc ${style.isHighlighted ? 'text_mint' : 'text_black'}`;
    label.textContent = WEEKDAY_LABELS[dayItem.getDay()];
    number.className = 'number_calendar_pc text_black';

    if (style.isHighlighted) {
        item.classList.add('is_event_calendar_pc', 'is_accent_calendar_pc');
        number.classList.add('bg_mint');
    } else if (style.isWeekend) {
        item.classList.add('is_off_calendar_pc');
        number.classList.remove('text_black');
        number.classList.add('bg_lightGray', 'text_lightgray');
    } else {
        number.classList.add('bg_transparent');
    }

    number.textContent = dayItem.getDate();
    item.appendChild(label);
    item.appendChild(number);

    return item;
}

function createSeparator() {
    const separator = document.createElement('li');
    const line = document.createElement('span');

    line.className = 'separator_calendar_pc line_darkGray';
    separator.className = 'line_calendar_pc';
    separator.setAttribute('aria-hidden', 'true');
    separator.appendChild(line);

    return separator;
}

function initializeCalendar() {
    const calendars = document.querySelectorAll(CALENDAR_SELECTOR);
    if (calendars.length === 0) return;

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

    calendars.forEach((calendarRoot) => {
        const dateBar = calendarRoot.querySelector(TRACK_SELECTOR);
        if (!dateBar) return;

        dateBar.innerHTML = '';

        days.forEach((dayItem, index) => {
            dateBar.appendChild(createDayItem(dayItem));

            if (dayItem.getDay() === 0 && index !== days.length - 1) {
                dateBar.appendChild(createSeparator());
            }
        });
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
            span.className = `calendar-mobile-highlight ${style.isHighlighted ? 'bg_mint text_black' : 'bg_lightGray text_lightgray'}`;
            span.textContent = day;
            dateCell.appendChild(span);
        } else {
            dateCell.className += ' text_black';
            dateCell.textContent = day;
        }

        calendarGrid.appendChild(dateCell);
    }
}