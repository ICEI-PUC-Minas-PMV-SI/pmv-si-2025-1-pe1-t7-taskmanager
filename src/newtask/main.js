
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

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    const usuarioLogado = getLoggedInUser();
    renderCategorias(usuarioLogado);

    form.addEventListener('submit', function (event) {
        event.preventDefault();

// Função que obtém todas as tarefas do usuário
function getTasksFromStorage(userId) {
    const tasksJson = localStorage.getItem(`tasks_${userId}`);
    return tasksJson ? JSON.parse(tasksJson) : [];
}

// Captura o envio do formulário para salvar ou editar a tarefa
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();

    const user = getLoggedInUser();
    if (!user) {
        alert('Você precisa estar logado para criar tarefas.');
        window.location.href = '../login/index.html';
        return;
    }
// Função que salva todas as tarefas do usuário
function saveTasksToStorage(userId, tasks) {
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
}
    const userId = user.email.toLowerCase();

    // Captura os dados dos campos
    const title = document.getElementById('titulo').value.trim();
    const description = document.getElementById('descricao').value.trim();
    const date = document.getElementById('data').value;
    const startTime = document.getElementById('horario').value;
    const endTime = document.getElementById('horario2').value;
    const category = document.getElementById('categoria').value.trim();
    const priority = document.getElementById('prioridade').value;
    const recurrence = document.getElementById('recorrencia').value.trim();

    // Validações básicas
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

    const currentlyEditing = JSON.parse(localStorage.getItem('currentlyEditing'));
    const tasks = getTasksFromStorage(userId);

    // Atualiza tarefa se estiver editando
    if (currentlyEditing && typeof currentlyEditing.index === 'number') {
        tasks[currentlyEditing.index] = task;
        saveTasksToStorage(userId, tasks);
        localStorage.removeItem('currentlyEditing');
        alert('Tarefa editada com sucesso!');
        window.location.href = '../front_page/index.html';
        return;
    }

    // Caso contrário, adiciona nova tarefa
    tasks.push(task);
    saveTasksToStorage(userId, tasks);

    alert('Tarefa salva com sucesso!');
    window.location.href = '../front_page/index.html';
});

        // Função que salva todas as tarefas do usuário
    function saveTasksToStorage(userId, tasks) {
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
}

    });
});