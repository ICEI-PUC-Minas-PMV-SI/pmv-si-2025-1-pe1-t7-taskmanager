# Especificações do Projeto

Buscando oferecer um produto voltado à gestão e organização do tempo e de tarefas, descreveremos a seguir os perfis do público-alvo e os requisitos e restrições do projeto. 
Para isso, tomando como referência o guia do projeto e o conteúdo dos microfundamentos, a construção das personas abaixo foi inspirada nos perfis pessoais dos integrantes do grupo e das pessoas que compõem seu círculo social e que utilizam ferramentas para organização do cotidiano, suas dores e comentários pessoais. Para definição dos requisitos e restrições, projetos em CSS, JavaScritpt e HTML foram consultados como inspiração técnica, além de considerar a experiência profissional de alguns membros do grupo em desenvolvimento de software.


## Personas

Persona 1: O Profissional Corporativo
Ricardo Almeida, de 35 anos, é gerente de projetos em uma empresa de tecnologia e enfrenta desafios que incluem dificuldade em priorizar tarefas, excesso de reuniões e falta de tempo para planejamento. Ele busca aumentar sua produtividade, cumprindo prazos frequentemente apertados e alcançar um equilíbrio saudável entre vida pessoal e profissional. 

Persona 2: A Estudante Universitária
Juliana Costa, uma estudante de Engenharia de 22 anos, busca equilibrar estudos, estágio e vida social sem se sentir sobrecarregada. No entanto, ela enfrenta desafios significativos, como a dificuldade em organizar suas tarefas acadêmicas, cumprir os prazos de entrega e gerenciar as atividades extracurriculares. Sua rotina exige planejamento cuidadoso para alcançar seus objetivos e manter o bem-estar enquanto navega pelas demandas da vida universitária. 

Persona 3: O Empreendedor
Carlos Mendes, um empreendedor de 40 anos e dono de uma startup de delivery, enfrenta o desafio de lidar com múltiplas responsabilidades em sua rotina. Ele busca organizar melhor suas tarefas diárias, mas encontra dificuldades devido à falta de organização pessoal que compromete a delegação de funções para outras pessoas. Como líder da empresa, Carlos precisa encontrar formas eficientes de gerir seu tempo e equilibrar suas demandas para alcançar seus objetivos com mais facilidade.

Persona 4: A Mãe que Trabalha em Casa 
Ana Paula Rocha, uma designer freelancer de 30 anos, enfrenta o desafio de equilibrar sua rotina entre trabalho, cuidados com os filhos e momentos dedicados a si mesma. A ausência de uma rotina bem definida torna ainda mais difícil separar as demandas da vida pessoal e profissional. Apesar dessas dificuldades, Ana Paula busca maneiras de organizar melhor seu tempo e alcançar um equilíbrio saudável em sua vida.


## Histórias de Usuários

Com base na análise das personas forma identificadas as seguintes histórias de usuários:

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
|Usuário do sistema  | Registrar minhas tarefas           | Não esquecer de fazê-las               |
|Administrador       | Alterar permissões                 | Permitir que possam administrar contas |

Apresente aqui as histórias de usuário que são relevantes para o projeto de sua solução. As Histórias de Usuário consistem em uma ferramenta poderosa para a compreensão e elicitação dos requisitos funcionais e não funcionais da sua aplicação. Se possível, agrupe as histórias de usuário por contexto, para facilitar consultas recorrentes à essa parte do documento.

> **Links Úteis**:
> - [Histórias de usuários com exemplos e template](https://www.atlassian.com/br/agile/project-management/user-stories)
> - [Como escrever boas histórias de usuário (User Stories)](https://medium.com/vertice/como-escrever-boas-users-stories-hist%C3%B3rias-de-usu%C3%A1rios-b29c75043fac)
> - [User Stories: requisitos que humanos entendem](https://www.luiztools.com.br/post/user-stories-descricao-de-requisitos-que-humanos-entendem/)
> - [Histórias de Usuários: mais exemplos](https://www.reqview.com/doc/user-stories-example.html)
> - [9 Common User Story Mistakes](https://airfocus.com/blog/user-story-mistakes/)

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O usuário deve poder inserir, editar e excluir tarefas existentes | ALTA | 
|RNF-002| Exportar as informações para download |  BAIXA | 
|RNF-003|	O usuário deve poder filtrar tarefas por categorias.	| MÉDIA |
|RNF-004|	Emitir notificações com o alerta de compromissos.	| BAIXA |


### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve carregar a lista de tarefas em menos de 5 segundos | ALTA | 
|RNF-002| A agenda deve ser responsiva e adaptar-se a diferentes tamanhos de tela, tanto para acesso via site ou celular |  ALTA | 
|RNF-003|	O código deve ser modular e documentado para facilitar atualizações futuras.	| MÉDIA |
|RNF-004|	O sistema deve permitir a atualização sem impactar o desempenho.	| MÉDIA |


## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |


Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)
