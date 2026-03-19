import '../style/global.css';

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Tailwind CSS & Styles loaded successfully!');
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
    weekWrapper.style.alignItems = 'center';
    weekWrapper.style.gap = '4px';

    days.forEach((d, idx) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';

        const dayNameDiv = document.createElement('div');
        dayNameDiv.textContent = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        dayNameDiv.style.fontSize = '11px';
        dayNameDiv.style.marginBottom = '4px';

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

        if ([0, 6].includes(d.getDay())) {
            dateCircle.style.backgroundColor = '#f5f5f5';
            dateCircle.style.color = '#E0E0E0';
            dayNameDiv.style.color = '#E0E0E0';
        }

        if (iso === today.toISOString().slice(0, 10)) {
            dateCircle.style.backgroundColor = '#006EFF';
            dateCircle.style.color = '#ffffff';
        }

        if (highlightDates.includes(iso)) {
            dateCircle.style.backgroundColor = '#006EFF';
            dateCircle.style.color = '#ffffff';
        }

        container.appendChild(dayNameDiv);
        container.appendChild(dateCircle);
        weekWrapper.appendChild(container);

        if (d.getDay() === 7 || idx === days.length - 1) {
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
