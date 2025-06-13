document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;

    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark-theme') {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }

    const senhaAtualInput = document.getElementById('senha-atual');
    const novaSenhaInput = document.getElementById('nova-senha');
    const confirmarSenhaInput = document.getElementById('confirmar-senha');
    const alterarSenhaButton = document.querySelector('.button-container button');
    const mensagemDiv = document.getElementById('mensagem-feedback');
    const indicadorForca = document.getElementById('indicador-forca');

    // Função para verificar se a senha atende aos critérios do registro
    function verificarForcaSenha(senha) {
        const atendeCriterios =
            senha.length >= 8 &&
            /[A-Z]/.test(senha) &&
            /[a-z]/.test(senha) &&
            /[0-9]/.test(senha) &&
            /[^A-Za-z0-9]/.test(senha); 

        return atendeCriterios;
    }

    // Avaliação de força da senha 
    function avaliarForcaSenha(senha) {
        let forca = 0;
        if (senha.length >= 8) forca++; 
        if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) forca++; 
        if (/\d/.test(senha)) forca++; 
        if (/[\W_]/.test(senha)) forca++; 
        if (senha.length >= 12) forca++; 

        if (forca <= 2) return 'Fraca';
        if (forca <= 4) return 'Média';
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

            
            if (!verificarForcaSenha(senha)) {
                indicadorForca.textContent += ' (Mínimo: 8 caracteres, Maiúscula, Minúscula, Número, Símbolo)';
                indicadorForca.style.color = 'red';
            } else {
               
                indicadorForca.textContent = `Força da senha: ${forca}`;
            }
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

        // Validação de campos vazios
        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            if (mensagemDiv) {
                mensagemDiv.textContent = 'Por favor, preencha todos os campos.';
            }
            return; 
        }

        // Validação se as novas senhas coincidem
        if (novaSenha !== confirmarSenha) {
            if (mensagemDiv) {
                mensagemDiv.textContent = 'As novas senhas não coincidem.';
            }
            return; // Interrompe a execução
        }

        // Validação de força da nova senha 
        if (!verificarForcaSenha(novaSenha)) {
            if (mensagemDiv) {
                mensagemDiv.textContent = 'A nova senha deve ter no mínimo 8 caracteres. Incluindo letras maiúsculas, minúsculas, números e símbolos.';
            }
            return; 
        }

        // Obtem o usuário logado 
        const usuarioLogadoEmail = Object.keys(localStorage).find(key => {
            try {
                const user = JSON.parse(localStorage.getItem(key));
                
                return user && user.nome && user.email && user.email === key;
            } catch (e) {
                return false;
            }
        });

        if (!usuarioLogadoEmail) {
            if (mensagemDiv) {
                mensagemDiv.textContent = 'Nenhum usuário logado. Por favor, faça login primeiro.';
            }
            return; 
        }

        const usuarioLogado = JSON.parse(localStorage.getItem(usuarioLogadoEmail));

        // Acessar a lista de usuários
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        // Encontra o usuário na lista principal pelo nome (ou ID/email)
        const indiceUsuarioParaAtualizar = usuarios.findIndex(user => user.nome === usuarioLogado.nome);

        if (indiceUsuarioParaAtualizar === -1) {
            if (mensagemDiv) {
                mensagemDiv.textContent = 'Erro: Usuário não encontrado na base de dados local.';
            }
            return; // Interrompe a execução
        }

        const usuarioNoArray = usuarios[indiceUsuarioParaAtualizar];

        // Compara a senha atual digitada com a senha armazenada
        if (senhaAtual !== usuarioNoArray.senha) {
            if (mensagemDiv) {
                mensagemDiv.textContent = 'Senha atual incorreta.';
            }
            return; 
        }

        // Atualizar a senha
        usuarioNoArray.senha = novaSenha; 
        usuarios[indiceUsuarioParaAtualizar] = usuarioNoArray; 

        // Salva a lista atualizada de usuários de volta no localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        // Atualiza o usuário logado individualmente
        localStorage.setItem(usuarioLogadoEmail, JSON.stringify(usuarioNoArray));

        if (mensagemDiv) {
            mensagemDiv.textContent = 'Senha alterada com sucesso!';
            mensagemDiv.style.color = 'green'; 
            
            senhaAtualInput.value = '';
            novaSenhaInput.value = '';
            confirmarSenhaInput.value = '';
            if (indicadorForca) {
                indicadorForca.textContent = ''; 
                indicadorForca.style.color = ''; 
            }
        }
        
    });
});
