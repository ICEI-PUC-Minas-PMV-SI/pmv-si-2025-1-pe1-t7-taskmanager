document.addEventListener('DOMContentLoaded', () => {
    // Estado global
    let miniCurrentDate = new Date();
    let mainCurrentDate = new Date();
    let activeCell = null;
    let tasks = [];
    let currentUserId = null;
    let editingTaskIndex = null;    
    let currentHourLineInterval = null;
    let notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true'; // Persistir estado
    let notificationTimeouts = []; // Armazena IDs dos setTimeout

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

        // Configura o tema
        const savedTheme = localStorage.getItem('theme') || 'light-theme';
        setTheme(savedTheme);

        // Adiciona listener para o botão de tema
        if (elements.themeToggleBtn) {
            elements.themeToggleBtn.addEventListener('click', toggleTheme);
        }

        // Função para configurar os checkboxes
        function setupCheckboxes() {
            const checkboxes = document.querySelectorAll('.filtro-categoria');
            if (checkboxes.length === 0) {
                return;
            }
            checkboxes.forEach(checkbox => {
                checkbox.removeEventListener('change', aplicarFiltroCategorias);
                checkbox.addEventListener('change', aplicarFiltroCategorias);
            });
        }

        // Configura as categorias dinamicamente
        renderCategorias();
        renderCategoriasSelect();

        // Configura a imagem do usuario
        getUserImage();

        // Configura os checkboxes imediatamente
        setupCheckboxes();

        // Tenta novamente após 1 segundo, caso o DOM seja carregado dinamicamente
        setTimeout(setupCheckboxes, 1000);

        // Renderiza o calendário inicialmente sem filtros
        renderMainCalendar();
        renderMiniCalendar();

        // Agenda notificações para tarefas existentes, se habilitadas
        if (notificationsEnabled) {
            pedirPermissaoNotificacoes().then(() => agendarNotificacoesParaHoje());
        }

        // Define o ícone inicial
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

            console.log(categorias)
            console.log(userData)
            
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            console.log(usuarios)

            const index = usuarios.findIndex(user => user.email === currentUserId);
            console.log(index)
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

        // Remove linhas existentes
        document.querySelectorAll('.current-hour-line').forEach(line => line.remove());

        if (!isTodayInView) return;

        // Encontra a coluna do dia atual
        const dayHeaders = document.querySelectorAll('.day-header');
        let todayColumnIndex = -1;
        dayHeaders.forEach((header, index) => {
            if (header.classList.contains('today-header')) {
                todayColumnIndex = index;
            }
        });

        if (todayColumnIndex === -1) return;

        // Encontra a célula da hora atual na coluna do dia atual
        const cells = document.querySelectorAll('.cell');
        const cellIndex = currentHour * 7 + todayColumnIndex; // 7 células por linha (uma por dia)
        const targetCell = cells[cellIndex];
        if (!targetCell) return;

        const cellRect = targetCell.getBoundingClientRect();
        const calendarRect = elements.calendarGrid.getBoundingClientRect();
        const cellHeight = cellRect.height;
        const minutesFraction = currentMinutes / 60;
        const lineOffset = minutesFraction * cellHeight;

        // Cria a linha
        const line = document.createElement('div');
        line.classList.add('current-hour-line');

        // Posiciona a linha
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

        // Atualiza a linha da hora atual
        updateCurrentHourLine();

        // Configura intervalo para atualizar a linha a cada minuto
        if (currentHourLineInterval) {
            clearInterval(currentHourLineInterval);
        }
        currentHourLineInterval = setInterval(updateCurrentHourLine, 60000);

        // Adiciona listener para redimensionamento
        window.removeEventListener('resize', updateCurrentHourLine); // Evita duplicatas
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

            const hoje = new Date().toISOString().split('T')[0];
            const tarefasHoje = tasks.filter(t => {
                if (!t.date) return false;
                const dataTarefa = new Date(t.date);
                const hojeData = new Date();
                return (
                    dataTarefa.getFullYear() === hojeData.getFullYear() &&
                    dataTarefa.getMonth() === hojeData.getMonth() &&
                    dataTarefa.getDate() === hojeData.getDate()
                );
            });

            lista.innerHTML = '';

            if (tarefasHoje.length === 0) {
                lista.innerHTML = '<li>Nenhuma tarefa para hoje.</li>';
            } else {
                tarefasHoje.forEach(t => {
                    const li = document.createElement('li');
                    const inicio = t.startTime?.substring(11, 16) || '??:??';
                    const fim = t.endTime?.substring(11, 16) || '??:??';
                    li.textContent = `${t.title} (${inicio} - ${fim})`;
                    lista.appendChild(li);
                });
            }

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
            desativarNotificacoes(); // Desativa notificações ao redefinir agenda
            alert('Agenda redefinida com sucesso!');
            location.reload();
        });
    }

    // --- Notificações ---
    const btnAtivarNotificacoes = document.querySelector('#ativar-notificacoes');

    if (btnAtivarNotificacoes) {
        // Define o ícone inicial
        toggleNotificationIcon();
        btnAtivarNotificacoes.addEventListener('click', () => {
            console.log('Botão de notificações clicado, estado atual:', notificationsEnabled);
            notificationsEnabled = !notificationsEnabled; // Alterna o estado
            localStorage.setItem('notificationsEnabled', notificationsEnabled); // Persiste o estado
            if (notificationsEnabled) {
                pedirPermissaoNotificacoes().then(() => {
                    agendarNotificacoesParaHoje();
                    alert('Notificações ativadas e agendadas, se aplicável.');
                });
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
                icon: "/favicon.ico"
            });
        }
    }

    function agendarNotificacaoTarefa(tarefa) {
        if (!notificationsEnabled) return;
        const agora = new Date();
        const horario = new Date(tarefa.startTime);
        const delay = horario.getTime() - agora.getTime();

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
            elements.editPageTaskBtn.classList.remove('hidden');
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
            elements.deleteTaskBtn.classList.add('hidden');
            elements.editPageTaskBtn.classList.add('hidden');
        }
    }

    function updateTask() {
        if (editingTaskIndex === null || !activeCell) return;

        const title = elements.taskTitle.value.trim();
        const updatedTask = {
            date: activeCell.getAttribute('data-date'),
            title,
            category: elements.taskCategory.value || 'trabalho',
            priority: elements.taskPriority.value,
            startTime: elements.startTime.value,
            endTime: elements.endTime.value,
        };

        tasks[editingTaskIndex] = updatedTask;
        saveTasksToStorage(currentUserId, tasks);
        renderMainCalendar();
        elements.taskEditor.classList.add('hidden');

        // Reagenda notificação após atualização, se habilitado
        if (notificationsEnabled) {
            pedirPermissaoNotificacoes().then(() => agendarNotificacaoTarefa(updatedTask));
        }
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
        if (!title || !activeCell) return;

        const task = {
            date: activeCell.getAttribute('data-date'),
            title,
            category: elements.taskCategory.value || 'trabalho',
            priority: elements.taskPriority.value,
            startTime: elements.startTime.value,
            endTime: elements.endTime.value,
        };

        tasks.push(task);
        saveTasksToStorage(currentUserId, tasks);
        renderMainCalendar();

        const label = document.createElement('div');
        label.classList.add('event-label');
        label.textContent = `${title} (${task.category}, P${task.priority})`;
        activeCell.appendChild(label);
        elements.taskEditor.classList.add('hidden');

        // Agenda notificação para a nova tarefa, se habilitado
        if (notificationsEnabled) {
            pedirPermissaoNotificacoes().then(() => agendarNotificacaoTarefa(task));
        }
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
        if (editingTaskIndex === null || !activeCell) return;

        const date = activeCell.getAttribute('data-date');

        const editReference = {
            date,
            index: editingTaskIndex
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

    // Aplica o tema salvo ao carregar a página
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark-theme') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    // --- Inicialização ---
    initializeUser();
});