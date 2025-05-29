document.addEventListener('DOMContentLoaded', () => {
    // Estado global
    let miniCurrentDate = new Date();
    let mainCurrentDate = new Date();
    let activeCell = null;
    let tasks = [];
    let currentUserId = null;
    let editingTaskIndex = null;    

    // Elementos do DOM
    const elements = {
        miniPrevMonthBtn: document.getElementById('miniPrevMonth'),
        miniNextMonthBtn: document.getElementById('miniNextMonth'),
        miniCurrentMonthYear: document.getElementById('miniCurrentMonthYear'),
        miniCalendar: document.querySelector('.mini-calendar'),
        calendarGrid: document.querySelector('.calendar-grid'),
        weekRangeDisplay: document.querySelector('.week-range'),
        arrowBack: document.querySelector('.calendar-controls .arrow:first-child button'),
        arrowForward: document.querySelector('.calendar-controls .arrow:last-child button'),
        taskEditor: document.getElementById('task-editor'),
        taskTitle: document.getElementById('task-title'),
        startTime: document.getElementById('start-time'),
        endTime: document.getElementById('end-time'),
        taskCategory: document.getElementById('task-category'),
        taskPriority: document.getElementById('task-priority'),
        addTaskBtn: document.getElementById('add-task'),
        cancelTaskBtn: document.getElementById('cancel-task'),
        logoutBtn: document.getElementById('logout-btn'),        
        editPageTaskBtn: document.getElementById('edit-page-task'),      
    };
    // --- Funções de LocalStorage ---
    function getTasksFromStorage(userId) {
        const tasksJson = localStorage.getItem(`tasks_${userId}`);
        return tasksJson ? JSON.parse(tasksJson) : [];
    }
    // --- Salva as tarefas do usuário no localStorage ---
    function saveTasksToStorage(userId, tasks) {
        localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
    }

    // --- Verificação de Usuário Logado ---
    function getLoggedInUser() {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        for (const user of usuarios) {
            const userData = localStorage.getItem(user.email);
            if (userData) {
                return JSON.parse(userData);
            }
        }
        return null;
    }
     // --- Inicia a agenda carregando tarefas e verificando login --- 
    function initializeUser() {
        const user = getLoggedInUser();
        if (!user) {
            alert('Você precisa estar logado para usar a agenda.');
            window.location.href = '../login/index.html';
            return;
        }
        currentUserId = user.email.toLowerCase();
        tasks = getTasksFromStorage(currentUserId);
        renderMainCalendar();
    }

    // --- Função de Logout ---
    function logout() {
        if (currentUserId) {
            // Remove apenas a chave do usuário logado (ex.: teste1@gmail.com)
            // Preserva as tarefas (tasks_${currentUserId}) e a lista de usuários (usuarios)
            localStorage.removeItem(currentUserId);
            currentUserId = null;
            tasks = []; // Limpa as tarefas locais apenas para a sessão atual
            alert('Logout realizado com sucesso!');
            window.location.href = '../login/index.html';
        }
    }

    // --- Mini-Calendário ---
    function renderMiniCalendar() {
        const year = miniCurrentDate.getFullYear();
        const month = miniCurrentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const dayOfWeekOfFirstDay = firstDayOfMonth.getDay();

        elements.miniCurrentMonthYear.textContent = new Intl.DateTimeFormat('pt-BR', {
            month: 'short',
            year: 'numeric',
        }).format(miniCurrentDate);

        elements.miniCalendar.querySelectorAll('.mini-day, div:not([class]):not([id])').forEach(el => el.remove());

        for (let i = 0; i < dayOfWeekOfFirstDay; i++) {
            elements.miniCalendar.appendChild(document.createElement('div'));
        }

        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('mini-day');
            dayDiv.textContent = day;

            if (
                year === today.getFullYear() &&
                month === today.getMonth() &&
                day === today.getDate()
            ) {
                dayDiv.classList.add('today');
            }

            dayDiv.addEventListener('click', () => {
                const selectedDate = new Date(year, month, day);
                mainCurrentDate = selectedDate;
                renderMainCalendar();
            });

            elements.miniCalendar.appendChild(dayDiv);
        }

        const totalChildren = elements.miniCalendar.children.length;
        const expectedChildren = Math.ceil((dayOfWeekOfFirstDay + daysInMonth) / 7) * 7 + 7;
        for (let i = totalChildren; i < expectedChildren; i++) {
            elements.miniCalendar.appendChild(document.createElement('div'));
        }
    }

    function changeMiniMonth(delta) {
        miniCurrentDate.setMonth(miniCurrentDate.getMonth() + delta);
        renderMiniCalendar();
    }

    // --- Calendário Principal ---
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    }

    function renderMainCalendar() {
        const today = new Date();
        const currentHour = today.getHours();
        const daysOfWeekShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

        const firstDayOfWeek = new Date(mainCurrentDate);
        firstDayOfWeek.setDate(mainCurrentDate.getDate() - mainCurrentDate.getDay());

        document.querySelectorAll('.day-header').forEach((header, index) => {
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

            header.classList.toggle(
                'today-header',
                displayDate.getDate() === today.getDate() &&
                displayDate.getMonth() === today.getMonth() &&
                displayDate.getFullYear() === today.getFullYear()
            );
        });

        elements.calendarGrid.querySelectorAll('.time-slot:not(.header), .cell').forEach(el => el.remove());

        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot');
            timeSlot.textContent = `${String(hour).padStart(2, '0')}:00`;

            if (
                hour === currentHour &&
                mainCurrentDate.getDate() === today.getDate() &&
                mainCurrentDate.getMonth() === today.getMonth() &&
                mainCurrentDate.getFullYear() === today.getFullYear()
            ) {
                timeSlot.classList.add('current-hour');
            }

            elements.calendarGrid.appendChild(timeSlot);

            for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                const cellDate = new Date(firstDayOfWeek);
                cellDate.setDate(firstDayOfWeek.getDate() + dayOffset);
                cellDate.setHours(hour, 0, 0, 0);
                cell.setAttribute('data-date', cellDate.toISOString());
                elements.calendarGrid.appendChild(cell);
            }
        }

        tasks.forEach(task => {
            const cell = elements.calendarGrid.querySelector(`.cell[data-date="${task.date}"]`);
            if (cell) {
                const label = document.createElement('div');
                label.classList.add('event-label');
                label.textContent = `${task.title} (${task.category}, P${task.priority})`;
                label.addEventListener('click', (e) => {
                    e.stopPropagation(); // Impede que o clique também dispare o editor da célula
                    openTaskEditor(cell, task);
                });
                cell.appendChild(label);
            }
        });

        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        elements.weekRangeDisplay.textContent = `${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}`;
    }

    // --- Editor de Tarefas ---
function openTaskEditor(cell, task = null) {
    activeCell = cell;
    const rect = cell.getBoundingClientRect();
    elements.taskEditor.style.top = `${rect.bottom + window.scrollY + 5}px`;
    elements.taskEditor.style.left = `${rect.left + window.scrollX}px`;
    elements.taskEditor.classList.remove('hidden');

    if (task) {
        editingTaskIndex = tasks.findIndex(t =>
            t.date === task.date &&
            t.title === task.title &&
            t.category === task.category &&
            t.priority === task.priority
        );

        elements.taskTitle.value = task.title;
        elements.startTime.value = task.startTime || '';
        elements.endTime.value = task.endTime || '';
        elements.taskCategory.value = task.category;
        elements.taskPriority.value = task.priority;

        elements.addTaskBtn.classList.add('hidden');
        elements.editTaskBtn.classList.remove('hidden');
        elements.deleteTaskBtn.classList.remove('hidden');
        elements.editPageTaskBtn.classList.remove('hidden'); // MOSTRA 
    } else {
        editingTaskIndex = null;
        elements.taskTitle.value = '';
        const cellDateStr = cell.getAttribute('data-date');
        const clickedDate = new Date(cellDateStr);
        const start = new Date(clickedDate);
        const end = new Date(start.getTime() + 30 * 60000);

        const formatDateToInput = date => {
            const pad = num => String(num).padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        };

        elements.startTime.value = formatDateToInput(start);
        elements.endTime.value = formatDateToInput(end);
        elements.taskCategory.value = 'trabalho';
        elements.taskPriority.value = '2';

        elements.addTaskBtn.classList.remove('hidden'); 
        elements.editTaskBtn.classList.add('hidden');
        elements.deleteTaskBtn.classList.add('hidden'); // ESCONDE
        elements.editPageTaskBtn.classList.add('hidden'); 
        }
    }
/* função começa editar e excluir */
function updateTask() {
    if (editingTaskIndex === null || !activeCell) return;

    const title = elements.taskTitle.value.trim();
    const updatedTask = {
        date: activeCell.getAttribute('data-date'),
        title,
        category: elements.taskCategory.value,
        priority: elements.taskPriority.value,
        startTime: elements.startTime.value,
        endTime: elements.endTime.value,
    };

    tasks[editingTaskIndex] = updatedTask;
    saveTasksToStorage(currentUserId, tasks);
    renderMainCalendar();
    elements.taskEditor.classList.add('hidden');
}

function deleteTask() {
    if (editingTaskIndex === null) return;
    tasks.splice(editingTaskIndex, 1);
    saveTasksToStorage(currentUserId, tasks);
    renderMainCalendar();
    elements.taskEditor.classList.add('hidden');
}
/* função fim editar e excluir */
    function saveTask() {
        if (!currentUserId) {
            alert('Por favor, faça login para salvar tarefas.');
            window.location.href = '../login/index.html';
            return;
        }

        const title = elements.taskTitle.value.trim();
        if (!title || !activeCell) return;

        const task = {
            date: activeCell.getAttribute('data-date'),
            title,
            category: elements.taskCategory.value,
            priority: elements.taskPriority.value,
            startTime: elements.startTime.value,
            endTime: elements.endTime.value,
        };

        tasks.push(task);
        saveTasksToStorage(currentUserId, tasks);
        renderMainCalendar(); // Atualiza todas as grids e adiciona os eventos

        const label = document.createElement('div');
        label.classList.add('event-label');
        label.textContent = `${title} (${task.category}, P${task.priority})`;
        activeCell.appendChild(label);

        elements.taskEditor.classList.add('hidden');
    }

    // --- Eventos ---
    elements.miniPrevMonthBtn.addEventListener('click', () => changeMiniMonth(-1));
    elements.miniNextMonthBtn.addEventListener('click', () => changeMiniMonth(1));

    elements.arrowBack.addEventListener('click', () => {
        mainCurrentDate.setDate(mainCurrentDate.getDate() - 7);
        renderMainCalendar();
    });

    elements.arrowForward.addEventListener('click', () => {
        mainCurrentDate.setDate(mainCurrentDate.getDate() + 7);
        renderMainCalendar();
    });

    elements.calendarGrid.addEventListener('click', e => {
        const cell = e.target.closest('.cell');
        if (cell) openTaskEditor(cell);
    });

    elements.addTaskBtn.addEventListener('click', saveTask);
    elements.cancelTaskBtn.addEventListener('click', () => {
        elements.taskEditor.classList.add('hidden');
    });

    // Evento de logout
    elements.logoutBtn = document.getElementById('logout-btn');
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', logout);
    }
    elements.editTaskBtn = document.getElementById('save-task');
    elements.deleteTaskBtn = document.getElementById('delete-task');

    elements.editTaskBtn.addEventListener('click', updateTask);
    elements.deleteTaskBtn.addEventListener('click', deleteTask);
    
    const goToNewTaskBtn = document.getElementById('nova-tarefa');
    if (goToNewTaskBtn) {
        goToNewTaskBtn.addEventListener('click', () => {
            window.location.href = '../newtask/index.html';
        });
    }
    elements.editPageTaskBtn.addEventListener('click', () => {
        window.location.href = '../newtask/index.html';
    });
    const profileButton = document.getElementById('botao-perfil');
    const profileDropdown = document.getElementById('perfil-dropdown');
    // Alterna a visibilidade da caixa ao clicar no botão
    profileButton.addEventListener('click', () => {
        profileDropdown.classList.toggle('hidden');
    });

    // Fecha o menu se clicar fora dele
    document.addEventListener('click', (event) => {
        if (!profileButton.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.classList.add('hidden');
        }
    });

    // --- Inicialização ---
    initializeUser();
    renderMiniCalendar();
});