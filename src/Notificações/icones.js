/ Script para implementar as funcionalidades dos ícones
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos da interface usando os atributos alt (mais confiável)
    const sinoIcon = document.querySelector('img[alt="Sino de Notificação"]');
    const darkModeIcon = document.querySelector('img[alt="Modo Escuro"]');
    const configIcon = document.querySelector('img[alt="Configurações"]');
    const userIcon = document.querySelector('img[alt="Usuário"]');
    
    const confirmButton = document.getElementById('confirm');
    const cancelButton = document.getElementById('cancel');
    
    // Cores para o modo escuro conforme especificado
    const darkModeColors = {
        background: '#4b4947',
        text: '#ffffff',
        container: '#656667',
        border: '#bdc1c4',
        elements: '#bdc1c4'
    };
    
    // Cores para o modo claro
    const lightModeColors = {
        background: '#f4f4f4',
        text: '#333333',
        container: '#ffffff',
        border: '#e0e0e0',
        elements: '#505ac9' // Mantendo a cor original dos checkboxes
    };
    
    // Função para aplicar o modo escuro
    function applyDarkMode(isDark) {
        if (isDark) {
            document.body.style.backgroundColor = darkModeColors.background;
            document.body.style.color = darkModeColors.text;
            
            // Aplicar estilos ao container principal
            const container = document.querySelector('.container');
            if (container) {
                container.style.backgroundColor = darkModeColors.container;
                container.style.borderColor = darkModeColors.border;
            }
            
            // Aplicar estilos aos checkboxes
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.style.accentColor = darkModeColors.elements;
            });
            
            // Aplicar estilos aos botões
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.backgroundColor = darkModeColors.container;
                button.style.color = darkModeColors.text;
                button.style.borderColor = darkModeColors.border;
            });
            
            // Aplicar estilos aos textos
            const labels = document.querySelectorAll('label');
            labels.forEach(label => {
                label.style.color = darkModeColors.text;
            });
            
            const heading = document.querySelector('h1');
            if (heading) {
                heading.style.color = darkModeColors.text;
            }
            
            // Aplicar estilos às bordas
            const header = document.querySelector('header');
            if (header) {
                header.style.borderBottomColor = darkModeColors.border;
            }
            
            const footer = document.querySelector('footer');
            if (footer) {
                footer.style.borderTopColor = darkModeColors.border;
            }
            
            // Adicionar classe para referência em CSS
            document.body.classList.add('dark-mode');
        } else {
            document.body.style.backgroundColor = lightModeColors.background;
            document.body.style.color = lightModeColors.text;
            
            // Restaurar estilos ao container principal
            const container = document.querySelector('.container');
            if (container) {
                container.style.backgroundColor = lightModeColors.container;
                container.style.borderColor = lightModeColors.border;
            }
            
            // Restaurar estilos aos checkboxes
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.style.accentColor = lightModeColors.elements;
            });
            
            // Restaurar estilos aos botões
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.backgroundColor = '';
                button.style.color = '';
                button.style.borderColor = '';
            });
            
            // Restaurar estilos aos textos
            const labels = document.querySelectorAll('label');
            labels.forEach(label => {
                label.style.color = '#555555';
            });
            
            const heading = document.querySelector('h1');
            if (heading) {
                heading.style.color = '#333333';
            }
            
            // Restaurar estilos às bordas
            const header = document.querySelector('header');
            if (header) {
                header.style.borderBottomColor = '#eeeeee';
            }
            
            const footer = document.querySelector('footer');
            if (footer) {
                footer.style.borderTopColor = '#eeeeee';
            }
            
            // Remover classe
            document.body.classList.remove('dark-mode');
        }
    }
    
    // Função para criar e mostrar um modal
    function showModal(title, content) {
        // Remover modal existente se houver
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Criar elementos do modal
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.position = 'fixed';
        modalOverlay.style.top = '0';
        modalOverlay.style.left = '0';
        modalOverlay.style.width = '100%';
        modalOverlay.style.height = '100%';
        modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modalOverlay.style.display = 'flex';
        modalOverlay.style.justifyContent = 'center';
        modalOverlay.style.alignItems = 'center';
        modalOverlay.style.zIndex = '1000';
        
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        modalContainer.style.backgroundColor = document.body.classList.contains('dark-mode') ? darkModeColors.container : lightModeColors.container;
        modalContainer.style.borderRadius = '8px';
        modalContainer.style.padding = '20px';
        modalContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        modalContainer.style.maxWidth = '500px';
        modalContainer.style.width = '90%';
        
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        modalHeader.style.display = 'flex';
        modalHeader.style.justifyContent = 'space-between';
        modalHeader.style.alignItems = 'center';
        modalHeader.style.marginBottom = '15px';
        
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = title;
        modalTitle.style.margin = '0';
        modalTitle.style.color = document.body.classList.contains('dark-mode') ? darkModeColors.text : lightModeColors.text;
        modalTitle.style.fontFamily = '"Montserrat", sans-serif';
        
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = document.body.classList.contains('dark-mode') ? darkModeColors.text : lightModeColors.text;
        closeButton.onclick = function() {
            modalOverlay.remove();
        };
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.color = document.body.classList.contains('dark-mode') ? darkModeColors.text : lightModeColors.text;
        modalContent.style.fontFamily = '"Montserrat", sans-serif';
        
        // Adicionar conteúdo ao modal
        if (typeof content === 'string') {
            modalContent.innerHTML = content;
        } else {
            modalContent.appendChild(content);
        }
        
        // Montar o modal
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        modalContainer.appendChild(modalHeader);
        modalContainer.appendChild(modalContent);
        modalOverlay.appendChild(modalContainer);
        
        // Adicionar ao documento
        document.body.appendChild(modalOverlay);
        
        // Fechar modal ao clicar fora
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
            }
        });
    }
    
    // Função para criar o conteúdo do modal de configurações
    function createConfigContent() {
        const configContent = document.createElement('div');
        
        // Alteração de senha
        const passwordSection = document.createElement('div');
        passwordSection.className = 'config-section';
        passwordSection.style.marginBottom = '20px';
        
        const passwordTitle = document.createElement('h3');
        passwordTitle.textContent = 'Alteração de senha';
        passwordTitle.style.marginBottom = '10px';
        passwordTitle.style.fontFamily = '"Montserrat", sans-serif';
        
        const passwordForm = document.createElement('div');
        passwordForm.innerHTML = `
            <div style="margin-bottom: 10px;">
                <label for="current-password" style="display: block; margin-bottom: 5px; font-family: 'Montserrat', sans-serif;">Senha atual:</label>
                <input type="password" id="current-password" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; font-family: 'Montserrat', sans-serif;">
            </div>
            <div style="margin-bottom: 10px;">
                <label for="new-password" style="display: block; margin-bottom: 5px; font-family: 'Montserrat', sans-serif;">Nova senha:</label>
                <input type="password" id="new-password" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; font-family: 'Montserrat', sans-serif;">
            </div>
            <div style="margin-bottom: 10px;">
                <label for="confirm-password" style="display: block; margin-bottom: 5px; font-family: 'Montserrat', sans-serif;">Confirmar senha:</label>
                <input type="password" id="confirm-password" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; font-family: 'Montserrat', sans-serif;">
            </div>
            <button id="change-password-btn" style="padding: 8px 16px; background-color: #505ac9; color: white; border: none; border-radius: 4px; cursor: pointer; font-family: 'Montserrat', sans-serif;">Alterar Senha</button>
        `;
        
        passwordSection.appendChild(passwordTitle);
        passwordSection.appendChild(passwordForm);
        
        // Seleção de idioma
        const languageSection = document.createElement('div');
        languageSection.className = 'config-section';
        languageSection.style.marginBottom = '20px';
        
        const languageTitle = document.createElement('h3');
        languageTitle.textContent = 'Seleção de idioma';
        languageTitle.style.marginBottom = '10px';
        languageTitle.style.fontFamily = '"Montserrat", sans-serif';
        
        const languageSelect = document.createElement('select');
        languageSelect.id = 'language-select';
        languageSelect.style.width = '100%';
        languageSelect.style.padding = '8px';
        languageSelect.style.borderRadius = '4px';
        languageSelect.style.border = '1px solid #ccc';
        languageSelect.style.fontFamily = '"Montserrat", sans-serif';
        
        const languages = [
            { code: 'pt-BR', name: 'Português (Brasil)' },
            { code: 'en-US', name: 'English (US)' },
            { code: 'es', name: 'Español' }
        ];
        
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            if (lang.code === 'pt-BR') {
                option.selected = true;
            }
            languageSelect.appendChild(option);
        });
        
        languageSection.appendChild(languageTitle);
        languageSection.appendChild(languageSelect);
        
        // Redefinição da agenda
        const resetSection = document.createElement('div');
        resetSection.className = 'config-section';
        resetSection.style.marginBottom = '20px';
        
        const resetTitle = document.createElement('h3');
        resetTitle.textContent = 'Redefinição da agenda';
        resetTitle.style.marginBottom = '10px';
        resetTitle.style.fontFamily = '"Montserrat", sans-serif';
        
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Redefinir Agenda';
        resetButton.style.padding = '8px 16px';
        resetButton.style.backgroundColor = '#e74c3c';
        resetButton.style.color = 'white';
        resetButton.style.border = 'none';
        resetButton.style.borderRadius = '4px';
        resetButton.style.cursor = 'pointer';
        resetButton.style.fontFamily = '"Montserrat", sans-serif';
        
        resetButton.onclick = function() {
            if (confirm('Tem certeza que deseja redefinir sua agenda? Esta ação não pode ser desfeita.')) {
                alert('Agenda redefinida com sucesso!');
            }
        };
        
        resetSection.appendChild(resetTitle);
        resetSection.appendChild(resetButton);
        
        // Gerenciamento das preferências de notificação
        const notifSection = document.createElement('div');
        notifSection.className = 'config-section';
        
        const notifTitle = document.createElement('h3');
        notifTitle.textContent = 'Gerenciamento das preferências de notificação';
        notifTitle.style.marginBottom = '10px';
        notifTitle.style.fontFamily = '"Montserrat", sans-serif';
        
        const notifButton = document.createElement('button');
        notifButton.textContent = 'Configurar Notificações';
        notifButton.style.padding = '8px 16px';
        notifButton.style.backgroundColor = '#505ac9';
        notifButton.style.color = 'white';
        notifButton.style.border = 'none';
        notifButton.style.borderRadius = '4px';
        notifButton.style.cursor = 'pointer';
        notifButton.style.fontFamily = '"Montserrat", sans-serif';
        
        notifButton.onclick = function() {
            // Fechar o modal atual
            document.querySelector('.modal-overlay').remove();
            
            // Simular clique no ícone de sino
            if (sinoIcon) {
                sinoIcon.click();
            }
        };
        
        notifSection.appendChild(notifTitle);
        notifSection.appendChild(notifButton);
        
        // Adicionar todas as seções ao conteúdo
        configContent.appendChild(passwordSection);
        configContent.appendChild(languageSection);
        configContent.appendChild(resetSection);
        configContent.appendChild(notifSection);
        
        return configContent;
    }
    
    // Função para criar o conteúdo do modal de perfil
    function createProfileContent() {
        const profileContent = document.createElement('div');
        
        // Dados do usuário
        const userDataSection = document.createElement('div');
        userDataSection.className = 'profile-section';
        userDataSection.style.marginBottom = '20px';
        
        const userDataTitle = document.createElement('h3');
        userDataTitle.textContent = 'Dados Cadastrais';
        userDataTitle.style.marginBottom = '10px';
        userDataTitle.style.fontFamily = '"Montserrat", sans-serif';
        
        const userDataForm = document.createElement('div');
        userDataForm.innerHTML = `
            <div style="margin-bottom: 10px;">
                <label for="user-name" style="display: block; margin-bottom: 5px; font-family: 'Montserrat', sans-serif;">Nome:</label>
                <input type="text" id="user-name" value="Usuário Padrão" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; font-family: 'Montserrat', sans-serif;">
            </div>
            <div style="margin-bottom: 10px;">
                <label for="user-email" style="display: block; margin-bottom: 5px; font-family: 'Montserrat', sans-serif;">Email:</label>
                <input type="email" id="user-email" value="usuario@exemplo.com" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; font-family: 'Montserrat', sans-serif;">
            </div>
            <div style="margin-bottom: 10px;">
                <label for="user-phone" style="display: block; margin-bottom: 5px; font-family: 'Montserrat', sans-serif;">Telefone:</label>
                <input type="tel" id="user-phone" value="(11) 98765-4321" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; font-family: 'Montserrat', sans-serif;">
            </div>
        `;
        
        userDataSection.appendChild(userDataTitle);
        userDataSection.appendChild(userDataForm);
        
        // Upload de avatar
        const avatarSection = document.createElement('div');
        avatarSection.className = 'profile-section';
        
        const avatarTitle = document.createElement('h3');
        avatarTitle.textContent = 'Avatar do Perfil';
        avatarTitle.style.marginBottom = '10px';
        avatarTitle.style.fontFamily = '"Montserrat", sans-serif';
        
        const avatarContainer = document.createElement('div');
        avatarContainer.style.display = 'flex';
        avatarContainer.style.alignItems = 'center';
        avatarContainer.style.marginBottom = '15px';
        
        const avatarPreview = document.createElement('div');
        avatarPreview.style.width = '80px';
        avatarPreview.style.height = '80px';
        avatarPreview.style.borderRadius = '50%';
        avatarPreview.style.backgroundColor = '#e0e0e0';
        avatarPreview.style.marginRight = '15px';
        avatarPreview.style.display = 'flex';
        avatarPreview.style.justifyContent = 'center';
        avatarPreview.style.alignItems = 'center';
        avatarPreview.style.fontSize = '36px';
        avatarPreview.style.color = '#999';
        avatarPreview.textContent = 'U';
        
        const avatarUpload = document.createElement('div');
        avatarUpload.innerHTML = `
            <input type="file" id="avatar-upload" accept="image/*" style="display: none;">
            <label for="avatar-upload" style="padding: 8px 16px; background-color: #505ac9; color: white; border-radius: 4px; cursor: pointer; display: inline-block; font-family: 'Montserrat', sans-serif;">Escolher Imagem</label>
        `;
        
        avatarContainer.appendChild(avatarPreview);
        avatarContainer.appendChild(avatarUpload);
        
        // Botão salvar
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Salvar Alterações';
        saveButton.style.padding = '10px 20px';
        saveButton.style.backgroundColor = '#505ac9';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.marginTop = '15px';
        saveButton.style.fontFamily = '"Montserrat", sans-serif';
        
        saveButton.onclick = function() {
            alert('Perfil atualizado com sucesso!');
        };
        
        // Adicionar evento para preview da imagem
        avatarSection.appendChild(avatarTitle);
        avatarSection.appendChild(avatarContainer);
        avatarSection.appendChild(saveButton);
        
        // Adicionar todas as seções ao conteúdo
        profileContent.appendChild(userDataSection);
        profileContent.appendChild(avatarSection);
        
        // Adicionar funcionalidade de preview da imagem
        setTimeout(() => {
            const fileInput = document.getElementById('avatar-upload');
            if (fileInput) {
                fileInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(event) {
                            avatarPreview.textContent = '';
                            avatarPreview.style.backgroundImage = `url(${event.target.result})`;
                            avatarPreview.style.backgroundSize = 'cover';
                            avatarPreview.style.backgroundPosition = 'center';
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
        }, 100);
        
        return profileContent;
    }
    
    // Verificar se há preferência de modo escuro salva
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
        applyDarkMode(true);
    }
    
    // Funcionalidade do ícone de Sino (Notificações)
    if (sinoIcon) {
        sinoIcon.addEventListener('click', function() {
            // Como estamos já na tela de notificações, apenas focamos na área
            const notificationTitle = document.querySelector('h1');
            if (notificationTitle) {
                notificationTitle.scrollIntoView({ behavior: 'smooth' });
                
                // Adicionar animação de destaque
                notificationTitle.style.transition = 'color 0.3s';
                notificationTitle.style.color = '#505ac9';
                
                setTimeout(() => {
                    notificationTitle.style.color = document.body.classList.contains('dark-mode') ? darkModeColors.text : '#333333';
                }, 1000);
            }
        });
    }
    
    // Funcionalidade do ícone de Modo Escuro
    if (darkModeIcon) {
        darkModeIcon.addEventListener('click', function() {
            const isDark = document.body.classList.contains('dark-mode');
            applyDarkMode(!isDark);
            
            // Salvar preferência
            localStorage.setItem('darkMode', !isDark ? 'enabled' : 'disabled');
        });
    }
    
    // Funcionalidade do ícone de Configurações
    if (configIcon) {
        configIcon.addEventListener('click', function() {
            showModal('Configurações', createConfigContent());
        });
    }
    
    // Funcionalidade do ícone de Perfil
    if (userIcon) {
        userIcon.addEventListener('click', function() {
            showModal('Perfil do Usuário', createProfileContent());
        });
    }
    
    // Funcionalidade dos checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Salvar estado inicial dos checkboxes
    let initialState = {};
    checkboxes.forEach(function(checkbox) {
        initialState[checkbox.id || checkbox.name] = checkbox.checked;
    });
    
    // Carregar preferências salvas anteriormente
    checkboxes.forEach(function(checkbox) {
        const id = checkbox.id || checkbox.name;
        const savedState = localStorage.getItem(`checkbox_${id}`);
        if (savedState !== null) {
            checkbox.checked = savedState === 'true';
            initialState[id] = checkbox.checked;
        }
    });
    
    // Funcionalidade do botão Confirmar
    if (confirmButton) {
        confirmButton.addEventListener('click', function() {
            // Salvar o estado atual dos checkboxes
            checkboxes.forEach(function(checkbox) {
                const id = checkbox.id || checkbox.name;
                localStorage.setItem(`checkbox_${id}`, checkbox.checked);
                initialState[id] = checkbox.checked;
            });
            
            alert('Preferências salvas com sucesso!');
        });
    }
    
    // Funcionalidade do botão Cancelar
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            // Restaurar o estado inicial dos checkboxes
            checkboxes.forEach(function(checkbox) {
                const id = checkbox.id || checkbox.name;
                checkbox.checked = initialState[id];
            });
            
            alert('Alterações descartadas.');
        });
    }
    
    // Log para confirmar que o script foi carregado
    console.log('Script de funcionalidades dos ícones carregado com sucesso!');
});
