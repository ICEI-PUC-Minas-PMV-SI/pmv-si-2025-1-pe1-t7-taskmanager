
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('usuario').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;

        if (!nome || !email || !senha || !confirmarSenha) {
            alert('Por favor, preencha todos os campos disponíveis.');
            return;
        }

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        const senhaForte = senha.length >= 8 &&
            /[A-Z]/.test(senha) &&
            /[a-z]/.test(senha) &&
            /[0-9]/.test(senha) &&
            /[^A-Za-z0-9]/.test(senha);

        if (!senhaForte) {
            alert('A senha deve ter no mínimo 8 caracteres. Incluindo letras maiúsculas, minúsculas, números e símbolos.');
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const usuarioExistente = usuarios.find(user =>
            user.nome.toLowerCase() === nome.toLowerCase() ||
            user.email.toLowerCase() === email.toLowerCase()
        );

        if (usuarioExistente) {
            alert('Nome de usuário ou e-mail já cadastrado.');
            return;
        }

        const novoUsuario = {
            nome,
            email,
            senha,
        };
        
        usuarios.push(novoUsuario);

        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        alert('Usuário cadastrado com sucesso!');

        window.location.href = '../login/index.html';
        form.reset();
    });
});
