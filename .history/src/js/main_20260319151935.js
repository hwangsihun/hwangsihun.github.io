// 메인 스타일 임포트
import '../style/global.css';

// DOM 로드 완료 이벤트
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Tailwind CSS & Styles loaded successfully!');

    // 캘린더 함수
    initializeCalendar();
});

/**
 * 캘린더 초기화 함수
 */
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
    weekWrapper.style.alignItems = 'center';
    weekWrapper.style.gap = '4px';

    days.forEach((d, idx) => {
        const dayDiv = document.createElement('div');
        dayDiv.style.display = 'flex';
        dayDiv.style.flexDirection = 'column';
        dayDiv.style.alignItems = 'center';
        dayDiv.style.justifyContent = 'center';
        dayDiv.style.width = '48px';
        dayDiv.style.height = '48px';
        dayDiv.style.borderRadius = '9999px';
        dayDiv.style.cursor = 'pointer';

        const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const dateStr = d.getDate();

        if ([0, 6].includes(d.getDay())) dayDiv.style.color = '#9CA3AF';
        if (d.toDateString() === today.toDateString()) {
            dayDiv.style.backgroundColor = '#3B82F6';
            dayDiv.style.color = 'white';
        }
        if (highlightDates.includes(d.toISOString().slice(0, 10))) {
            dayDiv.style.backgroundColor = '#DBEAFE';
            dayDiv.style.color = '#1D4ED8';
        }

        const dayNameDiv = document.createElement('div');
        dayNameDiv.textContent = dayOfWeek;
        dayNameDiv.style.fontSize = '10px';
        dayNameDiv.style.marginBottom = '4px';

        const dateDiv = document.createElement('div');
        dateDiv.textContent = dateStr;
        dateDiv.style.fontSize = '14px';
        dateDiv.style.fontWeight = '600';

        dayDiv.appendChild(dayNameDiv);
        dayDiv.appendChild(dateDiv);
        weekWrapper.appendChild(dayDiv);

        if (d.getDay() === 6 || idx === days.length - 1) {
            const separator = document.createElement('div');
            separator.style.width = '1px';
            separator.style.height = '44px';
            separator.style.borderRight = '1px dashed black';
            separator.style.marginLeft = '4px';
            weekWrapper.appendChild(separator);

            dateBar.appendChild(weekWrapper);
            weekWrapper = document.createElement('div');
            weekWrapper.style.display = 'flex';
            weekWrapper.style.alignItems = 'center';
            weekWrapper.style.gap = '8px';
        }
    });
}
