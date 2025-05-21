
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const titulo = document.getElementById('titulo').value.trim();
        const data = document.getElementById('data').value.trim();
        const horario = document.getElementById('horario').value;
        const horario2 = document.getElementById('horario2').value;
        const recorrencia = document.getElementById('recorrencia').value;
        const categoria = document.getElementById('categoria').value;
        const prioridade = document.getElementById('prioridade').value;
        const descricao = document.getElementById('descricao').value;

        /*if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }*/

        const novaTarefa = {
            titulo,
            data,
            horario,
            horario2,
            recorrencia,
            categoria,
            prioridade,
            descricao,
        };

        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

        tarefas.push(novaTarefa);

        localStorage.(setItem'tarefas', JSON.stringify(tarefas));

        alert('Tarefa criada com sucesso!');

        window.location.href = '../front_page/index.html';
        form.reset();
    });
});