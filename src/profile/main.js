document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light-theme';

    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(savedTheme);
    localStorage.setItem('theme', savedTheme);


    const fileInput = document.getElementById('fileInput');
    const botaoConfirmar = document.querySelector('.confirm');
    const botaoCancelar = document.querySelector('.cancel');
    const imagePlaceholder = document.querySelector('.image-placeholder');

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioLogado = getLoggedInUser();

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

    if (!usuarioLogado) {
        alert('Nenhum usuário logado!');
        window.location.href = '../login/index.html';
        return;
    }


    document.querySelector('input[name="email"]').value = usuarioLogado.email;

    if (usuarioLogado?.perfil) {
        const { nome, sobrenome, profissao, telefone, dataNascimento, imagem } = usuarioLogado.perfil;

        document.querySelector('input[name="nome"]').value = nome || '';
        document.querySelector('input[name="sobrenome"]').value = sobrenome || '';
        document.querySelector('input[name="profissao"]').value = profissao || '';
        document.querySelector('input[name="telefone"]').value = telefone || '';
        document.querySelector('input[name="dataNascimento"]').value = dataNascimento || '';

        if (imagem) {
            imagePlaceholder.innerHTML = `<img src="${imagem}" style="width:100%; height:100%; object-fit:cover;">`;
        }
    }

    fileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const base64 = reader.result;
            imagePlaceholder.innerHTML = `<img src="${base64}" style="width:100%; height:100%; object-fit:cover;">`;

            usuarioLogado.perfil = {
                ...(usuarioLogado.perfil || {}),
                imagem: base64
            };

            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

            const index = usuarios.findIndex(user => user.email === usuarioLogado.email);
            if (index !== -1) {
                usuarios[index] = usuarioLogado;
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
            }
        };

        reader.readAsDataURL(file);
    });


    botaoConfirmar.addEventListener('click', () => {
        const perfil = {
            nome: document.querySelector('input[name="nome"]').value.trim(),
            sobrenome: document.querySelector('input[name="sobrenome"]').value.trim(),
            email: document.querySelector('input[name="email"]').value.trim(),
            profissao: document.querySelector('input[name="profissao"]').value.trim(),
            telefone: document.querySelector('input[name="telefone"]').value.trim(),
            dataNascimento: document.querySelector('input[name="dataNascimento"]').value,
            imagem: usuarioLogado.perfil?.imagem || null
        };

        usuarioLogado.perfil = perfil;

        localStorage.setItem(usuarioLogado.email, JSON.stringify(usuarioLogado));

        const index = usuarios.findIndex(user => user.email === usuarioLogado.email);

        if (index !== -1) {
            usuarios[index] = usuarioLogado;
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }

        alert('Perfil atualizado com sucesso!');

        window.location.href = '../front_page/index.html';
    });

    botaoCancelar.addEventListener('click', () => {
        window.location.href = '../front_page/index.html';
    });
});
  