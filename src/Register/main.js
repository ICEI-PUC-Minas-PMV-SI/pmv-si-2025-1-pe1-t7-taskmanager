
document.addEventListener('DOMContentLoaded', function () {
const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('usuario').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        const novoUsuario = {
            nome,
            email,
            senha,
        };

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        usuarios.push(novoUsuario);

        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        alert('Usuário cadastrado com sucesso!');

        window.location.href = '../login/index.html';
        form.reset();
    });
});
