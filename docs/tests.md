# Testes

## Plano de Testes de Software

**Caso de Teste** | **CT01 - Criar conta**
 :--------------: | ------------
**Procedimento**  | 1) Acesse a aplicação <br> 2) Clique no campo "Cadastre-se" <br> 2) Preencha todos os campos do formulário <br> 3) Clique no botão "Cadastre-se".
**Requisitos associados** | RF-002
**Resultado esperado** | Prosseguir para a tela de login
**Dados de entrada** | Inserção de dados válidos no formulário de cadastro
**Resultado obtido** | Sucesso

**Caso de Teste** | **CT02 - Login na aplicação**
 :--------------: | ------------
**Procedimento**  | 1) Preencha dados cadastrados usuário e senha <br> 2) Clique no botão "Entrar" <br> 
**Requisitos associados** | RF-006
**Resultado esperado** | Usuário logado com sucesso - validção das suas informações de login para acessar o conteúdo da página web
**Dados de entrada** | Inserção de dados válidos no formulário de login
**Resultado obtido** | Sucesso

**Caso de Teste** | **CT03 - Página inicial com a agenda**
 :--------------: | ------------
**Procedimento**  | 1) após login verificar se agenda e mini calendario está com data correta <br>
**Requisitos associados** | RF-003
**Resultado esperado** | Agenda carregar hora de 00:00 até 23:00 e dias da semana corretamente
**Dados de entrada** | null
**Resultado obtido** | Sucesso

**Caso de Teste** | **CT04 - Permitir ao usuário criar uma nova tarefa**
 :--------------: | ------------
**Procedimento**  | 1) após login clicar no icone superior a esquerda simbolizando <br> 2) Preencha todos os campos do formulário <br> 3) Clique no botão "Confirmar" para salvar a tarefa <br> 
**Requisitos associados** | RF-001
**Resultado esperado** | Nova tarefa adicionada e representada na agenda principal na data e hora especificada pelo usuário.  
**Dados de entrada** | Inserção de dados válidos no formulário de criação de nova tarefa
**Resultado obtido** | Sucesso

**Caso de Teste** | **CT04 - Permitir ao usuário criar uma nova tarefa**
 :--------------: | ------------
**Procedimento**  | 1) após login clicar no icone superior a esquerda simbolizando <br> 2) Preencha todos os campos do formulário <br> 3) Clique no botão "Confirmar" para salvar a tarefa <br> 
**Requisitos associados** | RF-001
**Resultado esperado** | Nova tarefa adicionada e representada na agenda principal na data e hora especificada pelo usuário.  
**Dados de entrada** | Inserção de dados válidos no formulário de criação de nova tarefa
**Resultado obtido** | Sucesso

**Caso de Teste** | **CT05 - Permite o usuário alterar a senha**
 :--------------: | ------------
**Procedimento**  | 1) Clicar no ícone de engrenagem na página inicial no menu superior à direita. <br> 2) Preencha todos os campos do formulário. <br> 3) Clique no botão "Alterar Senha" para salvar a nova senha. <br> 
**Requisitos associados** | RF-004
**Resultado esperado** | Senha alterada no localStorage  
**Dados de entrada** | Inserção de dados válidos no formulário de alteração de senha
**Resultado obtido** | Sucesso

**Caso de Teste** | **CT05 - Permite o usuário filtrar as categorias**
 :--------------: | ------------
**Procedimento**  | 1) Na página inicial da agenda no menu suspenso inferior a esquerda marcar quais categorias de exibição. <br>
**Requisitos associados** | RF-005
**Resultado esperado** | Ao filtrar por categoria somente mostrar as tarefas da mesma.
**Dados de entrada** | null
**Resultado obtido** | Sucesso

**Caso de Teste** | **CT06 - Permitir configuração de perfil**
 :--------------: | ------------
**Procedimento**  | 1) Na página inicial da agenda no menu superior a direita clicar no ícone de perfil simbolizado por um avatar genérico. <br> 2) Preencha todos os campos do formulário. <br> 3) Carregue uma foto de perfil do seu dispositivo. <br> 4) Clique no botão "Confirmar" para salvar. <br>
**Requisitos associados** | RF-007
**Resultado esperado** | Ao preencher os dados inseridos no formulário salvar as alterações e se caso inserir a foto ela aparecer no lugar do icone de avatar genérico.
**Dados de entrada** | Inserção de dados válidos no formulário e imagem de perfil.
**Resultado obtido** | Sucesso


## Registro dos Testes de Software

Esta seção deve apresentar o relatório com as evidências dos testes de software realizados no sistema pela equipe, baseado no plano de testes pré-definido. Documente cada caso de teste apresentando um vídeo ou animação que comprove o funcionamento da funcionalidade. Veja os exemplos a seguir.

|*Caso de Teste*                                 |*CT01 - Criar conta parte 1*                                         |
|---|---|
|Requisito Associado | RF-001 - A aplicação deve permitir que os usuários criem uma conta e gerenciem seu cadastro|
|Link do vídeo do teste realizado: | https://1drv.ms/u/s!AhD2JqpOUvJChapRtRSQ9vPzbNLwGA?e=mxZs6t| 

|*Caso de Teste*                                 |*CT02 - Criar conta parte 2*                                        |
|---|---|
|Requisito Associado | RF-001 - A aplicação deve permitir que os usuários criem uma conta e gerenciem seu cadastro|
|Link do vídeo do teste realizado: | https://1drv.ms/v/s!AhD2JqpOUvJChapQ8CPXL-TI_A7iVg?e=spD3Ar | 


## Avaliação dos Testes de Software

Discorra sobre os resultados do teste. Ressaltando pontos fortes e fracos identificados na solução. Comente como o grupo pretende atacar esses pontos nas próximas iterações. Apresente as falhas detectadas e as melhorias geradas a partir dos resultados obtidos nos testes.

## Testes de unidade automatizados (Opcional)

Se o grupo tiver interesse em se aprofundar no desenvolvimento de testes de software, ele podera desenvolver testes automatizados de software que verificam o funcionamento das funções JavaScript desenvolvidas. Para conhecer sobre testes unitários em JavaScript, leia 0 documento  [Ferramentas de Teste para Java Script](https://geekflare.com/javascript-unit-testing/).

# Testes de Usabilidade

O objetivo do Plano de Testes de Usabilidade é obter informações quanto à expectativa dos usuários em relação à  funcionalidade da aplicação de forma geral.

Para tanto, elaboramos quatro cenários, cada um baseado na definição apresentada sobre as histórias dos usuários, definido na etapa das especificações do projeto.

Foram convidadas quatro pessoas que os perfis se encaixassem nas definições das histórias apresentadas na documentação, visando averiguar os seguintes indicadores:

Taxa de sucesso: responde se o usuário conseguiu ou não executar a tarefa proposta;

Satisfação subjetiva: responde como o usuário avalia o sistema com relação à execução da tarefa proposta, conforme a seguinte escala:

1. Péssimo; 
2. Ruim; 
3. Regular; 
4. Bom; 
5. Ótimo.

Tempo para conclusão da tarefa: em segundos, e em comparação com o tempo utilizado quando um especialista (um desenvolvedor) realiza a mesma tarefa.

Objetivando respeitar as diretrizes da Lei Geral de Proteção de Dados, as informações pessoais dos usuários que participaram do teste não foram coletadas, tendo em vista a ausência de Termo de Consentimento Livre e Esclarecido.

Apresente os cenários de testes utilizados na realização dos testes de usabilidade da sua aplicação. Escolha cenários de testes que demonstrem as principais histórias de usuário sendo realizadas. Neste tópico o grupo deve detalhar quais funcionalidades avaliadas, o grupo de usuários que foi escolhido para participar do teste e as ferramentas utilizadas.

> - [UX Tools](https://uxdesign.cc/ux-user-research-and-user-testing-tools-2d339d379dc7)


## Cenários de Teste de Usabilidade

| Nº do Cenário | Descrição do cenário |
|---------------|----------------------|
| 1             | Você é uma pessoa que deseja comprar um iphone. Encontre no site um iphone e veja detalhes de localização e contato da loja que anunciando. |
| 2             | Você é uma pessoa que deseja comprar um smartphone até R$ 2.000,00. Encontre no site smartphone's nessa faixa de preço. |



## Registro de Testes de Usabilidade

Cenário 1: Você é uma pessoa que deseja comprar um iphone. Encontre no site um iphone e veja detalhes de localização e contato da loja que anunciando.

| Usuário | Taxa de sucesso | Satisfação subjetiva | Tempo para conclusão do cenário |
|---------|-----------------|----------------------|---------------------------------|
| 1       | SIM             | 5                    | 27.87 segundos                  |
| 2       | SIM             | 5                    | 17.11 segundos                  |
| 3       | SIM             | 5                    | 39.09 segundos                  |
|  |  |  |  |
| **Média**     | 100%           | 5                | 28.02 segundos                           |
| **Tempo para conclusão pelo especialista** | SIM | 5 | 8.66 segundos |


    Comentários dos usuários: Achei o site muito bom e intuitivo. 
    Não tive dificuldades e acho que ficou bem intuitivo.


Cenário 2: Você é uma pessoa que deseja comprar um smartphone até R$ 2.000,00. Encontre no site smartphone's nessa faixa de preço.

| Usuário | Taxa de sucesso | Satisfação subjetiva | Tempo para conclusão do cenário |
|---------|-----------------|----------------------|---------------------------------|
| 1       | SIM             | 5                    | 22.54 segundos                          |
| 2       | SIM             | 5                    | 31.42 segundos                          |
| 3       | SIM             | 4                    | 36.21 segundos                          |
|  |  |  |  |
| **Média**     | 100%           | 4.67                | 30.05 segundos                           |
| **Tempo para conclusão pelo especialista** | SIM | 5 | 13.57 segundos |


    Comentários dos usuários: O site é fácil de acessar, mas algumas páginas poderiam 
    redirecionar a gente automaticamente para outras. Senti a falta de mais opções de filtros, 
    tanto na hora da pesquisa, quanto depois dela, nos resultados.

## Avaliação dos Testes de Usabilidade

Tomando como base os resultados obtidos, foi possível verificar que a aplicação web apresenta bons resultados quanto à taxa de sucesso na interação dos usuários, tendo em vista que os cenários propostos foram concluídos com sucesso.

Além disso, a aplicação obteve também uma elevada satisfação subjetiva dos usuários no momento que realizavam os cenários propostos. Prova são as médias das avaliações em cada um dos cenários, que variou entre 4 (bom) e 5 (ótimo).

Com relação ao tempo para conclusão de cada tarefa/cenário, notamos discrepância entre a média de tempo dos usuários e o tempo do especialista/desenvolvedor em todos os cenários. Tal discrepância, em certa medida, é esperada, tendo em vista que o desenvolvedor já tem prévio conhecimento de toda a interface da aplicação, do posicionamento dos elementos, lógica de organização das páginas, etc.

Contudo, tendo em vista que a diferença foi relevante (por exemplo, 113 segundos — média usuários — contra 25 segundos — especialista — no cenário três), e ainda os comentários feitos por alguns usuários, entendemos haver oportunidades de melhoria na usabilidade da aplicação.



