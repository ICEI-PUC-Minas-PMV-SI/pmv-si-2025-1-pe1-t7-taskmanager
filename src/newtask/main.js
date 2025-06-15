// Função que retorna o usuário logado com base nos dados do localStorage
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

function slugify(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
}

function renderCategorias(usuarioLogado) {
    const select = document.getElementById('categoria');
    if (!select) return;

    const categoriasIniciais = ['Trabalho', 'Casa', 'Saúde', 'Pessoal', 'Outros'];
    const userData = JSON.parse(localStorage.getItem(usuarioLogado.email)) || { categorias: [] };
    const categorias = userData.categorias || [];

    select.innerHTML = '';
    [...categoriasIniciais, ...categorias].forEach(categoria => {
        const option = document.createElement('option');
        option.value = slugify(categoria);
        option.textContent = categoria;
        select.appendChild(option);
    });
}

function renderRecorrencia() {
    const select = document.getElementById('recorrencia');
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

function getTasksFromStorage(userId) {
    const tasksJson = localStorage.getItem(`tasks_${userId}`);
    return tasksJson ? JSON.parse(tasksJson) : [];
}

function saveTasksToStorage(userId, tasks) {
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
}

function generateRecurringDates(startDate, recurrence, limitDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= limitDate) {
        dates.push(new Date(currentDate));
        if (recurrence === 'diaria') {
            currentDate.setDate(currentDate.getDate() + 1);
        } else if (recurrence === 'semanal') {
            currentDate.setDate(currentDate.getDate() + 7);
        } else if (recurrence === 'mensal') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else {
            break;
        }
    }
    return dates;
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const usuarioLogado = getLoggedInUser();

    const savedTheme = localStorage.getItem('theme') || 'light-theme';

    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(savedTheme);
    localStorage.setItem('theme', savedTheme);

    if (!usuarioLogado) {
        alert('Você precisa estar logado para criar tarefas.');
        window.location.href = '../login/index.html';
        return;
    }

    const userId = usuarioLogado.email.toLowerCase();
    renderCategorias(usuarioLogado);
    renderRecorrencia();

    // Carregar dados para edição, se aplicável
    const editReference = JSON.parse(localStorage.getItem('editTaskReference'));
    if (editReference && typeof editReference.index === 'number') {
        const tasks = getTasksFromStorage(userId);
        const task = tasks[editReference.index];
        if (task) {
            document.getElementById('titulo').value = task.title || '';
            document.getElementById('descricao').value = task.description || '';
            document.getElementById('data').value = task.date ? task.date.split('T')[0] : '';
            document.getElementById('horario').value = task.startTime ? task.startTime.split('T')[1].substring(0, 5) : '';
            document.getElementById('horario2').value = task.endTime ? task.endTime.split('T')[1].substring(0, 5) : '';
            document.getElementById('categoria').value = task.category || 'trabalho';
            document.getElementById('prioridade').value = task.priority || '2';
            document.getElementById('recorrencia').value = task.recurrence || 'nenhuma';
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Captura os dados dos campos
        const title = document.getElementById('titulo').value.trim();
        const description = document.getElementById('descricao').value.trim();
        const date = document.getElementById('data').value;
        const startTime = document.getElementById('horario').value;
        const endTime = document.getElementById('horario2').value;
        const category = document.getElementById('categoria').value.trim();
        const priority = document.getElementById('prioridade').value;
        const recurrence = document.getElementById('recorrencia').value.trim();

         //Validações básicas
        if (!title || !date || !startTime || !endTime) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

                const startDateTime = `${date}T${startTime}`;
        const endDateTime = `${date}T${endTime}`;

        if (new Date(endDateTime) <= new Date(startDateTime)) {
            alert('A hora de término deve ser posterior à hora de início.');
            return;
        }

        const tasks = getTasksFromStorage(userId);

        // Se estiver editando, atualiza a tarefa
        if (editReference && typeof editReference.index === 'number') {
            const task = {
                title,
                description,
                date: startDateTime,
                startTime: startDateTime,
                endTime: endDateTime,
                category,
                priority,
                recurrence
            };
            tasks[editReference.index] = task;
            saveTasksToStorage(userId, tasks);
            localStorage.removeItem('editTaskReference');
            alert('Tarefa editada com sucesso!');
            window.location.href = '../front_page/index.html';
            return;
        }

        // Criação de nova tarefa com recorrência
        const baseTask = {
            title,
            description,
            category,
            priority,
            recurrence
        };

        const limitDate = new Date(startDateTime);
        limitDate.setFullYear(limitDate.getFullYear() + 1);

        const recurringDates = recurrence !== 'nenhuma' 
            ? generateRecurringDates(new Date(startDateTime), recurrence, limitDate)
            : [new Date(startDateTime)];

        recurringDates.forEach(recurringDate => {
            const taskDate = recurringDate.toISOString().split('T')[0];
            const taskStartTime = `${taskDate}T${startTime}`;
            const taskEndTime = `${taskDate}T${endTime}`;

            const task = {
                ...baseTask,
                date: taskStartTime,
                startTime: taskStartTime,
                endTime: taskEndTime
            };
            tasks.push(task);
        });

        saveTasksToStorage(userId, tasks);
        alert('Tarefa(s) salva(s) com sucesso!');
        window.location.href = '../front_page/index.html';
    });
    const botaoCancelar = document.querySelector('.btncanc');
        botaoCancelar.addEventListener('click', () => {
        window.location.href = '../front_page/index.html';
    });
});