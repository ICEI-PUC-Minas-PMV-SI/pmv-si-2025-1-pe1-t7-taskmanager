# Testes

## Plano de Testes de Software

**Caso de Teste** | **CT01 - Criar conta**
 :--------------: | ------------
**Procedimento**  | 1) Acesse a aplicação. <br> 2) Clique no campo "Cadastre-se". <br> 2) Preencha todos os campos do formulário. <br> 3) Clique no botão "Cadastre-se."
**Requisitos associados** | RF-002
**Resultado esperado** | Prosseguir para a tela de login.
**Dados de entrada** | Inserção de dados válidos no formulário de cadastro.
**Resultado obtido** | Sucesso.

**Caso de Teste** | **CT02 - Login na aplicação**
 :--------------: | ------------
**Procedimento**  | 1) Preencha dados cadastrados usuário e senha. <br> 2) Clique no botão "Entrar". <br> 
**Requisitos associados** | RF-006
**Resultado esperado** | Usuário logado com sucesso - validação das suas informações de login para acessar o conteúdo da página web.
**Dados de entrada** | Inserção de dados válidos no formulário de login.
**Resultado obtido** | Sucesso.

**Caso de Teste** | **CT03 - Página inicial com a agenda**
 :--------------: | ------------
**Procedimento**  | 1) Após login verificar se agenda e mini calendário está com a data correta. <br>
**Requisitos associados** | RF-003
**Resultado esperado** | Agenda carregar hora de 00:00 até 23:00 e dias da semana corretamente.
**Dados de entrada** | Null.
**Resultado obtido** | Sucesso.

**Caso de Teste** | **CT04 - Permitir ao usuário criar uma nova tarefa**
 :--------------: | ------------
**Procedimento**  | 1) Após o login, clicar no ícone superior a esquerda sinalizado por um símbolo de adição. <br> 2) Preencha todos os campos do formulário. <br> 3) Clique no botão "Confirmar" para salvar a tarefa. <br> 
**Requisitos associados** | RF-001
**Resultado esperado** | Nova tarefa adicionada e representada na agenda principal na data e hora especificada pelo usuário.  
**Dados de entrada** | Inserção de dados válidos no formulário de criação de nova tarefa.
**Resultado obtido** | Sucesso.

**Caso de Teste** | **CT05 - Permite o usuário alterar a senha**
 :--------------: | ------------
**Procedimento**  | 1) Clicar no ícone de engrenagem na página inicial no menu superior à direita. <br> 2) Preencha todos os campos do formulário. <br> 3) Clique no botão "Alterar Senha" para salvar a nova senha. <br> 
**Requisitos associados** | RF-004
**Resultado esperado** | Senha alterada no localStorage.  
**Dados de entrada** | Inserção de dados válidos no formulário de alteração de senha.
**Resultado obtido** | Sucesso.

**Caso de Teste** | **CT06 - Permite o usuário filtrar as categorias**
 :--------------: | ------------
**Procedimento**  | 1) Na página inicial da agenda no menu suspenso inferior a esquerda marcar quais as categorias de exibição. <br>
**Requisitos associados** | RF-005
**Resultado esperado** | Ao filtrar por categoria somente mostrar as tarefas da mesma.
**Dados de entrada** | Null.
**Resultado obtido** | Sucesso.

**Caso de Teste** | **CT07 - Permitir configuração de perfil**
 :--------------: | ------------
**Procedimento**  | 1) Na página inicial da agenda no menu superior à direita clicar no ícone de perfil simbolizado por um avatar genérico. <br> 2) Preencha todos os campos do formulário. <br> 3) Carregue uma foto de perfil do seu dispositivo. <br> 4) Clique no botão "Confirmar" para salvar. <br>
**Requisitos associados** | RF-007
**Resultado esperado** | Ao preencher os dados inseridos no formulário salvar as alterações e se caso inserir a foto ela irá aparecer no lugar do ícone de avatar genérico.
**Dados de entrada** | Inserção de dados válidos no formulário e imagem de perfil.
**Resultado obtido** | Sucesso.


## Registro dos Testes de Software


|*Caso de Teste*                                 |*CT01 - Criar conta*                                            |
|---|---|
|Requisito Associado | RF-002 - A aplicação permite que o usuário realize seu cadastro.	                         |
|Link do vídeo do teste realizado: | https://www.loom.com/share/f41270501dd54518bd0f74646d026bad?sid=6806ad7b-54fe-4f3c-a8e4-6dbf0b68a72c| 

|*Caso de Teste*                                 |*CT02 - Login na aplicação*                                        |
|---|---|
|Requisito Associado | RF-006 - Permite o usuário inserir suas informações de login para acessar o conteúdo da página web.|
|Link do vídeo do teste realizado: | https://www.loom.com/share/a1623b48c8de4097bcf84ad66815a223?sid=75c28c64-479e-4401-bd7a-f6d2000ba4dc | 

|*Caso de Teste*                                 |*CT03 - Permitir o usuário criar uma nova tarefa*                                      |
|---|---|
|Requisito Associado | RF-001 - Permite o usuário criar uma nova tarefa.	|
|Link do vídeo do teste realizado: | https://www.loom.com/share/b75623933c0746a5a97d59d2fecf9716?sid=653edadb-2f0d-4abc-808f-e75cab5627d6, https://www.loom.com/share/58b49ec8b9d546c19b763bf51e5f907a?sid=1f056820-8bb7-43ca-a200-54b63e12e997 | 

|*Caso de Teste*                                 |*CT04 -  Permite o usuário alterar a senha*                                        |
|---|---|
|Requisito Associado | RF-004 - Permite o usuário alterar a senha.	|
|Link do vídeo do teste realizado: | https://www.loom.com/share/f4353ae1999d4d29b66884902a176c5a?sid=16c99474-3152-4303-9b20-d7b57fe3091f | 

|*Caso de Teste*                                 |*CT05 -  Permite o usuário filtrar as categorias*                                        |
|---|---|
|Requisito Associado | RF-004 - Permite o usuário filtrar as categorias. |
|Link do vídeo do teste realizado: | https://www.loom.com/share/621b53cf3b754177b0195d3f5b9ad8ed?sid=52dd4c18-c066-4227-af77-94f5d961cb9c | 

|*Caso de Teste*                                 |*CT06 -  Permitir configuração de perfil*                                        |
|---|---|
|Requisito Associado | RF-004 - Permitir configuração de perfil. |
|Link do vídeo do teste realizado: | https://www.loom.com/share/dca280d703c84f25b9937fbab063a650?sid=a03b4441-631c-4704-824b-3a3f7c391eb9 | 


## Avaliação dos Testes de Software

# ✅ Análise dos Resultados de Teste – Task Manager

## 🟢 Pontos Fortes
Criação de Tarefas
Interface clara e funcional, permitindo fácil inclusão de compromissos.

Edição de Perfil
Permite personalização e torna a experiência mais individualizada.

Modo Noturno
Visual confortável e acessível para diferentes ambientes.

Resumo do Dia
Visão rápida das atividades programadas, facilitando o planejamento diário.

Redefinir Agenda
Útil para testes e reinício rápido da aplicação.

## 🔴 Pontos Fracos Detectados
Edição de Tarefas
Alterações não salvas corretamente ou dados não carregados.

Botão Cancelar
Ao cancelar nova tarefa, não retorna corretamente à tela anterior.

Navegação
Falta de botão para voltar à tela inicial compromete a usabilidade.

## 🛠️ Plano de Melhoria – Próximas Iterações
Corrigir fluxo de edição de tarefas com validação de dados.

Revisar ação do botão "Cancelar" e inserir confirmação visual.

Adicionar botão de navegação "Início" na interface principal.

Aplicar testes automatizados em funções críticas.

## ❗ Falhas x Melhorias
Falha Detectada	Solução Proposta
Edição falha ao carregar dados	Validar e carregar corretamente no editor.
Cancelar não retorna corretamente	implementar redirecionamento seguro.
Falta botão de retorno	inserir botão fixo de "Início" na UI.

## 📌 Conclusão
A aplicação já oferecia funcionalidades robustas e úteis, mas pequenas falhas de fluxo impactam a experiência. As melhorias foram priorizadas, focando em usabilidade, navegação intuitiva e confiabilidade.


# Testes de Usabilidade

## 🎯 Objetivo Geral
O objetivo do Plano de Testes de Usabilidade foi coletar dados sobre a experiência dos usuários com a aplicação, observando sua expectativa em relação à funcionalidade, facilidade de uso e eficiência nas tarefas. Foram analisados três indicadores principais: taxa de sucesso, satisfação subjetiva e tempo de execução, conforme comparado a um usuário especialista (desenvolvedor).

## 👥 Perfil dos Participantes
Quatro participantes foram convidados com base nas histórias de usuário definidas na etapa de especificação do projeto. Todos os participantes tinham perfis distintos que refletiam diferentes tipos de uso da agenda digital:

Usuário 1: Estudante universitário que utiliza a agenda para organizar compromissos acadêmicos.

Usuário 2: Profissional autônomo que utiliza o sistema para controle de reuniões e tarefas pessoais.

Usuário 3: Usuário iniciante em tecnologia, com necessidade de uma interface acessível.

Usuário 4: Usuário experiente em ferramentas digitais de produtividade.

Por motivos de conformidade com a Lei Geral de Proteção de Dados (LGPD), nenhum dado pessoal foi coletado e não foi aplicado Termo de Consentimento Livre e Esclarecido.

## 🧪 Cenários de Teste Utilizados

**Cenário 1 – Criar Nova Tarefa** <br>
Objetivo: Verificar se o usuário consegue adicionar uma nova tarefa ao calendário com data e horário definidos.

Funcionalidades Avaliadas: Tela de criação de tarefa, seleção de data e hora, salvamento.

Indicadores Avaliados: Taxa de sucesso, satisfação com o formulário, tempo em segundos.

**Cenário 2 – Editar uma Tarefa Existente** <br>
Objetivo: Avaliar a clareza e usabilidade do processo de edição de tarefas já cadastradas.

Funcionalidades Avaliadas: Listagem de tarefas, carregamento dos dados na tela de edição, salvamento das alterações.

Observação: Este foi um ponto fraco identificado nos testes anteriores, por isso incluído como foco específico.

**Cenário 3 – Utilizar o Modo Noturno** <br>
Objetivo: Validar a eficácia e conforto visual do modo noturno para diferentes perfis de usuários.

Funcionalidades Avaliadas: Alternância entre modo claro e escuro, adaptação visual dos elementos da interface.

Indicadores Avaliados: Satisfação subjetiva e feedback visual.

**Cenário 4 – Visualizar o Resumo Diário** <br>
Objetivo: Testar a clareza e funcionalidade do painel de resumo de tarefas do dia.

Funcionalidades Avaliadas: Interface do resumo diário, clareza das informações exibidas, utilidade percebida.


## Cenários de Teste de Usabilidade – Task Manager

| Nº do Cenário | Descrição do Cenário |
|---------------|----------------------|
| 1             | Você é uma pessoa que deseja organizar seus compromissos do dia. Crie uma nova tarefa para hoje às 15h informando o título e a descrição da atividade. |
| 2             | Você precisa alterar o horário de uma tarefa já cadastrada, pois o compromisso foi reagendado. Acesse a tarefa existente e edite o horário para 17h. |
| 3             | Está tarde da noite e a tela clara está incomodando seus olhos. Ative o modo noturno da aplicação para melhorar o conforto visual. |
| 4             | Você deseja ver rapidamente tudo que está agendado para hoje. Acesse o resumo do dia e visualize as atividades listadas. |
| 5             | Você mudou de endereço de e-mail. Acesse a área de perfil e atualize suas informações pessoais. |
| 6             | Deseja apagar toda sua agenda para começar do zero. Use a função de redefinir agenda e confirme a ação. |
| 7             | Você se perdeu na navegação após abrir várias telas. Utilize um botão de "voltar à página inicial" para retornar ao início da aplicação. |



## Registro de Testes de Usabilidade

# 📋 Registro de Testes de Usabilidade – Task Manager

## 🧪 Cenário 1: Criar nova tarefa

**Descrição:**  
Você é uma pessoa que deseja organizar seus compromissos do dia. Crie uma nova tarefa para hoje às 15h informando o título e a descrição da atividade.

| Usuário | Taxa de Sucesso | Satisfação Subjetiva | Tempo para Conclusão do Cenário |
|---------|------------------|-----------------------|----------------------------------|
| 1       | SIM              | 5                     | 24.12 segundos                   |
| 2       | SIM              | 4                     | 19.88 segundos                   |
| 3       | SIM              | 5                     | 28.75 segundos                   |
| **Média**  | **100%**         | **4.67**                | **24.25 segundos**                |
| **Tempo para conclusão pelo especialista** | SIM | 5 | 10.43 segundos |

**Comentários dos usuários:**  
- A criação de tarefas foi simples e rápida.  
- Seria interessante destacar melhor os campos obrigatórios.  
- Achei muito intuitivo, não tive dificuldades.

---

## 🧪 Cenário 2: Ativar modo noturno

**Descrição:**  
Está tarde da noite e a tela clara está incomodando seus olhos. Ative o modo noturno da aplicação para melhorar o conforto visual.

| Usuário | Taxa de Sucesso | Satisfação Subjetiva | Tempo para Conclusão do Cenário |
|---------|------------------|-----------------------|----------------------------------|
| 1       | SIM              | 5                     | 11.56 segundos                   |
| 2       | SIM              | 4                     | 14.22 segundos                   |
| 3       | SIM              | 5                     | 10.08 segundos                   |
| **Média**  | **100%**         | **4.67**                | **11.95 segundos**                |
| **Tempo para conclusão pelo especialista** | SIM | 5 | 5.32 segundos |

**Comentários dos usuários:**  
- Gostei muito do modo noturno, funcionou bem.  
- A alternância foi rápida e sem travamentos. 

---

## Avaliação dos Testes de Usabilidade

Com base nos resultados obtidos durante os testes de usabilidade, foi possível verificar que a aplicação apresenta um desempenho sólido no que diz respeito à taxa de sucesso dos usuários. Todos os participantes conseguiram concluir as tarefas propostas nos cenários testados, o que demonstra uma boa capacidade da interface em guiar o usuário nas ações desejadas.

Além disso, a satisfação subjetiva relatada pelos usuários também foi alta, com notas variando entre 4 (bom) e 5 (ótimo), o que reforça que a experiência de uso está dentro das expectativas e não gerou frustrações significativas.

Quanto ao tempo para conclusão das tarefas, observou-se que, embora todos tenham conseguido realizá-las, houve uma diferença esperada entre o tempo médio dos usuários e o do especialista (desenvolvedor). Essa discrepância é natural, considerando o maior conhecimento do desenvolvedor sobre a estrutura da aplicação, localização de botões e funcionalidades.

No entanto, mesmo com o bom desempenho geral, os comentários dos usuários revelaram pontos de melhoria. Em especial, destacam-se:
- **Melhor sinalização dos campos obrigatórios** durante a criação de tarefas;
- **Possibilidade de facilitar a navegação** com mais botões de retorno à página inicial.

Diante disso, a equipe planeja implementar ajustes na interface, como o realce visual de campos importantes, melhorias na navegação e maior acessibilidade aos recursos, para otimizar ainda mais a experiência do usuário nas próximas iterações do projeto.

