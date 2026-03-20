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
const closedDates = [
    '2026-03-03',
    '2026-03-04',
    '2026-03-10',
    '2026-03-11',
    '2026-03-17',
    '2026-03-18',
    '2026-03-24',
    '2026-03-25',
];

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
        dayNameDiv.style.fontWeight = '800'; // 기본

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

        const iso = d.toISOString().slice(0, 10);

        // 주말 스타일
        if ([0, 6].includes(d.getDay())) {
            dateCircle.style.backgroundColor = '#f5f5f5';
            dateCircle.style.color = '#E0E0E0';
            dayNameDiv.style.color = '#8F8F8F';
        }

        // 지정 날짜 스타일
        if (highlightDates.includes(iso)) {
            dateCircle.style.backgroundColor = '#0A66FF';
            dateCircle.style.color = '#ffffff';
            dayNameDiv.style.color = '#0A66FF';
        }

        // 오늘 스타일
        if (iso === today.toISOString().slice(0, 10)) {
            dateCircle.style.backgroundColor = '#0A66FF';
            dateCircle.style.color = '#ffffff';
        }

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

    // 월의 첫 번째 날과 마지막 날을 구함
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // 기존 내용 제거
    calendarGrid.innerHTML = '';

    // 빈 셀 추가 (월의 첫 번째 날 이전)
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'grid place-items-center';
        calendarGrid.appendChild(emptyCell);
    }

    // 날짜 셀 추가
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const iso = date.toISOString().slice(0, 10);
        const dayOfWeek = date.getDay();

        const dateCell = document.createElement('div');
        dateCell.className = 'grid place-items-center';

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            // 주말
            const span = document.createElement('span');
            span.className =
                'grid h-10 w-10 place-items-center rounded-full bg-[#EDEDED] text-[16px] font-semibold text-[#D1D5DB] sm:h-11 sm:w-11 sm:text-[17px]';
            span.textContent = day;
            dateCell.appendChild(span);
        } else if (highlightDates.includes(iso)) {
            // 이벤트 날짜
            const span = document.createElement('span');
            span.className =
                'grid h-10 w-10 place-items-center rounded-full bg-[#0A66FF] text-[16px] font-semibold text-white sm:h-11 sm:w-11 sm:text-[17px]';
            span.textContent = day;
            dateCell.appendChild(span);
        } else if (closedDates.includes(iso)) {
            // 휴관 날짜
            const span = document.createElement('span');
            span.className =
                'grid h-10 w-10 place-items-center rounded-full bg-[#EDEDED] text-[16px] font-semibold text-[#D1D5DB] sm:h-11 sm:w-11 sm:text-[17px]';
            span.textContent = day;
            dateCell.appendChild(span);
        } else {
            // 일반 날짜
            dateCell.className =
                'grid place-items-center text-[17px] font-medium text-[#111827] sm:text-[18px]';
            dateCell.textContent = day;
        }

        calendarGrid.appendChild(dateCell);
    }
}
