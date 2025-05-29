// Arquivo principal para gerenciar as funcionalidades da aplicação
// Organizado em módulos para melhor manutenção

// Configuração da API
const API_URL = 'http://localhost:3000';

// Módulo para gerenciar requisições à API
const apiService = {
  // Método genérico para fazer requisições GET
  async get(endpoint) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  },

  // Método genérico para fazer requisições POST
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      throw error;
    }
  },

  // Método genérico para fazer requisições PUT
  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      throw error;
    }
  },

  // Método genérico para fazer requisições DELETE
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao excluir dados:', error);
      throw error;
    }
  }
};

// Módulo para gerenciar notificações
const notificationService = {
  // Buscar todas as notificações do usuário
  async getNotifications(userId) {
    return await apiService.get(`notifications?userId=${userId}`);
  },

  // Marcar notificação como lida
  async markAsRead(notificationId) {
    const notification = await apiService.get(`notifications/${notificationId}`);
    notification.read = true;
    return await apiService.put(`notifications/${notificationId}`, notification);
  },

  // Atualizar preferências de notificação
  async updatePreferences(categoryId, enabled) {
    const category = await apiService.get(`categories/${categoryId}`);
    category.enabled = enabled;
    return await apiService.put(`categories/${categoryId}`, category);
  },

  // Atualizar preferências de prioridade
  async updatePriorityPreferences(priorityId, enabled) {
    const priority = await apiService.get(`priorities/${priorityId}`);
    priority.enabled = enabled;
    return await apiService.put(`priorities/${priorityId}`, priority);
  }
};

// Módulo para gerenciar configurações do usuário
const settingsService = {
  // Buscar configurações do usuário
  async getSettings(userId) {
    const settings = await apiService.get(`settings?userId=${userId}`);
    return settings[0]; // Assumindo que há apenas um registro de configurações por usuário
  },

  // Atualizar configurações do usuário
  async updateSettings(settings) {
    return await apiService.put(`settings/${settings.id}`, settings);
  },

  // Alterar senha do usuário
  async changePassword(userId, newPassword) {
    const user = await apiService.get(`users/${userId}`);
    user.password = newPassword;
    return await apiService.put(`users/${userId}`, user);
  },

  // Alterar idioma do usuário
  async changeLanguage(userId, language) {
    const settings = await this.getSettings(userId);
    settings.language = language;
    return await this.updateSettings(settings);
  },

  // Redefinir agenda (limpar todas as tarefas)
  async resetSchedule(userId) {
    const tasks = await apiService.get(`tasks?userId=${userId}`);
    for (const task of tasks) {
      await apiService.delete(`tasks/${task.id}`);
    }
    return { success: true, message: 'Agenda redefinida com sucesso' };
  },

  // Alternar modo escuro
  async toggleDarkMode(userId) {
    const settings = await this.getSettings(userId);
    settings.darkMode = !settings.darkMode;
    return await this.updateSettings(settings);
  }
};

// Módulo para gerenciar perfil do usuário
const profileService = {
  // Buscar perfil do usuário
  async getProfile(userId) {
    return await apiService.get(`users/${userId}`);
  },

  // Atualizar perfil do usuário
  async updateProfile(user) {
    return await apiService.put(`users/${user.id}`, user);
  },

  // Fazer upload de avatar (simulado)
  async uploadAvatar(userId, avatarFile) {
    // Em um ambiente real, isso enviaria o arquivo para um servidor
    // Aqui apenas simulamos atualizando o nome do arquivo
    const user = await this.getProfile(userId);
    user.avatar = avatarFile.name;
    return await this.updateProfile(user);
  }
};

// Módulo para gerenciar tarefas
const taskService = {
  // Buscar todas as tarefas
  async getTasks() {
    return await apiService.get('tasks');
  },

  // Buscar tarefa por ID
  async getTask(taskId) {
    return await apiService.get(`tasks/${taskId}`);
  },

  // Criar nova tarefa
  async createTask(task) {
    task.createdAt = new Date().toISOString();
    task.completed = false;
    return await apiService.post('tasks', task);
  },

  // Atualizar tarefa existente
  async updateTask(task) {
    return await apiService.put(`tasks/${task.id}`, task);
  },

  // Excluir tarefa
  async deleteTask(taskId) {
    return await apiService.delete(`tasks/${taskId}`);
  },

  // Marcar tarefa como concluída
  async completeTask(taskId) {
    const task = await this.getTask(taskId);
    task.completed = true;
    return await this.updateTask(task);
  }
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', async () => {
  // Carregar configurações do usuário
  const userId = 1; // Usuário padrão para demonstração
  try {
    // Carregar configurações
    const settings = await settingsService.getSettings(userId);
    
    // Aplicar modo escuro se estiver ativado
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    }
    
    // Carregar categorias e prioridades para a tela de notificações
    await loadNotificationPreferences();
    
    // Configurar listeners para os botões
    setupEventListeners(userId);
    
  } catch (error) {
    console.error('Erro ao inicializar aplicação:', error);
  }
});

// Carregar preferências de notificação
async function loadNotificationPreferences() {
  try {
    // Buscar categorias
    const categories = await apiService.get('categories');
    const categoriesContainer = document.querySelector('.notification-rows-container');
    
    if (categoriesContainer) {
      // Limpar conteúdo existente
      categoriesContainer.innerHTML = '';
      
      // Buscar prioridades
      const priorities = await apiService.get('priorities');
      
      // Criar linhas para cada categoria e prioridade correspondente
      categories.forEach((category, index) => {
        const priority = index < priorities.length ? priorities[index] : null;
        
        const row = document.createElement('div');
        row.className = 'notification-row';
        
        // Adicionar item de categoria
        const categoryItem = document.createElement('div');
        categoryItem.className = 'notification-item';
        categoryItem.innerHTML = `
          <label for="cat${category.id}">${category.name}</label>
          <input type="checkbox" id="cat${category.id}" name="cat${category.id}" ${category.enabled ? 'checked' : ''}>
        `;
        
        // Adicionar listener para o checkbox da categoria
        const categoryCheckbox = categoryItem.querySelector(`#cat${category.id}`);
        categoryCheckbox.addEventListener('change', async (e) => {
          try {
            await notificationService.updatePreferences(category.id, e.target.checked);
          } catch (error) {
            console.error('Erro ao atualizar preferência de categoria:', error);
            // Reverter estado do checkbox em caso de erro
            e.target.checked = !e.target.checked;
          }
        });
        
        row.appendChild(categoryItem);
        
        // Adicionar item de prioridade se existir
        if (priority) {
          const priorityItem = document.createElement('div');
          priorityItem.className = 'notification-item';
          priorityItem.innerHTML = `
            <label for="prio${priority.id}">${priority.name}</label>
            <input type="checkbox" id="prio${priority.id}" name="prio${priority.id}" ${priority.enabled ? 'checked' : ''}>
          `;
          
          // Adicionar listener para o checkbox da prioridade
          const priorityCheckbox = priorityItem.querySelector(`#prio${priority.id}`);
          priorityCheckbox.addEventListener('change', async (e) => {
            try {
              await notificationService.updatePriorityPreferences(priority.id, e.target.checked);
            } catch (error) {
              console.error('Erro ao atualizar preferência de prioridade:', error);
              // Reverter estado do checkbox em caso de erro
              e.target.checked = !e.target.checked;
            }
          });
          
          row.appendChild(priorityItem);
        } else {
          // Adicionar espaço vazio para manter o layout
          const emptyItem = document.createElement('div');
          emptyItem.className = 'notification-item';
          row.appendChild(emptyItem);
        }
        
        categoriesContainer.appendChild(row);
      });
    }
  } catch (error) {
    console.error('Erro ao carregar preferências de notificação:', error);
  }
}

// Configurar listeners para os elementos da interface
function setupEventListeners(userId) {
  // Toggle do modo escuro
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', async () => {
      try {
        await settingsService.toggleDarkMode(userId);
        document.body.classList.toggle('dark-mode');
      } catch (error) {
        console.error('Erro ao alternar modo escuro:', error);
      }
    });
  }
  
  // Botões de confirmar e cancelar
  const confirmButton = document.getElementById('confirm');
  if (confirmButton) {
    confirmButton.addEventListener('click', () => {
      alert('Preferências salvas com sucesso!');
    });
  }
  
  const cancelButton = document.getElementById('cancel');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      // Recarregar preferências originais
      loadNotificationPreferences();
    });
  }
}

function mostrarNotificacao(mensagem, tipo = 'info') {
  const notificacao = document.createElement('div');
  notificacao.className = `notificacao ${tipo}`;
  notificacao.innerHTML = `
    <span class="notificacao-mensagem">${mensagem}</span>
    <button class="notificacao-fechar">×</button>
  `;
  document.body.appendChild(notificacao);
  
  // Animar entrada
  setTimeout(() => {
    notificacao.classList.add('visivel');
  }, 10);
  
  // Auto-fechar após 5 segundos
  setTimeout(() => {
    notificacao.classList.remove('visivel');
    setTimeout(() => notificacao.remove(), 300);
  }, 5000);
  
  // Botão fechar
  notificacao.querySelector('.notificacao-fechar').addEventListener('click', () => {
    notificacao.classList.remove('visivel');
    setTimeout(() => notificacao.remove(), 300);
  });
}

// Exemplo de uso quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  mostrarNotificacao('Bem-vindo ao Organizador de Tarefas!', 'sucesso');
  
  // Simular notificações pendentes
  setTimeout(() => {
    mostrarNotificacao('Você tem 3 tarefas pendentes para hoje', 'alerta');
  }, 2000);
});

// Exportar serviços para uso em outros arquivos
window.apiService = apiService;
window.notificationService = notificationService;
window.settingsService = settingsService;
window.profileService = profileService;
window.taskService = taskService;
