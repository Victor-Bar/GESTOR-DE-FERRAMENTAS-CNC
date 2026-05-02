 Atividade 2 — Modelos de Processo e Planejamento

Projeto: Gestor de Ferramentas CNC

Integrantes: Victor Baratta e Matheus Moraes
GitHub: https://victor-bar.github.io/GESTOR-DE-FERRAMENTAS-CNC/

🔹 Modelo de Processo Escolhido

O modelo de processo adotado foi o Kanban.

🔹 Classificação do Modelo

O modelo Kanban é classificado como Ágil, pois permite flexibilidade, adaptação contínua e entregas progressivas.

🔹 Justificativa

O método Kanban foi escolhido por ser simples e fácil de usar na organização do desenvolvimento do sistema. Ele permite visualizar as tarefas em etapas como (a fazer), (em andamento) e (concluído), facilitando o acompanhamento do progresso.

Além disso, é um método flexível, o que ajuda a adaptar o projeto caso surjam mudanças durante o desenvolvimento. Isso é importante, já que o sistema pode evoluir ao longo do tempo.

Por ser prático e não exigir uma estrutura complexa, o Kanban ajuda a manter o desenvolvimento organizado de forma eficiente.

🔹 Estrutura do Processo
Iterações (sprints)

Embora o Kanban não utilize sprints fixos, o projeto será organizado em ciclos semanais de acompanhamento.

Duração

Ciclos contínuos com revisão semanal.

Entregas

As entregas serão feitas de forma contínua, conforme as funcionalidades forem concluídas no fluxo Kanban.





🔹 Papéis da Equipe

(Ambos colaboram em todas as etapas do projeto)

🔹 Backlog Inicial
ID	Funcionalidade	Prioridade
1	Cadastro de ferramentas	Alta
2	Controle de vida útil	Alta
3	Registro de uso	Alta
4	Alertas de desgaste	Média
5	Alertas de baixa quantidade	Média
6	Histórico de uso	Média
7	Dashboard	Média
8	Registro de quebra de ferramenta	Alta

🔹 JSON e Rotas
ID	Funcionalidade	Rota	JSON
1	Cadastro de ferramentas	/ferramentas	json { "nome": "Cadastro de Ferramenta", "descricao": "Cadastra uma nova ferramenta", "metodo": "POST" }
2	Listar ferramentas	/ferramentas	json { "nome": "Listar Ferramentas", "descricao": "Lista todas as ferramentas", "metodo": "GET" }
3	Controle de vida útil	/vida-util	json { "nome": "Controle de Vida Útil", "descricao": "Atualiza vida útil da ferramenta", "metodo": "PUT" }
4	Registro de uso	/uso	json { "nome": "Registro de Uso", "descricao": "Registra uso da ferramenta", "metodo": "POST" }
5	Alertas de desgaste	/alertas	json { "nome": "Alertas", "descricao": "Gera alertas de desgaste", "metodo": "GET" }
6	Histórico de uso	/historico	json { "nome": "Histórico", "descricao": "Consulta histórico", "metodo": "GET" }
7	Dashboard	/dashboard	json { "nome": "Dashboard", "descricao": "Exibe dados gerais", "metodo": "GET" }
🔹 Cronograma
Semana	Atividade
1	Planejamento e levantamento de requisitos
2	Prototipação
3	Desenvolvimento Backend
4	Continuação Backend
5	Desenvolvimento Frontend
6	Integração e testes
7	Ajustes finais
8	Implantação (Go-live)

📎 Cronograma detalhado (macro):

https://docs.google.com/spreadsheets/d/1izJ749c1uSKwr5gvbJumcjf_3Sx1yBnrmphSZTtz6DQ/edit?usp=sharing

🔹 Ferramentas Utilizadas
GitHub: versionamento do código e hospedagem do projeto
Trello: organização das tarefas no modelo Kanban
Outros:
Figma (protótipos)
Node.js (backend)
Banco de dados (a definir)
🔹 Considerações

O planejamento do projeto foi estruturado utilizando o método Kanban, permitindo maior flexibilidade e controle visual das tarefas. A divisão clara das responsabilidades e o uso de ferramentas adequadas contribuem para um desenvolvimento organizado e eficiente.

A abordagem adotada possibilita entregas contínuas e adaptação às necessidades do projeto, garantindo maior qualidade no sistema final.
