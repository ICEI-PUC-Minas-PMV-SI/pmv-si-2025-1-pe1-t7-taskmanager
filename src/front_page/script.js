document.addEventListener('DOMContentLoaded', () => {
    // Estado global
    let miniCurrentDate = new Date();
    let mainCurrentDate = new Date();
    let activeCell = null;
    let tasks = [];
    let currentUserId = null;
    let editingTaskIndex = null;    
    let currentHourLineInterval = null;
    let notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
    let notificationTimeouts = [];

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
        taskRecurrence: document.getElementById('task-recurrence'),
        addTaskBtn: document.getElementById('add-task'),
        cancelTaskBtn: document.getElementById('cancel-task'),
        logoutBtn: document.getElementById('logout-btn'),        
        editPageTaskBtn: document.getElementById('edit-page-task'),
        themeToggleBtn: document.querySelector('button i.material-icons[textContent="contrast"]')?.parentElement,
    };

    // --- Funções de LocalStorage ---
    function getTasksFromStorage(userId) {
        const tasksJson = localStorage.getItem(`tasks_${userId}`);
        return tasksJson ? JSON.parse(tasksJson) : [];
    }

    function saveTasksToStorage(userId, tasks) {
        localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
    }

    // --- Gerenciamento de Tema ---
    function setTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
        setTheme(currentTheme);
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

    // --- Busca a imagem do usuario ---
    function getUserImage() {
        const perfilIcone = document.getElementById('perfilIcone');
        const usuarioLogado = JSON.parse(localStorage.getItem(currentUserId));

        if (usuarioLogado?.perfil?.imagem) {
            const img = document.createElement('img');
            img.src = usuarioLogado.perfil.imagem;
            img.alt = 'Perfil';
            img.style.width = '26px';
            img.style.height = '26px';
            img.style.borderRadius = '50%';
            img.style.objectFit = 'cover';
            img.style.cursor = 'pointer';
            img.style.border = '1.5px solid #ccc';
            perfilIcone.replaceWith(img);
        }
    }

    // --- Função para gerar datas recorrentes ---
    function generateRecurringDates(startDate, recurrence, limitDate) {
        const dates = [];
        let currentDate = new Date(startDate);
        const originalDay = startDate.getDate();

        while (currentDate <= limitDate) {
            dates.push(new Date(currentDate));
            if (recurrence === 'diaria') {
                currentDate.setDate(currentDate.getDate() + 1);
            } else if (recurrence === 'semanal') {
                currentDate.setDate(currentDate.getDate() + 7);
            } else if (recurrence === 'mensal') {
                // Avança o mês
                const nextMonth = currentDate.getMonth() + 1;
                currentDate.setMonth(nextMonth, 1); // vai para o primeiro dia do próximo mês
                // Tenta setar o dia original
                const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                currentDate.setDate(Math.min(originalDay, daysInMonth));
            } else {
                break;
            }
        }
        return dates;
    }

    // --- Popula o campo de recorrência ---
    function renderRecorrencia() {
        const select = elements.taskRecurrence;
        if (!select) return;

        const opcoesRecorrencia = [
            { value: 'nenhuma', text: 'Nenhuma' },
            { value: 'diaria', text: 'Diária' },
            { value: 'semanal', text: 'Semanal' },
            { value: 'mensal', text: 'Mensal' }
        ];

        select.innerHTML = '';
        opcoesRecorrencia.forEach(opcao => {
            const option = document.createElement('option');
            option.value = opcao.value;
            option.textContent = opcao.text;
            select.appendChild(option);
        });
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

        const savedTheme = localStorage.getItem('theme') || 'light-theme';
        setTheme(savedTheme);

        if (elements.themeToggleBtn) {
            elements.themeToggleBtn.addEventListener('click', toggleTheme);
        }

        function setupCheckboxes() {
            const checkboxes = document.querySelectorAll('.filtro-categoria');
            if (checkboxes.length === 0) return;
            checkboxes.forEach(checkbox => {
                checkbox.removeEventListener('change', aplicarFiltroCategorias);
                checkbox.addEventListener('change', aplicarFiltroCategorias);
            });
        }

        renderCategorias();
        renderCategoriasSelect();
        renderRecorrencia();
        getUserImage();
        setupCheckboxes();
        setTimeout(setupCheckboxes, 1000);
        renderMainCalendar();
        renderMiniCalendar();

        if (notificationsEnabled) {
            pedirPermissaoNotificacoes().then(() => agendarNotificacoesParaHoje());
        }

        toggleNotificationIcon();
    }

    // --- Função de Logout ---
    function logout() {
        if (currentUserId) {
            localStorage.removeItem(currentUserId);
            currentUserId = null;
            tasks = [];
            alert('Logout realizado com sucesso!');
            window.location.href = '../login/index.html';
        }
    }

    // --- Categorias ----
    function slugify(str) {
        return str.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-');
    }

    function criarCategoriaLi(nome) {
        const slug = slugify(nome);
        const li = document.createElement('li');
        li.className = 'category-item';
        li.innerHTML = `<input type="checkbox" class="filtro-categoria" data-category="${slug}"> ${nome}`;
        return li;
    }

    function renderCategorias() {
        const categoriasIniciais = ['Trabalho', 'Casa', 'Saúde', 'Pessoal', 'Outros'];
        const categoryList = document.getElementById('category-list');
        categoryList.innerHTML = '';
  
        const userData = JSON.parse(localStorage.getItem(currentUserId));
        const categorias = userData?.categorias || [];
    
        categoriasIniciais.forEach(nome => {
            const slug = slugify(nome);
            const li = criarCategoriaLi(nome, slug);
            categoryList.appendChild(li);
        });

        categorias.forEach(nome => {
            const li = criarCategoriaLi(nome);
            const slug = slugify(nome);
            li.className = 'category-item';
            li.innerHTML = `<div class="created-categories"><span>
                <input type="checkbox" class="filtro-categoria" data-category="${slug}"> ${nome}</span>
                <i class="material-icons delete-category" title="Excluir">delete</i></div>`;

            categoryList.appendChild(li);

            const deleteIcon = li.querySelector('.delete-category');
            deleteIcon.addEventListener('click', () => {
                if (confirm(`Deseja realmente excluir a categoria "${nome}"?`)) {
                    const novaLista = categorias.filter(c => c !== nome);
                    userData.categorias = novaLista;
                    localStorage.setItem(currentUserId, JSON.stringify(userData));
  
                    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                    const index = usuarios.findIndex(user => user.email === currentUserId);
                    if (index !== -1) {
                        usuarios[index] = userData;
                        localStorage.setItem('usuarios', JSON.stringify(usuarios));
                    }
  
                    renderCategorias();
                }
            });
        });
  
        const liInput = document.createElement('li');
        liInput.className = 'add-category-item category-item';
        liInput.innerHTML = `
            <i class="material-icons add-category-icon" id="add-icon">add_circle</i>
            <input type="text" class="new-category-input" id="new-category-input" placeholder="Nova categoria">
        `;  
        categoryList.appendChild(liInput);

        const addIcon = document.getElementById('add-icon');
        const newCategoryInput = document.getElementById('new-category-input');
  
        function adicionarCategoria() {
            const nome = newCategoryInput.value.trim();
            if (!nome) return;

            const slug = slugify(nome);
            const existe = categorias.some(c => slugify(c) === slug);
            if (existe) {
                alert('Essa categoria já existe.');
                return;
            }

            categorias.push(nome);
            userData.categorias = categorias;
            localStorage.setItem(currentUserId, JSON.stringify(userData));
            
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const index = usuarios.findIndex(user => user.email === currentUserId);
            if (index !== -1) {
                usuarios[index] = userData;
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
            }

            renderCategorias();                         
        }
  
        addIcon.addEventListener('click', adicionarCategoria);
        newCategoryInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                adicionarCategoria();
            }
        });
    }

    function renderCategoriasSelect() {
        const select = document.getElementById('task-category');
        if (!select) return;

        const categoriasIniciais = ['Trabalho', 'Casa', 'Saúde', 'Pessoal', 'Outros'];
        const userData = JSON.parse(localStorage.getItem(currentUserId)) || { categorias: [] };
        const categorias = userData.categorias || [];
      
        select.innerHTML = '';
      
        [...categoriasIniciais, ...categorias].forEach(categoria => {
            const option = document.createElement('option');
            option.value = slugify(categoria);
            option.textContent = categoria;
            select.appendChild(option);
        });
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

    function updateCurrentHourLine() {
        const today = new Date();
        const currentHour = today.getHours();
        const currentMinutes = today.getMinutes();
        const isTodayInView = document.querySelector('.today-header');

        document.querySelectorAll('.current-hour-line').forEach(line => line.remove());

        if (!isTodayInView) return;

        const dayHeaders = document.querySelectorAll('.day-header');
        let todayColumnIndex = -1;
        dayHeaders.forEach((header, index) => {
            if (header.classList.contains('today-header')) {
                todayColumnIndex = index;
            }
        });

        if (todayColumnIndex === -1) return;

        const cells = document.querySelectorAll('.cell');
        const cellIndex = currentHour * 7 + todayColumnIndex;
        const targetCell = cells[cellIndex];
        if (!targetCell) return;

        const cellRect = targetCell.getBoundingClientRect();
        const calendarRect = elements.calendarGrid.getBoundingClientRect();
        const cellHeight = cellRect.height;
        const minutesFraction = currentMinutes / 60;
        const lineOffset = minutesFraction * cellHeight;

        const line = document.createElement('div');
        line.classList.add('current-hour-line');
        line.style.top = `${cellRect.top - calendarRect.top + lineOffset}px`;
        line.style.left = `${cellRect.left - calendarRect.left}px`;
        line.style.width = `${cellRect.width}px`;

        elements.calendarGrid.appendChild(line);
    }

    function renderMainCalendar(filteredTasks = null) {
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

        const tasksToRender = filteredTasks || tasks;

        tasksToRender.forEach(task => {
            const taskDate = new Date(task.startTime);
            const cell = Array.from(elements.calendarGrid.querySelectorAll('.cell')).find(cell => {
                const cellDate = new Date(cell.getAttribute('data-date'));
                return (
                    cellDate.getFullYear() === taskDate.getFullYear() &&
                    cellDate.getMonth() === taskDate.getMonth() &&
                    cellDate.getDate() === taskDate.getDate() &&
                    cellDate.getHours() === taskDate.getHours()
                );
            });

            if (cell) {
                const label = document.createElement('div');
                label.classList.add('event-label');
                label.textContent = `${task.title} (${task.category}, P${task.priority})`;
                label.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openTaskEditor(cell, task);
                });
                cell.appendChild(label);
            }
        });

        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        elements.weekRangeDisplay.textContent = `${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}`;

        updateCurrentHourLine();
        if (currentHourLineInterval) {
            clearInterval(currentHourLineInterval);
        }
        currentHourLineInterval = setInterval(updateCurrentHourLine, 60000);
        window.removeEventListener('resize', updateCurrentHourLine);
        window.addEventListener('resize', updateCurrentHourLine);
    }

    // --- Função de Filtragem ---
    function aplicarFiltroCategorias() {
        const user = getLoggedInUser();
        if (!user) {
            alert('Nenhum usuário logado.');
            return;
        }

        const userId = user.email.toLowerCase();
        const todasTarefas = getTasksFromStorage(userId);

        const checkboxes = document.querySelectorAll('.filtro-categoria');
        const filtrosAtivos = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.dataset.category.toLowerCase());

        const tarefasFiltradas = filtrosAtivos.length === 0
            ? todasTarefas
            : todasTarefas.filter(tarefa => {
                const category = tarefa.category ? tarefa.category.toLowerCase() : '';
                return filtrosAtivos.includes(category);
            });

        renderMainCalendar(tarefasFiltradas);
    }

    // --- Painel de Resumo --- 
    const abrirBtn = document.getElementById('abrirResumo');
    const fecharBtn = document.getElementById('fecharModal');
    const modal = document.getElementById('modalResumo');
    const lista = document.getElementById('listaTarefasHoje');

    if (abrirBtn && fecharBtn && modal && lista) {
        abrirBtn.addEventListener('click', () => {
            const user = getLoggedInUser();
            if (!user) return;

            const userId = user.email.toLowerCase();
            const tasks = JSON.parse(localStorage.getItem(`tasks_${userId}`)) || [];

            const hoje = new Date();
            const pad = n => String(n).padStart(2, '0');
            const dataHoje = `${hoje.getFullYear()}-${pad(hoje.getMonth() + 1)}-${pad(hoje.getDate())}`;

            // Filtra tarefas do dia pelo startTime
            const agora = new Date();
            const tarefasHoje = tasks.filter(t => {
                if (!t.startTime) return false;
                if (!t.endTime) return false;
                return t.startTime.startsWith(dataHoje) && new Date(t.endTime) > agora;
            });

            // Separa por prioridade
            const prioridades = {
                '1': [],
                '2': [],
                '3': []
            };
            tarefasHoje.forEach(t => {
                const prioridade = t.priority || '3';
                prioridades[prioridade].push(t);
            });

            // Monta o HTML separado por prioridade
            let html = '';
            const nomesPrioridade = { '1': 'Alta', '2': 'Média', '3': 'Baixa' };
            [1, 2, 3].forEach(p => {
                html += `<h3>Prioridade ${nomesPrioridade[p]}</h3>`;
                if (prioridades[p].length === 0) {
                    html += `<li>Nenhuma tarefa.</li>`;
                } else {
                    prioridades[p].forEach(t => {
                        const inicio = t.startTime?.substring(11, 16) || '??:??';
                        const fim = t.endTime?.substring(11, 16) || '??:??';
                        html += `<li>${t.title} (${inicio} - ${fim})</li>`;
                    });
                }
            });

            lista.innerHTML = html;
            modal.style.display = 'block';
        });

        fecharBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // --- Menu Configurações ---
    const btnConfig = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.querySelector('i')?.textContent.trim() === 'settings');

    const menuConfig = document.getElementById('menuConfiguracoes');
    const btnAlterarSenha = document.getElementById('alterar-senha');
    const btnNotificacoes = document.getElementById('config-notificacoes');

    if (btnConfig && menuConfig) {
        btnConfig.addEventListener('click', () => {
            menuConfig.classList.toggle('hidden');
        });
    }

    if (btnAlterarSenha) {
        btnAlterarSenha.addEventListener('click', () => {
            window.location.href = '../AlterarSenha/index.html';
        });
    }

    if (btnNotificacoes) {
        btnNotificacoes.addEventListener('click', () => {
            window.location.href = '../Notificações/index.html';
        });
    }
    
    // --- Redefinir Agenda ---
    const btnRedefinirAgenda = document.getElementById('redefinir-agenda');

    if (btnRedefinirAgenda) {
        btnRedefinirAgenda.addEventListener('click', () => {
            const user = getLoggedInUser();
            if (!user) {
                alert('Nenhum usuário logado.');
                return;
            }

            const confirmacao = confirm('Tem certeza que deseja redefinir sua agenda? Isso apagará todas as tarefas.');
            if (!confirmacao) return;

            const userId = user.email.toLowerCase();
            localStorage.removeItem(`tasks_${userId}`);
            desativarNotificacoes();
            alert('Agenda redefinida com sucesso!');
            location.reload();
        });
    }

    // --- Notificações ---
    const btnAtivarNotificacoes = document.querySelector('#ativar-notificacoes');

    if (btnAtivarNotificacoes) {
        toggleNotificationIcon();
        btnAtivarNotificacoes.addEventListener('click', async () => {
            notificationsEnabled = !notificationsEnabled;
            localStorage.setItem('notificationsEnabled', notificationsEnabled);

            if (notificationsEnabled) {
                await pedirPermissaoNotificacoes();
                if (Notification.permission === "granted") {
                    agendarNotificacoesParaHoje();
                    alert('Notificações ativadas e agendadas, se aplicável.');
                } else {
                    notificationsEnabled = false;
                    localStorage.setItem('notificationsEnabled', false);
                    alert('Permissão de notificação negada.');
                }
            } else {
                desativarNotificacoes();
                alert('Notificações desativadas.');
            }
            toggleNotificationIcon();
        });
    } else {
        console.error('Botão de notificações (#ativar-notificacoes) não encontrado');
    }

    async function pedirPermissaoNotificacoes() {
        if (Notification.permission !== "granted") {
            const permission = await Notification.requestPermission();
            console.log('Permissão de notificação:', permission);
            if (permission !== "granted") {
                alert("Permissão de notificação negada.");
                notificationsEnabled = false;
                localStorage.setItem('notificationsEnabled', false);
                toggleNotificationIcon();
            }
        }
    }

    function mostrarNotificacao(titulo, corpo) {
        if (Notification.permission === "granted") {
            new Notification(titulo, {
                body: corpo,
                icon: "../../docs/img/logo.png"
            });
        }
    }

    function agendarNotificacaoTarefa(tarefa) {
        if (!notificationsEnabled) return;
        const agora = new Date();
        const horario = new Date(tarefa.startTime);
        const delay = horario.getTime() - agora.getTime();

        console.log('Agendando notificação para:', tarefa.title, 'startTime:', tarefa.startTime, 'delay(ms):', delay);

        if (delay > 0) {
            const timeoutId = setTimeout(() => {
                mostrarNotificacao("Lembrete de tarefa", `${tarefa.title} começa agora.`);
            }, delay);
            notificationTimeouts.push(timeoutId);
            console.log(`Notificação agendada para ${tarefa.title} em ${horario}`);
        }
    }

    function agendarNotificacoesParaHoje() {
        if (!currentUserId || !Array.isArray(tasks)) return;

        const agora = new Date();
        const tarefasHoje = tasks.filter(t => {
            const inicio = new Date(t.startTime);
            return (
                inicio.getFullYear() === agora.getFullYear() &&
                inicio.getMonth() === agora.getMonth() &&
                inicio.getDate() === agora.getDate()
            );
        });

        tarefasHoje.forEach(tarefa => agendarNotificacaoTarefa(tarefa));
        console.log(`Notificações agendadas para ${tarefasHoje.length} tarefa(s) de hoje`);
        alert(tarefasHoje.length > 0 
            ? `Notificações agendadas para ${tarefasHoje.length} tarefa(s) de hoje.` 
            : 'Nenhuma tarefa para hoje.');
    }

    function desativarNotificacoes() {
        notificationTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        notificationTimeouts = [];
        notificationsEnabled = false;
        localStorage.setItem('notificationsEnabled', false);
        console.log('Notificações desativadas');
    }

    function toggleNotificationIcon() {
        if (btnAtivarNotificacoes) {
            const icon = btnAtivarNotificacoes.querySelector('i.material-icons');
            if (icon) {
                icon.textContent = notificationsEnabled ? 'notifications' : 'notifications_off';
                console.log('Ícone alterado para:', icon.textContent);
            } else {
                console.error('Elemento <i class="material-icons"> não encontrado no botão #ativar-notificacoes');
            }
        } else {
            console.error('Botão #ativar-notificacoes não encontrado para alterar ícone');
        }
    }

    // --- Editor de Tarefas ---
function openTaskEditor(cell, task = null) {
    activeCell = cell;
    const rect = cell.getBoundingClientRect();
    elements.taskEditor.style.top = `${rect.bottom + window.scrollY + 5}px`;
    elements.taskEditor.style.left = `${rect.left + window.scrollX}px`;
    elements.taskEditor.classList.remove('hidden');

    const editorTitle = document.getElementById('task-editor-title');

    // NOVO: Referências aos campos separados
    const dateInput = document.getElementById('date');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');

    if (task) {
        if (editorTitle) editorTitle.textContent = "Editar Tarefa";

        editingTaskIndex = tasks.findIndex(t =>
            t.date === task.date &&
            t.title === task.title &&
            t.category === task.category &&
            t.priority === task.priority
        );

        elements.taskTitle.value = task.title || '';
        elements.taskCategory.value = task.category || 'trabalho';
        elements.taskPriority.value = task.priority || '2';
        if (elements.taskRecurrence) {
            elements.taskRecurrence.value = task.recurrence || 'nenhuma';
        }

        // Preencher campos separados de data e hora
        if (task.startTime && task.endTime && dateInput && startTimeInput && endTimeInput) {
            // task.startTime e task.endTime no formato 'YYYY-MM-DDTHH:mm'
            const [date, horaInicio] = task.startTime.split('T');
            const [, horaFim] = task.endTime.split('T');
            dateInput.value = date;
            startTimeInput.value = horaInicio;
            endTimeInput.value = horaFim;
        }

        elements.addTaskBtn.classList.add('hidden');
        elements.editTaskBtn.classList.remove('hidden');
        elements.deleteTaskBtn.classList.remove('hidden');
        elements.editPageTaskBtn.classList.remove('hidden');
    } else {
        if (editorTitle) editorTitle.textContent = "Criar Tarefa";
        editingTaskIndex = null;
        elements.taskTitle.value = '';
        elements.taskCategory.value = 'trabalho';
        elements.taskPriority.value = '2';
        if (elements.taskRecurrence) {
            elements.taskRecurrence.value = 'nenhuma';
        }

        // Preencher campos separados de data e hora com valores padrão
        if (dateInput && startTimeInput && endTimeInput) {
            const cellDateStr = cell.getAttribute('data-date');
            const clickedDate = new Date(cellDateStr);
            const start = new Date(clickedDate);
            const end = new Date(start.getTime() + 30 * 60000);

            const pad = num => String(num).padStart(2, '0');
            dateInput.value = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;
            startTimeInput.value = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
            endTimeInput.value = `${pad(end.getHours())}:${pad(end.getMinutes())}`;
        }

        elements.addTaskBtn.classList.remove('hidden');
        elements.editTaskBtn.classList.add('hidden');
        elements.deleteTaskBtn.classList.add('hidden');
        elements.editPageTaskBtn.classList.add('hidden');
    }
}

    function formatDateTimeLocal(date) {
        const pad = n => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function updateTask() {
        if (editingTaskIndex === null || !activeCell) return;

        const title = elements.taskTitle.value.trim();
        if (!title) {
            alert('O título da tarefa é obrigatório.');
            return;
        }

        // NOVO: Pegue os valores dos campos separados
        const date = document.getElementById('date').value;
        const horaInicio = document.getElementById('start-time').value;
        const horaFim = document.getElementById('end-time').value;

        // Monte os valores completos no formato YYYY-MM-DDTHH:mm
        const startTime = `${date}T${horaInicio}`;
        const endTime = `${date}T${horaFim}`;

        const startDate = new Date(startTime);
        const endDate = new Date(endTime);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            alert('Data/hora de início ou término inválida.');
            return;
        }

        if (endDate <= startDate) {
            alert('A hora de término deve ser posterior à hora de início.');
            return;
        }

        const oldTask = tasks[editingTaskIndex];
        const oldRecurrence = oldTask.recurrence || 'nenhuma';
        const newRecurrence = elements.taskRecurrence ? elements.taskRecurrence.value : 'nenhuma';

        // Se a tarefa era sem recorrência e agora o usuário escolheu uma recorrência
        if (oldRecurrence === 'nenhuma' && newRecurrence !== 'nenhuma') {
            // Remove a tarefa original
            tasks.splice(editingTaskIndex, 1);

            // Cria tarefas recorrentes (igual ao saveTask)
            const baseTask = {
                title,
                category: elements.taskCategory.value || 'trabalho',
                priority: elements.taskPriority.value || '2',
                recurrence: newRecurrence
            };

            const limitDate = new Date(startDate);
            limitDate.setFullYear(limitDate.getFullYear() + 1);

            const recurringDates = generateRecurringDates(startDate, newRecurrence, limitDate);

            recurringDates.forEach(recurringDate => {
                const taskStartTime = new Date(recurringDate);
                taskStartTime.setHours(startDate.getHours(), startDate.getMinutes());
                const taskEndTime = new Date(recurringDate);
                taskEndTime.setHours(endDate.getHours(), endDate.getMinutes());

                const task = {
                    ...baseTask,
                    date: `${recurringDate.getFullYear()}-${String(recurringDate.getMonth() + 1).padStart(2, '0')}-${String(recurringDate.getDate()).padStart(2, '0')}`,
                    startTime: formatDateTimeLocal(taskStartTime),
                    endTime: formatDateTimeLocal(taskEndTime)
                };

                tasks.push(task);

                if (notificationsEnabled && Notification.permission === "granted") {
                    agendarNotificacaoTarefa(task);
                }       
            });
        } else {
            // Comportamento padrão: apenas atualiza a tarefa
            const updatedTask = {
                date: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`,
                title,
                category: elements.taskCategory.value || 'trabalho',
                priority: elements.taskPriority.value || '2',
                startTime: formatDateTimeLocal(startDate),
                endTime: formatDateTimeLocal(endDate),
                recurrence: newRecurrence
            };

            tasks[editingTaskIndex] = updatedTask;

            if (notificationsEnabled) {
                pedirPermissaoNotificacoes().then(() => agendarNotificacaoTarefa(updatedTask));
            }
        }

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

    function saveTask() {
        if (!currentUserId) {
            alert('Por favor, faça login para salvar tarefas.');
            window.location.href = '../login/index.html';
            return;
        }

        const title = elements.taskTitle.value.trim();
        if (!title) {
            alert('O título da tarefa é obrigatório.');
            return;
        }

        // NOVO: Pegue os valores dos campos separados
        const date = document.getElementById('date').value;
        const horaInicio = document.getElementById('start-time').value;
        const horaFim = document.getElementById('end-time').value;

        // Monte os valores completos no formato YYYY-MM-DDTHH:mm
        const startTime = `${date}T${horaInicio}`;
        const endTime = `${date}T${horaFim}`;

        const startDate = new Date(startTime);
        const endDate = new Date(endTime);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            alert('Data/hora de início ou término inválida.');
            return;
        }

        if (endDate <= startDate) {
            alert('A hora de término deve ser posterior à hora de início.');
            return;
        }

        const recurrence = elements.taskRecurrence ? elements.taskRecurrence.value : 'nenhuma';
        if (!['nenhuma', 'diaria', 'semanal', 'mensal'].includes(recurrence)) {
            alert('Tipo de recorrência inválido.');
            return;
        }

        const baseTask = {
            title,
            category: elements.taskCategory.value || 'trabalho',
            priority: elements.taskPriority.value || '2',
            recurrence
        };

        const limitDate = new Date(startDate);
        limitDate.setFullYear(limitDate.getFullYear() + 1);

        const recurringDates = recurrence !== 'nenhuma' 
            ? generateRecurringDates(startDate, recurrence, limitDate)
            : [startDate];

        recurringDates.forEach(recurringDate => {
            const taskStartTime = new Date(recurringDate);
            taskStartTime.setHours(startDate.getHours(), startDate.getMinutes());
            const taskEndTime = new Date(recurringDate);
            taskEndTime.setHours(endDate.getHours(), endDate.getMinutes());

        const task = {
            ...baseTask,
            date: `${recurringDate.getFullYear()}-${String(recurringDate.getMonth() + 1).padStart(2, '0')}-${String(recurringDate.getDate()).padStart(2, '0')}`,
            startTime: `${taskStartTime.getFullYear()}-${String(taskStartTime.getMonth() + 1).padStart(2, '0')}-${String(taskStartTime.getDate()).padStart(2, '0')}T${String(taskStartTime.getHours()).padStart(2, '0')}:${String(taskStartTime.getMinutes()).padStart(2, '0')}`,
            endTime: `${taskEndTime.getFullYear()}-${String(taskEndTime.getMonth() + 1).padStart(2, '0')}-${String(taskEndTime.getDate()).padStart(2, '0')}T${String(taskEndTime.getHours()).padStart(2, '0')}:${String(taskEndTime.getMinutes()).padStart(2, '0')}`
        };

            tasks.push(task);            

        if (notificationsEnabled && Notification.permission === "granted") {
            agendarNotificacaoTarefa(task);
        }
        });

        saveTasksToStorage(currentUserId, tasks);
        renderMainCalendar();
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
            localStorage.removeItem('editTaskReference');
            window.location.href = '../newtask/index.html';
        });
    }

    elements.editPageTaskBtn.addEventListener('click', () => {  
        if (editingTaskIndex === null || !activeCell) return;

        const date = activeCell.getAttribute('data-date');
        const task = tasks[editingTaskIndex];

        const editReference = {
            date,
            index: editingTaskIndex,
            recurrence: task.recurrence || 'nenhuma'
        };

        localStorage.setItem('editTaskReference', JSON.stringify(editReference));      
        window.location.href = '../newtask/index.html';
    });

    const profileButton = document.getElementById('botao-perfil');
    const profileDropdown = document.getElementById('perfil-dropdown');

    if (profileButton && profileDropdown) {
        profileButton.addEventListener('click', () => {
            if (!menuConfig.classList.contains('hidden')) {
                menuConfig.classList.toggle('hidden');
            }
            profileDropdown.classList.toggle('hidden');                        
        });

        document.addEventListener('click', (event) => {
            if (!profileButton.contains(event.target) && !profileDropdown.contains(event.target)) {
                profileDropdown.classList.add('hidden');
            }
        });
    }

    // --- Tema Escuro ---
    const toggleBtn = document.getElementById('toggle-theme-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark-theme');
            } else {
                localStorage.setItem('theme', 'light-theme');
            }
        });
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark-theme') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    // --- Inicialização ---
    initializeUser();
});