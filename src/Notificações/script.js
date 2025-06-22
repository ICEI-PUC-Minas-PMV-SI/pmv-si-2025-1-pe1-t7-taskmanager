/// script.js - Arquivo JavaScript consolidado para a tela de notificações

// storage.js - Módulo de armazenamento global para o TaskManager
// Este módulo pode ser usado em qualquer página do projeto

const TaskManagerStorage = {
    // Prefixo para evitar conflitos no localStorage
    PREFIX: 'taskmanager_',

    /**
     * Salva um valor no localStorage
     * @param {string} key - Chave para armazenar o valor
     * @param {any} value - Valor a ser armazenado (será convertido para JSON)
     * @returns {boolean} - true se salvou com sucesso, false caso contrário
     */
    set(key, value) {
        try {
            localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    },

    /**
     * Recupera um valor do localStorage
     * @param {string} key - Chave do valor a ser recuperado
     * @param {any} defaultValue - Valor padrão se a chave não existir
     * @returns {any} - Valor recuperado ou valor padrão
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.PREFIX + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Erro ao ler do localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Remove um valor do localStorage
     * @param {string} key - Chave do valor a ser removido
     * @returns {boolean} - true se removeu com sucesso, false caso contrário
     */
    remove(key) {
        try {
            localStorage.removeItem(this.PREFIX + key);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    },

    /**
     * Limpa todos os dados do TaskManager do localStorage
     * @returns {boolean} - true se limpou com sucesso, false caso contrário
     */
    clear() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    },

    /**
     * Obtém todas as chaves do TaskManager no localStorage
     * @returns {string[]} - Array com todas as chaves (sem o prefixo)
     */
    getAllKeys() {
        try {
            return Object.keys(localStorage)
                .filter(key => key.startsWith(this.PREFIX))
                .map(key => key.replace(this.PREFIX, ''));
        } catch (error) {
            console.error('Erro ao obter chaves do localStorage:', error);
            return [];
        }
    },

    /**
     * Verifica se uma chave existe no localStorage
     * @param {string} key - Chave a ser verificada
     * @returns {boolean} - true se a chave existe, false caso contrário
     */
    exists(key) {
        return localStorage.getItem(this.PREFIX + key) !== null;
    }
};

// Funções específicas para gerenciar preferências de notificação
const NotificationPreferences = {
    /**
     * Salva as preferências de notificação
     * @param {Object} preferences - Objeto com as preferências
     */
    save(preferences) {
        return TaskManagerStorage.set('notificationPreferences', preferences);
    },

    /**
     * Carrega as preferências de notificação
     * @returns {Object} - Objeto com as preferências ou valores padrão
     */
    load() {
        return TaskManagerStorage.get('notificationPreferences', {
            // Categorias padrão
            cat1: true,  // Trabalho
            cat2: true,  // Casa
            cat3: false, // Saúde
            cat4: true,  // Pessoal
            cat5: false, // Outro
            // Prioridades padrão
            prio1: false, // Prioridade Mínima
            prio2: true,  // Prioridade Média
            prio3: false  // Prioridade Máxima
        });
    },

    /**
     * Atualiza uma preferência específica
     * @param {string} key - Chave da preferência (ex: 'cat1', 'prio2')
     * @param {boolean} value - Novo valor da preferência
     */
    update(key, value) {
        const preferences = this.load();
        preferences[key] = value;
        return this.save(preferences);
    },

    /**
     * Obtém o valor de uma preferência específica
     * @param {string} key - Chave da preferência
     * @returns {boolean} - Valor da preferência
     */
    get(key) {
        const preferences = this.load();
        return preferences[key] || false;
    },

    /**
     * Reseta as preferências para os valores padrão
     */
    reset() {
        return TaskManagerStorage.remove('notificationPreferences');
    }
};

// Funções específicas para gerenciar configurações de tema
const ThemeSettings = {
    /**
     * Salva a preferência de modo escuro
     * @param {boolean} isDarkMode - true para modo escuro, false para modo claro
     */
    setDarkMode(isDarkMode) {
        return TaskManagerStorage.set('darkMode', isDarkMode);
    },

    /**
     * Carrega a preferência de modo escuro
     * @returns {boolean} - true se modo escuro está ativo, false caso contrário
     */
    isDarkMode() {
        return TaskManagerStorage.get('darkMode', false);
    },

    /**
     * Alterna entre modo claro e escuro
     * @returns {boolean} - Novo estado do modo escuro
     */
    toggleDarkMode() {
        const newState = !this.isDarkMode();
        this.setDarkMode(newState);
        return newState;
    }
};

// Funções específicas para gerenciar dados do perfil
const ProfileData = {
    /**
     * Salva os dados do perfil
     * @param {Object} profileData - Dados do perfil
     */
    save(profileData) {
        return TaskManagerStorage.set('profileData', profileData);
    },

    /**
     * Carrega os dados do perfil
     * @returns {Object} - Dados do perfil ou valores padrão
     */
    load() {
        return TaskManagerStorage.get('profileData', {
            name: '',
            email: '',
            phone: '',
            bio: '',
            avatar: null
        });
    },

    /**
     * Atualiza um campo específico do perfil
     * @param {string} field - Campo a ser atualizado
     * @param {any} value - Novo valor do campo
     */
    updateField(field, value) {
        const profile = this.load();
        profile[field] = value;
        return this.save(profile);
    },

    /**
     * Salva o avatar do usuário
     * @param {string} avatarData - Dados do avatar (base64)
     */
    setAvatar(avatarData) {
        return this.updateField('avatar', avatarData);
    },

    /**
     * Obtém o avatar do usuário
     * @returns {string|null} - Dados do avatar ou null
     */
    getAvatar() {
        const profile = this.load();
        return profile.avatar;
    }
};

// Funções específicas para gerenciar configurações de idioma
const LanguageSettings = {
    /**
     * Salva a preferência de idioma
     * @param {string} language - Código do idioma (ex: 'pt-BR', 'en-US')
     */
    set(language) {
        return TaskManagerStorage.set('language', language);
    },

    /**
     * Carrega a preferência de idioma
     * @returns {string} - Código do idioma ou padrão
     */
    get() {
        return TaskManagerStorage.get('language', 'pt-BR');
    },

    /**
     * Obtém o nome do idioma baseado no código
     * @param {string} code - Código do idioma
     * @returns {string} - Nome do idioma
     */
    getName(code = null) {
        const languageCode = code || this.get();
        const languages = {
            'pt-BR': 'Português (Brasil)',
            'en-US': 'English (US)',
            'es': 'Español'
        };
        return languages[languageCode] || languageCode;
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.TaskManagerStorage = TaskManagerStorage;
    window.NotificationPreferences = NotificationPreferences;
    window.ThemeSettings = ThemeSettings;
    window.ProfileData = ProfileData;
    window.LanguageSettings = LanguageSettings;
}

// Exportar para uso em módulos (se suportado)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TaskManagerStorage,
        NotificationPreferences,
        ThemeSettings,
        ProfileData,
        LanguageSettings
    };
}

// header.js - Componente de cabeçalho reutilizável para o TaskManager

class TaskManagerHeader {
    constructor(options = {}) {
        this.options = {
            title: 'TaskManager',
            showNotificationIcon: true,
            showDarkModeToggle: true,
            showSettingsIcon: true,
            showUserIcon: true,
            container: null,
            ...options
        };
        
        this.isInitialized = false;
        this.eventListeners = [];
    }

    /**
     * Inicializa o componente de cabeçalho
     * @param {string|HTMLElement} container - Seletor ou elemento onde o cabeçalho será inserido
     */
    init(container = null) {
        if (this.isInitialized) {
            console.warn('Header já foi inicializado');
            return;
        }

        // Determinar o container
        const targetContainer = container || this.options.container;
        let headerContainer;

        if (typeof targetContainer === 'string') {
            headerContainer = document.querySelector(targetContainer);
        } else if (targetContainer instanceof HTMLElement) {
            headerContainer = targetContainer;
        } else {
            // Se não especificado, procurar por um elemento com classe 'header-container'
            headerContainer = document.querySelector('.header-container');
            if (!headerContainer) {
                console.error('Container para o cabeçalho não encontrado');
                return;
            }
        }

        // Gerar HTML do cabeçalho
        headerContainer.innerHTML = this.generateHTML();

        // Configurar event listeners
        this.setupEventListeners();

        // Aplicar tema atual
        this.applyCurrentTheme();

        this.isInitialized = true;
        console.log('TaskManager Header inicializado com sucesso');
    }

    /**
     * Gera o HTML do cabeçalho
     * @returns {string} - HTML do cabeçalho
     */
    generateHTML() {
        const icons = [];

        if (this.options.showNotificationIcon) {
            icons.push(`
                <span class="material-icons header-icon" id="notificationIcon" title="Notificações" data-action="notification">
                    notifications
                </span>
            `);
        }

        if (this.options.showDarkModeToggle) {
            icons.push(`
                <span class="material-icons header-icon" id="darkModeToggle" title="Alternar modo escuro" data-action="darkmode">
                    contrast
                </span>
            `);
        }

        if (this.options.showSettingsIcon) {
            icons.push(`
                <span class="material-icons header-icon" id="settingsIcon" title="Configurações" data-action="settings">
                    settings
                </span>
            `);
        }

        if (this.options.showUserIcon) {
            icons.push(`
                <span class="material-icons header-icon" id="userIcon" title="Perfil do usuário" data-action="profile">
                    account_circle
                </span>
            `);
        }

        return `
            <header class="taskmanager-header">
                <h1 class="header-title">${this.options.title}</h1>
                <div class="header-icons">
                    ${icons.join('')}
                </div>
            </header>
        `;
    }

    /**
     * Configura os event listeners do cabeçalho
     */
    setupEventListeners() {
        // Event listener para ícones
        const icons = document.querySelectorAll('.header-icon');
        icons.forEach(icon => {
            const clickHandler = (e) => this.handleIconClick(e);
            icon.addEventListener('click', clickHandler);
            
            // Armazenar referência para poder remover depois
            this.eventListeners.push({
                element: icon,
                event: 'click',
                handler: clickHandler
            });
        });
    }

    /**
     * Manipula cliques nos ícones do cabeçalho
     * @param {Event} event - Evento de clique
     */
    handleIconClick(event) {
        const action = event.target.getAttribute('data-action');
        
        switch (action) {
            case 'notification':
                this.handleNotificationClick();
                break;
            case 'darkmode':
                this.handleDarkModeToggle();
                break;
            case 'settings':
                this.handleSettingsClick();
                break;
            case 'profile':
                this.handleProfileClick();
                break;
            default:
                console.warn('Ação não reconhecida:', action);
        }
    }

    /**
     * Manipula clique no ícone de notificações
     */
    handleNotificationClick() {
        // Destacar o título
        const title = document.querySelector('.header-title');
        if (title) {
            title.style.color = 'var(--primary-color, #505AC9)';
            title.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                title.style.color = '';
                title.style.transform = '';
            }, 1000);
        }

        // Emitir evento customizado
        this.emitEvent('notification-clicked');
        
        // Mostrar toast se disponível
        if (window.TaskManagerToast) {
            window.TaskManagerToast.success('Você está na tela de notificações!');
        }
    }

    /**
     * Manipula toggle do modo escuro
     */
    handleDarkModeToggle() {
        if (window.ThemeSettings) {
            const newState = window.ThemeSettings.toggleDarkMode();
            this.applyTheme(newState);
            
            // Emitir evento customizado
            this.emitEvent('theme-changed', { isDarkMode: newState });
            
            // Mostrar toast se disponível
            if (window.TaskManagerToast) {
                window.TaskManagerToast.success(`Modo ${newState ? 'escuro' : 'claro'} ativado`);
            }
        } else {
            console.warn('ThemeSettings não está disponível');
        }
    }

    /**
     * Manipula clique no ícone de configurações
     */
    handleSettingsClick() {
        // Emitir evento customizado para que a página possa abrir o modal
        this.emitEvent('settings-clicked');
        
        // Se houver um modal manager global, tentar abrir o modal
        if (window.TaskManagerModal) {
            window.TaskManagerModal.open('settingsModal');
        } else {
            console.log('Modal de configurações solicitado');
        }
    }

    /**
     * Manipula clique no ícone de perfil
     */
    handleProfileClick() {
        // Emitir evento customizado para que a página possa abrir o modal
        this.emitEvent('profile-clicked');
        
        // Se houver um modal manager global, tentar abrir o modal
        if (window.TaskManagerModal) {
            window.TaskManagerModal.open('profileModal');
        } else {
            console.log('Modal de perfil solicitado');
        }
    }

    /**
     * Aplica o tema atual baseado nas configurações salvas
     */
    applyCurrentTheme() {
        if (window.ThemeSettings) {
            const isDarkMode = window.ThemeSettings.isDarkMode();
            this.applyTheme(isDarkMode);
        }
    }

    /**
     * Aplica um tema específico
     * @param {boolean} isDarkMode - true para modo escuro, false para modo claro
     */
    applyTheme(isDarkMode) {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    /**
     * Emite um evento customizado
     * @param {string} eventName - Nome do evento
     * @param {Object} detail - Dados do evento
     */
    emitEvent(eventName, detail = {}) {
        const event = new CustomEvent(`taskmanager-header-${eventName}`, {
            detail,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    /**
     * Atualiza o título do cabeçalho
     * @param {string} newTitle - Novo título
     */
    updateTitle(newTitle) {
        this.options.title = newTitle;
        const titleElement = document.querySelector('.header-title');
        if (titleElement) {
            titleElement.textContent = newTitle;
        }
    }

    /**
     * Mostra ou oculta um ícone específico
     * @param {string} iconType - Tipo do ícone ('notification', 'darkmode', 'settings', 'profile')
     * @param {boolean} show - true para mostrar, false para ocultar
     */
    toggleIcon(iconType, show) {
        const iconMap = {
            'notification': 'notificationIcon',
            'darkmode': 'darkModeToggle',
            'settings': 'settingsIcon',
            'profile': 'userIcon'
        };

        const iconId = iconMap[iconType];
        if (iconId) {
            const icon = document.getElementById(iconId);
            if (icon) {
                icon.style.display = show ? 'inline-block' : 'none';
            }
        }
    }

    /**
     * Destrói o componente e remove event listeners
     */
    destroy() {
        // Remover event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];

        // Limpar HTML
        const headerElement = document.querySelector('.taskmanager-header');
        if (headerElement) {
            headerElement.remove();
        }

        this.isInitialized = false;
        console.log('TaskManager Header destruído');
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.TaskManagerHeader = TaskManagerHeader;
}

// Exportar para uso em módulos (se suportado)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskManagerHeader;
}

// toast.js - Sistema de notificações toast reutilizável para o TaskManager

class TaskManagerToast {
    constructor(options = {}) {
        this.options = {
            container: null,
            duration: 5000,
            position: 'top-right',
            maxToasts: 5,
            animationDuration: 300,
            ...options
        };
        
        this.container = null;
        this.toasts = [];
        this.isInitialized = false;
    }

    /**
     * Inicializa o sistema de toast
     */
    init() {
        if (this.isInitialized) {
            return;
        }

        this.createContainer();
        this.isInitialized = true;
        console.log('TaskManager Toast inicializado');
    }

    /**
     * Cria o container para os toasts
     */
    createContainer() {
        // Verificar se já existe um container
        this.container = document.getElementById('taskmanager-toast-container');
        
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'taskmanager-toast-container';
            this.container.className = `toast-container toast-${this.options.position}`;
            document.body.appendChild(this.container);
        }
    }

    /**
     * Mostra um toast
     * @param {string} message - Mensagem a ser exibida
     * @param {string} type - Tipo do toast ('success', 'error', 'warning', 'info')
     * @param {number} duration - Duração em milissegundos (opcional)
     * @returns {HTMLElement} - Elemento do toast criado
     */
    show(message, type = 'info', duration = null) {
        if (!this.isInitialized) {
            this.init();
        }

        const toastDuration = duration !== null ? duration : this.options.duration;
        const toastId = this.generateId();
        
        // Criar elemento do toast
        const toast = this.createToastElement(toastId, message, type);
        
        // Adicionar ao container
        this.container.appendChild(toast);
        
        // Adicionar à lista de toasts
        this.toasts.push({
            id: toastId,
            element: toast,
            type: type,
            message: message,
            createdAt: Date.now()
        });

        // Limitar número de toasts
        this.limitToasts();

        // Animar entrada
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Auto-remoção
        if (toastDuration > 0) {
            setTimeout(() => {
                this.remove(toastId);
            }, toastDuration);
        }

        // Emitir evento
        this.emitEvent('toast-shown', { id: toastId, message, type });

        return toast;
    }

    /**
     * Cria o elemento HTML do toast
     * @param {string} id - ID único do toast
     * @param {string} message - Mensagem
     * @param {string} type - Tipo do toast
     * @returns {HTMLElement} - Elemento do toast
     */
    createToastElement(id, message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('data-toast-id', id);
        
        // Ícone baseado no tipo
        const icon = this.getIconForType(type);
        
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${this.escapeHtml(message)}</span>
            </div>
            <button class="toast-close" aria-label="Fechar notificação" data-action="close">
                <span class="material-icons">close</span>
            </button>
        `;

        // Event listener para fechar
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.remove(id);
        });

        // Event listener para clique no toast (opcional)
        toast.addEventListener('click', (e) => {
            if (!e.target.closest('.toast-close')) {
                this.emitEvent('toast-clicked', { id, message, type });
            }
        });

        return toast;
    }

    /**
     * Obtém o ícone para um tipo de toast
     * @param {string} type - Tipo do toast
     * @returns {string} - HTML do ícone
     */
    getIconForType(type) {
        const icons = {
            success: '<span class="material-icons">check_circle</span>',
            error: '<span class="material-icons">error</span>',
            warning: '<span class="material-icons">warning</span>',
            info: '<span class="material-icons">info</span>'
        };
        
        return icons[type] || icons.info;
    }

    /**
     * Remove um toast
     * @param {string} toastId - ID do toast a ser removido
     */
    remove(toastId) {
        const toastIndex = this.toasts.findIndex(t => t.id === toastId);
        if (toastIndex === -1) return;

        const toast = this.toasts[toastIndex];
        
        // Animar saída
        toast.element.classList.remove('show');
        toast.element.classList.add('hide');

        // Remover após animação
        setTimeout(() => {
            if (toast.element.parentNode) {
                toast.element.parentNode.removeChild(toast.element);
            }
            this.toasts.splice(toastIndex, 1);
            
            // Emitir evento
            this.emitEvent('toast-removed', { id: toastId });
        }, this.options.animationDuration);
    }

    /**
     * Limita o número de toasts visíveis
     */
    limitToasts() {
        while (this.toasts.length > this.options.maxToasts) {
            const oldestToast = this.toasts[0];
            this.remove(oldestToast.id);
        }
    }

    /**
     * Métodos de conveniência para diferentes tipos de toast
     */
    success(message, duration = null) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = null) {
        return this.show(message, 'error', duration);
    },

    warning(message, duration = null) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = null) {
        return this.show(message, 'info', duration);
    }

    /**
     * Remove todos os toasts
     */
    clear() {
        const toastIds = this.toasts.map(t => t.id);
        toastIds.forEach(id => this.remove(id));
    }

    /**
     * Obtém todos os toasts ativos
     * @returns {Array} - Array com informações dos toasts ativos
     */
    getActiveToasts() {
        return this.toasts.map(t => ({
            id: t.id,
            type: t.type,
            message: t.message,
            createdAt: t.createdAt
        }));
    }

    /**
     * Atualiza as opções do sistema de toast
     * @param {Object} newOptions - Novas opções
     */
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        
        // Atualizar posição do container se necessário
        if (newOptions.position && this.container) {
            this.container.className = `toast-container toast-${this.options.position}`;
        }
    }

    /**
     * Gera um ID único para o toast
     * @returns {string} - ID único
     */
    generateId() {
        return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Escapa HTML para prevenir XSS
     * @param {string} text - Texto a ser escapado
     * @returns {string} - Texto escapado
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Emite um evento customizado
     * @param {string} eventName - Nome do evento
     * @param {Object} detail - Dados do evento
     */
    emitEvent(eventName, detail = {}) {
        const event = new CustomEvent(`taskmanager-toast-${eventName}`, {
            detail,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    /**
     * Destrói o sistema de toast
     */
    destroy() {
        this.clear();
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        this.container = null;
        this.toasts = [];
        this.isInitialized = false;
        
        console.log('TaskManager Toast destruído');
    }
}

// Criar instância global
const globalToast = new TaskManagerToast();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.TaskManagerToast = globalToast;
    window.TaskManagerToastClass = TaskManagerToast;
}

// Exportar para uso em módulos (se suportado)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TaskManagerToast: TaskManagerToast, globalToast };
}

// Auto-inicializar quando o DOM estiver pronto
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            globalToast.init();
        });
    } else {
        globalToast.init();
    }
}

// notifications.js - Script modular da tela de notificações usando componentes reutilizáveis

class NotificationPage {
    constructor() {
        this.header = null;
        this.preferences = {};
        this.originalPreferences = {};
        this.isInitialized = false;
        this.eventListeners = [];
    }

    /**
     * Inicializa a página de notificações
     */
    init() {
        if (this.isInitialized) {
            console.warn('Página de notificações já foi inicializada');
            return;
        }

        // Aguardar carregamento do DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    /**
     * Inicia a aplicação após o DOM estar pronto
     */
    start() {
        try {
            // Verificar se os componentes estão disponíveis
            this.checkDependencies();

            // Inicializar componentes
            this.initializeHeader();
            this.loadNotificationPreferences();
            this.setupEventListeners();
            this.setupHeaderEventListeners();

            // Aplicar tema atual
            this.applyCurrentTheme();

            // Mostrar mensagem de boas-vindas
            setTimeout(() => {
                window.TaskManagerToast.success('Bem-vindo às configurações de notificação!');
            }, 500);

            this.isInitialized = true;
            console.log('Página de notificações inicializada com sucesso');

        } catch (error) {
            console.error('Erro ao inicializar página de notificações:', error);
            if (window.TaskManagerToast) {
                window.TaskManagerToast.error('Erro ao carregar a página. Recarregue a página.');
            }
        }
    }

    /**
     * Verifica se as dependências estão disponíveis
     */
    checkDependencies() {
        const dependencies = [
            'TaskManagerStorage',
            'NotificationPreferences',
            'ThemeSettings',
            'TaskManagerToast',
            'TaskManagerHeader'
        ];

        const missing = dependencies.filter(dep => !window[dep]);
        
        if (missing.length > 0) {
            throw new Error(`Dependências não encontradas: ${missing.join(', ')}`);
        }
    }

    /**
     * Inicializa o componente de cabeçalho
     */
    initializeHeader() {
        this.header = new window.TaskManagerHeader({
            title: 'Notificações',
            showNotificationIcon: true,
            showDarkModeToggle: true,
            showSettingsIcon: true,
            showUserIcon: true
        });

        this.header.init('.header-container');
    }

    /**
     * Carrega as preferências de notificação
     */
    loadNotificationPreferences() {
        // Carregar preferências salvas
        this.preferences = window.NotificationPreferences.load();
        
        // Salvar estado original para cancelamento
        this.originalPreferences = { ...this.preferences };

        // Aplicar ao DOM
        this.applyPreferencesToDOM();

        console.log('Preferências de notificação carregadas:', this.preferences);
    }

    /**
     * Aplica as preferências aos checkboxes no DOM
     */
    applyPreferencesToDOM() {
        Object.keys(this.preferences).forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = this.preferences[key];
            }
        });
    }

    /**
     * Configura os event listeners da página
     */
    setupEventListeners() {
        // Monitorar mudanças nos checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const changeHandler = (e) => this.handleCheckboxChange(e);
            checkbox.addEventListener('change', changeHandler);
            
            this.eventListeners.push({
                element: checkbox,
                event: 'change',
                handler: changeHandler
            });
        });

        // Botão confirmar
        const confirmBtn = document.getElementById('confirm');
        if (confirmBtn) {
            const clickHandler = () => this.savePreferences();
            confirmBtn.addEventListener('click', clickHandler);
            
            this.eventListeners.push({
                element: confirmBtn,
                event: 'click',
                handler: clickHandler
            });
        }

        // Botão cancelar
        const cancelBtn = document.getElementById('cancel');
        if (cancelBtn) {
            const clickHandler = () => this.cancelChanges();
            cancelBtn.addEventListener('click', clickHandler);
            
            this.eventListeners.push({
                element: cancelBtn,
                event: 'click',
                handler: clickHandler
            });
        }
    }

    /**
     * Configura os event listeners do cabeçalho
     */
    setupHeaderEventListeners() {
        // Event listeners para eventos customizados do cabeçalho
        document.addEventListener('taskmanager-header-notification-clicked', () => {
            this.handleNotificationIconClick();
        });

        document.addEventListener('taskmanager-header-theme-changed', (e) => {
            this.handleThemeChange(e.detail.isDarkMode);
        });

        document.addEventListener('taskmanager-header-settings-clicked', () => {
            this.handleSettingsClick();
        });

        document.addEventListener('taskmanager-header-profile-clicked', () => {
            this.handleProfileClick();
        });
    }

    /**
     * Manipula mudanças nos checkboxes
     * @param {Event} event - Evento de mudança
     */
    handleCheckboxChange(event) {
        const { id, checked } = event.target;
        
        // Atualizar preferências locais
        this.preferences[id] = checked;
        
        // Adicionar indicador visual de mudança
        const notificationItem = event.target.closest('.notification-item');
        if (notificationItem) {
            notificationItem.classList.add('changed');
            setTimeout(() => {
                notificationItem.classList.remove('changed');
            }, 500);
        }

        // Verificar se há mudanças não salvas
        this.updateButtonStates();

        console.log(`Preferência ${id} alterada para:`, checked);
    }

    /**
     * Salva as preferências de notificação
     */
    savePreferences() {
        const confirmBtn = document.getElementById('confirm');
        
        try {
            // Mostrar estado de loading
            if (confirmBtn) {
                confirmBtn.classList.add('loading');
                confirmBtn.disabled = true;
            }

            // Simular delay da API
            setTimeout(() => {
                // Salvar no localStorage
                const success = window.NotificationPreferences.save(this.preferences);
                
                if (success) {
                    // Atualizar estado original
                    this.originalPreferences = { ...this.preferences };
                    
                    // Mostrar feedback de sucesso
                    window.TaskManagerToast.success('Preferências de notificação salvas com sucesso!');
                    
                    // Emitir evento para outras páginas
                    this.emitPreferencesChanged();
                } else {
                    throw new Error('Falha ao salvar preferências');
                }

                // Remover estado de loading
                if (confirmBtn) {
                    confirmBtn.classList.remove('loading');
                    confirmBtn.disabled = false;
                }

                // Atualizar estados dos botões
                this.updateButtonStates();

            }, 1000); // Simular delay de 1 segundo

        } catch (error) {
            console.error('Erro ao salvar preferências:', error);
            window.TaskManagerToast.error('Erro ao salvar preferências. Tente novamente.');
            
            // Remover estado de loading
            if (confirmBtn) {
                confirmBtn.classList.remove('loading');
                confirmBtn.disabled = false;
            }
        }
    }

    /**
     * Cancela as alterações e restaura preferências originais
     */
    cancelChanges() {
        // Restaurar preferências originais
        this.preferences = { ...this.originalPreferences };
        
        // Aplicar ao DOM
        this.applyPreferencesToDOM();
        
        // Mostrar feedback
        window.TaskManagerToast.warning('Alterações canceladas. Preferências restauradas.');
        
        // Atualizar estados dos botões
        this.updateButtonStates();

        console.log('Alterações canceladas, preferências restauradas');
    }

    /**
     * Atualiza os estados dos botões baseado nas mudanças
     */
    updateButtonStates() {
        const hasChanges = this.hasUnsavedChanges();
        const confirmBtn = document.getElementById('confirm');
        const cancelBtn = document.getElementById('cancel');

        if (confirmBtn) {
            confirmBtn.disabled = !hasChanges;
        }

        if (cancelBtn) {
            cancelBtn.disabled = !hasChanges;
        }
    }

    /**
     * Verifica se há mudanças não salvas
     * @returns {boolean} - true se há mudanças não salvas
     */
    hasUnsavedChanges() {
        return JSON.stringify(this.preferences) !== JSON.stringify(this.originalPreferences);
    }

    /**
     * Aplica o tema atual
     */
    applyCurrentTheme() {
        const isDarkMode = window.ThemeSettings.isDarkMode();
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    /**
     * Manipula clique no ícone de notificações
     */
    handleNotificationIconClick() {
        // Destacar o título
        const title = document.querySelector('.header-title');
        if (title) {
            title.style.color = 'var(--primary-color)';
            title.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                title.style.color = '';
                title.style.transform = '';
            }, 1000);
        }

        window.TaskManagerToast.info('Você está na tela de configurações de notificação!');
    }

    /**
     * Manipula mudança de tema
     * @param {boolean} isDarkMode - true se modo escuro está ativo
     */
    handleThemeChange(isDarkMode) {
        // O tema já foi aplicado pelo componente de cabeçalho
        console.log('Tema alterado para:', isDarkMode ? 'escuro' : 'claro');
    }

    /**
     * Manipula clique no ícone de configurações
     */
    handleSettingsClick() {
        window.TaskManagerToast.info('Modal de configurações seria aberto aqui');
        console.log('Configurações clicadas - implementar modal');
    }

    /**
     * Manipula clique no ícone de perfil
     */
    handleProfileClick() {
        window.TaskManagerToast.info('Modal de perfil seria aberto aqui');
        console.log('Perfil clicado - implementar modal');
    }

    /**
     * Emite evento quando as preferências são alteradas
     */
    emitPreferencesChanged() {
        const event = new CustomEvent('taskmanager-notification-preferences-changed', {
            detail: {
                preferences: { ...this.preferences },
                timestamp: Date.now()
            },
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    /**
     * Obtém as preferências atuais
     * @returns {Object} - Objeto com as preferências
     */
    getPreferences() {
        return { ...this.preferences };
    }

    /**
     * Atualiza uma preferência específica
     * @param {string} key - Chave da preferência
     * @param {boolean} value - Novo valor
     */
    updatePreference(key, value) {
        this.preferences[key] = value;
        
        // Atualizar checkbox correspondente
        const checkbox = document.getElementById(key);
        if (checkbox) {
            checkbox.checked = value;
        }

        // Atualizar estados dos botões
        this.updateButtonStates();
    }

    /**
     * Reseta todas as preferências para os valores padrão
     */
    resetToDefaults() {
        if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
            window.NotificationPreferences.reset();
            this.loadNotificationPreferences();
            window.TaskManagerToast.success('Preferências restauradas para os valores padrão');
        }
    }

    /**
     * Destrói a página e limpa recursos
     */
    destroy() {
        // Remover event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];

        // Destruir componentes
        if (this.header) {
            this.header.destroy();
            this.header = null;
        }

        this.isInitialized = false;
        console.log('Página de notificações destruída');
    }
}

// Criar instância global da página
const notificationPage = new NotificationPage();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.NotificationPage = notificationPage;
}

// Inicializar automaticamente
notificationPage.init();
