document.addEventListener('DOMContentLoaded', function() {
    // Mini Calendário
    const miniPrevMonthBtn = document.getElementById('miniPrevMonth');
    const miniNextMonthBtn = document.getElementById('miniNextMonth');
    const miniCurrentMonthYear = document.getElementById('miniCurrentMonthYear');
    const miniCalendar = document.querySelector('.mini-calendar');
    let miniCurrentDate = new Date();

    function renderMiniCalendar() {
        const year = miniCurrentDate.getFullYear();
        const month = miniCurrentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const dayOfWeekOfFirstDay = firstDayOfMonth.getDay();

        miniCurrentMonthYear.textContent = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(miniCurrentDate);

        // Remove apenas os elementos com a classe 'mini-day' e os divs vazios (sem classe ou id) que representam os dias vazios
        const existingDays = miniCalendar.querySelectorAll('.mini-day');
        existingDays.forEach(day => day.remove());

        const existingEmpty = miniCalendar.querySelectorAll('div:not([class]):not([id])');
        existingEmpty.forEach(empty => empty.remove());

        // Adiciona os dias vazios no início
        for (let i = 0; i < dayOfWeekOfFirstDay; i++) {
            const emptyDiv = document.createElement('div');
            miniCalendar.appendChild(emptyDiv);
        }

        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Adiciona os dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('mini-day');
            dayDiv.textContent = day;

            if (year === currentYear && month === currentMonth && day === currentDay) {
                dayDiv.classList.add('today');
            }

            dayDiv.addEventListener('click', () => {
                const selectedDate = new Date(year, month, day);
                console.log('Data selecionada:', selectedDate);
                // Aqui você pode adicionar a lógica para comunicar com seu calendário principal
            });

            miniCalendar.appendChild(dayDiv);
        }

        // Adiciona os dias vazios no final para completar a última semana
        const totalChildren = miniCalendar.children.length;
        const expectedChildren = Math.ceil((dayOfWeekOfFirstDay + daysInMonth) / 7) * 7 + 7; // +7 para os dias da semana
        for (let i = totalChildren; i < expectedChildren; i++) {
            const emptyDiv = document.createElement('div');
            miniCalendar.appendChild(emptyDiv);
        }
    }

    function changeMiniMonth(delta) {
        miniCurrentDate.setMonth(miniCurrentDate.getMonth() + delta);
        renderMiniCalendar();
    }

    miniPrevMonthBtn.addEventListener('click', () => changeMiniMonth(-1));
    miniNextMonthBtn.addEventListener('click', () => changeMiniMonth(1));

    renderMiniCalendar();

    // Calendário Principal (Grade de Horários)
    const calendarGrid = document.querySelector('.calendar-grid');
    const dayHeaders = document.querySelectorAll('.day-header');
    const weekRangeDisplay = document.querySelector('.week-range');
    const arrowBack = document.querySelector('.calendar-controls .arrow:first-child button');
    const arrowForward = document.querySelector('.calendar-controls .arrow:last-child button');

    let currentDate = new Date();

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    }


    // Função para destacar a coluna do dia
    function expandDay(dayIndex) {
        // Remove a classe de destaque de qualquer coluna previamente destacada
        calendarGrid.querySelectorAll('.cell.expanded-day').forEach(cell => cell.classList.remove('expanded-day'));

        // Seleciona todas as células da coluna do dia clicado
        const cellsToExpand = calendarGrid.querySelectorAll(`.cell:nth-child(8n + ${dayIndex + 2})`);
        // O seletor :nth-child(8n + k) seleciona elementos que estão nas posições k, k+8, k+16, etc.
        // Aqui, +2 é usado porque o primeiro filho é o header vazio.

        // Adiciona a classe de destaque a essas células
        cellsToExpand.forEach(cell => cell.classList.add('expanded-day'));
    }
    function renderMainCalendar(date) {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const currentHour = today.getHours(); // Obtém a hora atual

    const daysOfWeekShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate() - date.getDay());

    const dayHeaders = document.querySelectorAll('.day-header');
    dayHeaders.forEach((header, index) => {
        const displayDate = new Date(firstDayOfWeek);
        displayDate.setDate(firstDayOfWeek.getDate() + index);

        header.innerHTML = '';
        const dayAbbreviation = document.createElement('div');
        dayAbbreviation.classList.add('day-abbreviation');
        dayAbbreviation.textContent = daysOfWeekShort[index];
        const dayNumber = document.createElement('div');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = displayDate.getDate();
        header.appendChild(dayAbbreviation);
        header.appendChild(dayNumber);

        header.classList.remove('today-header');
        if (displayDate.getDate() === today.getDate() &&
            displayDate.getMonth() === today.getMonth() &&
            displayDate.getFullYear() === today.getFullYear()) {
            header.classList.add('today-header');
        }
    });

    const existingRows = calendarGrid.querySelectorAll('.time-slot:not(.header), .cell');
    existingRows.forEach(row => row.remove());

    for (let hour = 0; hour < 24; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.classList.add('time-slot');
        timeSlot.textContent = `${String(hour).padStart(2, '0')}:00`;

        // Adiciona uma classe especial à célula da hora atual
        if (hour === currentHour &&
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()) {
            timeSlot.classList.add('current-hour');
        }

        calendarGrid.appendChild(timeSlot);

        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            calendarGrid.appendChild(cell);
        }
    }

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    weekRangeDisplay.textContent = `${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}`;
}

    renderMainCalendar(currentDate);

    arrowBack.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        renderMainCalendar(currentDate);
    });

    arrowForward.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        renderMainCalendar(currentDate);
    });
});