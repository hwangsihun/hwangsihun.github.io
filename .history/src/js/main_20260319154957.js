import '../style/global.css';

document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
});

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

    const highlightDates = ['2026-03-05', '2026-03-09', '2026-03-16', '2026-03-23', '2026-03-30'];

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
            dateCircle.style.backgroundColor = '#006EFF';
            dateCircle.style.color = '#ffffff';
            dayNameDiv.style.color = '#006EFF';
        }

        // 오늘 스타일
        if (iso === today.toISOString().slice(0, 10)) {
            dateCircle.style.backgroundColor = '#006EFF';
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
                dateBar.appendChild(separator);
            }

            weekWrapper = document.createElement('div');
            weekWrapper.style.display = 'flex';
        }
    });
}
