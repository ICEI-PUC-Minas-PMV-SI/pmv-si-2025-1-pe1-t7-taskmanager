document.addEventListener('DOMContentLoaded', function () {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');
    const senhaAtualInput = document.getElementById('senha-atual');
    const novaSenhaInput = document.getElementById('nova-senha');
    const confirmarSenhaInput = document.getElementById('confirmar-senha');
    const alterarSenhaButton = document.querySelector('.button-container button');
    const mensagemDiv = document.getElementById('mensagem-feedback');
    const indicadorForca = document.getElementById('indicador-forca');

    // Aplica tema salvo
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggleButton.textContent = 'Modo Claro';
    }

    themeToggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        themeToggleButton.textContent = isDark ? 'Modo Claro' : 'Modo Escuro';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Avaliação de força da senha
    function avaliarForcaSenha(senha) {
        let forca = 0;
        if (senha.length >= 6) forca++;
        if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) forca++;
        if (/\d/.test(senha)) forca++;
        if (/[\W_]/.test(senha)) forca++;
        if (senha.length >= 12) forca++;

        if (forca <= 1) return 'Fraca';
        if (forca <= 3) return 'Média';
        return 'Forte';
    }

    novaSenhaInput.addEventListener('input', () => {
        const senha = novaSenhaInput.value;
        const forca = avaliarForcaSenha(senha);
        if (indicadorForca) {
            indicadorForca.textContent = `Força da senha: ${forca}`;
            indicadorForca.style.color = {
                'Fraca': 'red',
                'Média': 'orange',
                'Forte': 'green'
            }[forca];
        }
    });

    alterarSenhaButton.addEventListener('click', function (event) {
        event.preventDefault();

        const senhaAtual = senhaAtualInput.value.trim();
        const novaSenha = novaSenhaInput.value.trim();
        const confirmarSenha = confirmarSenhaInput.value.trim();

        if (mensagemDiv) {
            mensagemDiv.textContent = '';
            mensagemDiv.style.color = 'red';
        }

        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            if (mensagemDiv) {
                mensagemDiv.textContent = 'Por favor, preencha todos os campos.';
            }
            return;
        }

        if (novaSenha !== confirmarSenha) {
            if (mensagemDiv) {
                mensagemDiv.textContent = 'As senhas não coincidem.';
            }
            return;
        }

        if (mensagemDiv) {
            mensagemDiv.style.color = 'black';
            mensagemDiv.textContent = 'Alterando senha...';
        }

        fetch('/api/alterar-senha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senhaAtual: senhaAtual, novaSenha: novaSenha }),
        })
            .then(response => response.json())
            .then(data => {
                if (mensagemDiv) {
                    mensagemDiv.textContent = data.message;
                    if (data.success) {
                        mensagemDiv.style.color = 'green';
                        senhaAtualInput.value = '';
                        novaSenhaInput.value = '';
                        confirmarSenhaInput.value = '';
                        if (indicadorForca) {
                            indicadorForca.textContent = '';
                        }
                    } else {
                        mensagemDiv.style.color = 'red';
                    }
                }
            })
            .catch(error => {
                console.error('Erro ao alterar a senha:', error);
                if (mensagemDiv) {
                    mensagemDiv.style.color= blue;
                    mensagemDiv.textContent = 'Ocorreu um erro ao tentar alterar a senha.';
                }
            });
    });
});
