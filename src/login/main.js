document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function (event) {
        event.preventDefault();
    
        const usuario = document.getElementById('username').value.trim();
        const senha = document.getElementById('password').value;

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const usuarioEncontrado = usuarios.find(user => user.nome === usuario)

        if (!usuarioEncontrado) {
          alert('Usuário não encontrado!');
          return;
        }
    
        if (usuarioEncontrado.senha !== senha) {
            alert('Senha incorreta!');
            return
        }

        localStorage.setItem(usuarioEncontrado.email, JSON.stringify(usuarioEncontrado));
        alert('Usuário logado com sucesso!');
        window.location.href = '../front_page/index.html';

        form.reset();
    });

    const linkEsqueciSenha = document.getElementById("esqueci-senha");

    linkEsqueciSenha.addEventListener("click", function(event) {
        event.preventDefault(); 
        const frases = prompt("digite a frase para recuperar a senha: ");

        const frase = JSON.parse(localStorage.getItem('frases')) || [];

        const fraseEncontrada = frase.find(f => f === frases);

        if (fraseEncontrada) {
          window.location.href = '../front_page/index.html';
        } else {
          alert("Frase incorreta. Tente novamente.");
        }
    });

    const cadastro = document.getElementById("cadastro");

    cadastro.addEventListener("click", function(event) {
      event.preventDefault();
      window.location.href = '../register/index.html'
    })
});
