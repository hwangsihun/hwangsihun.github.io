import '../style/global.css';

document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    initializeMobileCalendar();
});

const highlightDates = [
    '2026-03-02',
    '2026-03-05',
    '2026-03-09',
    '2026-03-12',
    '2026-03-16',
    '2026-03-19',
    '2026-03-23',
    '2026-03-26',
    '2026-03-31',
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
    weekWrapper.style.display = 'flex';
    weekWrapper.style.gap = '8px';

    days.forEach((d, idx) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';

        const dayNameDiv = document.createElement('div');
        dayNameDiv.textContent = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        dayNameDiv.style.fontSize = '12px';
        dayNameDiv.style.marginBottom = '4px';
        dayNameDiv.style.fontWeight = '800';

        const dateCircle = document.createElement('div');
        dateCircle.textContent = d.getDate();
        dateCircle.style.display = 'flex';
        dateCircle.style.alignItems = 'center';
        dateCircle.style.justifyContent = 'center';
        dateCircle.style.width = '30px';
        dateCircle.style.height = '30px';
        dateCircle.style.borderRadius = '9999px';
        dateCircle.style.fontSize = '16px';
        dateCircle.style.fontWeight = '600';

        const iso = getLocalISODate(d.getFullYear(), d.getMonth(), d.getDate());
        const style = getDateStyle(iso, d.getDay());

        dateCircle.style.backgroundColor = style.bgColor;
        dateCircle.style.color = style.textColor;
        dayNameDiv.style.color = style.dayNameColor;

        container.appendChild(dayNameDiv);
        container.appendChild(dateCircle);
        weekWrapper.appendChild(container);

        if (d.getDay() === 0 || idx === days.length - 1) {
            dateBar.appendChild(weekWrapper);

            if (idx !== days.length - 1) {
                const separator = document.createElement('div');
                separator.style.width = '1px';
                separator.style.height = '44px';
                separator.style.borderRight = '1px dashed black';
                separator.style.marginLeft = '8px';
                separator.style.marginRight = '8px';
                dateBar.appendChild(separator);
            }

            weekWrapper = document.createElement('div');
            weekWrapper.style.display = 'flex';
            weekWrapper.style.gap = '4px';
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

    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'grid place-items-center';
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const iso = getLocalISODate(currentYear, currentMonth, day);
        const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
        const style = getDateStyle(iso, dayOfWeek);

        const dateCell = document.createElement('div');
        dateCell.className = 'grid place-items-center';

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';

        const dayName = document.createElement('div');
        dayName.textContent = new Date(currentYear, currentMonth, day)
            .toLocaleDateString('en-US', { weekday: 'short' })
            .toUpperCase();
        dayName.style.fontSize = '12px';
        dayName.style.marginBottom = '4px';
        dayName.style.fontWeight = '700';
        dayName.style.color = style.dayNameColor;

        const dateCircle = document.createElement('div');
        dateCircle.textContent = day;
        dateCircle.style.display = 'flex';
        dateCircle.style.alignItems = 'center';
        dateCircle.style.justifyContent = 'center';
        dateCircle.style.width = '40px';
        dateCircle.style.height = '40px';
        dateCircle.style.borderRadius = '9999px';
        dateCircle.style.fontSize = '16px';
        dateCircle.style.fontWeight = '600';
        dateCircle.style.backgroundColor = style.bgColor;
        dateCircle.style.color = style.textColor;

        wrapper.appendChild(dayName);
        wrapper.appendChild(dateCircle);
        dateCell.appendChild(wrapper);
        calendarGrid.appendChild(dateCell);
    }
}
