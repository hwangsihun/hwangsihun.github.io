import '../style/global.css';

document.addEventListener('DOMContentLoaded', () => {
    const monthData = generateMonthData();
    renderWebCalendar(monthData);
    renderMobileCalendar(monthData);
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
        dayNameColor: isWeekend ? '#B7BDC7' : isHighlighted ? '#0A66FF' : '#111827',
    };
}

function getLocalISODate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function generateMonthData() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const lastDay = new Date(year, month + 1, 0).getDate();
    const data = [];

    for (let day = 1; day <= lastDay; day++) {
        const date = new Date(year, month, day);
        const iso = getLocalISODate(year, month, day);
        const dayOfWeek = date.getDay();

        data.push({
            day,
            iso,
            dayOfWeek,
            weekdayLabel: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            style: getDateStyle(iso, dayOfWeek),
        });
    }

    return {
        year,
        month,
        startingDayOfWeek: new Date(year, month, 1).getDay(),
        days: data,
    };
}

function renderWebCalendar(monthData) {
    const dateBar = document.getElementById('date-bar');
    if (!dateBar) return;

    let weekWrapper = document.createElement('div');
    weekWrapper.style.display = 'flex';
    weekWrapper.style.gap = '8px';

    monthData.days.forEach((d, idx) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';

        const dayNameDiv = document.createElement('div');
        dayNameDiv.textContent = d.weekdayLabel;
        dayNameDiv.style.fontSize = '12px';
        dayNameDiv.style.marginBottom = '4px';
        dayNameDiv.style.fontWeight = '800';
        dayNameDiv.style.color = d.style.dayNameColor;

        const dateCircle = document.createElement('div');
        dateCircle.textContent = d.day;
        dateCircle.style.display = 'flex';
        dateCircle.style.alignItems = 'center';
        dateCircle.style.justifyContent = 'center';
        dateCircle.style.width = '30px';
        dateCircle.style.height = '30px';
        dateCircle.style.borderRadius = '9999px';
        dateCircle.style.fontSize = '16px';
        dateCircle.style.fontWeight = '600';
        dateCircle.style.backgroundColor = d.style.bgColor;
        dateCircle.style.color = d.style.textColor;

        container.appendChild(dayNameDiv);
        container.appendChild(dateCircle);
        weekWrapper.appendChild(container);

        if (d.dayOfWeek === 0 || idx === monthData.days.length - 1) {
            dateBar.appendChild(weekWrapper);

            if (idx !== monthData.days.length - 1) {
                const separator = document.createElement('div');
                separator.style.width = '1px';
                separator.style.height = '44px';
                separator.style.borderRight = '1px dashed black';
                separator.style.margin = '0 8px';
                dateBar.appendChild(separator);
            }

            weekWrapper = document.createElement('div');
            weekWrapper.style.display = 'flex';
            weekWrapper.style.gap = '4px';
        }
    });
}

function renderMobileCalendar(monthData) {
    const calendarGrid = document.getElementById('mobile-calendar-grid');
    if (!calendarGrid) return;

    calendarGrid.innerHTML = '';

    for (let i = 0; i < monthData.startingDayOfWeek; i++) {
        calendarGrid.appendChild(document.createElement('div'));
    }

    monthData.days.forEach((d) => {
        const dateCell = document.createElement('div');
        dateCell.className = 'grid place-items-center';

        if (d.style.isWeekend || d.style.isHighlighted) {
            const span = document.createElement('span');
            span.className =
                'grid h-10 w-10 place-items-center rounded-full text-[16px] font-semibold';
            span.style.backgroundColor = d.style.bgColor;
            span.style.color = d.style.textColor;
            span.textContent = d.day;
            dateCell.appendChild(span);
        } else {
            dateCell.className = 'grid place-items-center text-[17px] font-medium';
            dateCell.style.color = d.style.textColor;
            dateCell.textContent = d.day;
        }

        calendarGrid.appendChild(dateCell);
    });
}
