
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function (event) {
        event.preventDefault();
    
        const usuario = document.getElementById('username').value.trim();
        const senha = document.getElementById('password').value;

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const usarioEncontrado = usuarios.find(user => user.nome === usuario)
    
        if (usarioEncontrado.senha !== senha) {
            alert('Senha incorreta!');
            return
        }

        localStorage.setItem(usarioEncontrado.email, JSON.stringify(usarioEncontrado));
        alert('Usuário logado com sucesso!');
        window.location.href = '../front_page/index.html';

        form.reset();
    });
});
    