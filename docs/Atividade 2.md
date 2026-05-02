# Atividade 2 — Modelos de Processo e Planejamento

## Projeto
Gestor de Ferramentas CNC

## Integrantes
- Victor Baratta  
- Matheus Moraes  

## GitHub
https://victor-bar.github.io/GESTOR-DE-FERRAMENTAS-CNC/

---

## Modelo de Processo Escolhido
O modelo de processo adotado foi o Kanban.

---

## Classificação do Modelo
O modelo Kanban é classificado como Ágil, pois permite flexibilidade, adaptação contínua e entregas progressivas.

---

## Justificativa
O método Kanban foi escolhido por ser simples e fácil de usar na organização do desenvolvimento do sistema. Ele permite visualizar as tarefas em etapas como (A Fazer), (Em Andamento) e (Concluído), facilitando o acompanhamento do progresso.

Além disso, é um método flexível, o que ajuda a adaptar o projeto caso surjam mudanças durante o desenvolvimento. Isso é importante, já que o sistema pode evoluir ao longo do tempo.

Por ser prático e não exigir uma estrutura complexa, o Kanban ajuda a manter o desenvolvimento organizado de forma eficiente.

---

## Estrutura do Processo

### Iterações (ciclos)
Embora o Kanban não utilize sprints fixos, o projeto será organizado em ciclos semanais de acompanhamento.

### Duração
Ciclos contínuos com revisão semanal.

### Entregas
As entregas serão feitas de forma contínua, conforme as funcionalidades forem concluídas no fluxo Kanban.

---

## Papéis da Equipe
Ambos colaboram em todas as etapas do projeto, com divisão de responsabilidades conforme a necessidade.

---

## Backlog Inicial

| ID | Funcionalidade                     | Prioridade |
|----|----------------------------------|-----------|
| 1  | Cadastro de ferramentas          | Alta      |
| 2  | Edição de ferramentas            | Alta      |
| 3  | Exclusão de ferramentas          | Alta      |
| 4  | Controle de vida útil            | Alta      |
| 5  | Registro de uso                  | Alta      |
| 6  | Alertas de desgaste              | Média     |
| 7  | Alertas de baixa quantidade      | Média     |
| 8  | Histórico de uso                 | Média     |
| 9  | Dashboard                        | Média     |
| 10 | Registro de quebra de ferramenta | Alta      |

---

## JSON e Rotas

| ID | Funcionalidade           | Rota              | Método | Descrição                         |
|----|------------------------|-------------------|--------|----------------------------------|
| 1  | Cadastro de ferramentas | /ferramentas      | POST   | Cadastra uma nova ferramenta     |
| 2  | Listar ferramentas      | /ferramentas      | GET    | Lista todas as ferramentas       |
| 3  | Editar ferramenta       | /ferramentas/{id} | PUT    | Atualiza dados da ferramenta     |
| 4  | Deletar ferramenta      | /ferramentas/{id} | DELETE | Remove ferramenta do sistema     |
| 5  | Controle de vida útil   | /vida-util        | PUT    | Atualiza vida útil               |
| 6  | Registro de uso         | /uso              | POST   | Registra uso                     |
| 7  | Alertas de desgaste     | /alertas          | GET    | Gera alertas                     |
| 8  | Histórico de uso        | /historico        | GET    | Consulta histórico               |
| 9  | Dashboard               | /dashboard        | GET    | Exibe dados gerais               |
| 10 | Registro de quebra      | /quebras          | POST   | Registra quebra de ferramenta    |

---

## Cronograma

| Semana | Atividade                               |
|--------|----------------------------------------|
| 1      | Planejamento e levantamento de requisitos |
| 2      | Prototipação                           |
| 3      | Desenvolvimento Backend                |
| 4      | Continuação Backend                    |
| 5      | Desenvolvimento Frontend               |
| 6      | Integração e testes                    |
| 7      | Ajustes finais                         |
| 8      | Implantação (Go-live)                  |

---

## Cronograma detalhado (macro)
https://docs.google.com/spreadsheets/d/1izJ749c1uSKwr5gvbJumcjf_3Sx1yBnrmphSZTtz6DQ/edit?usp=sharing

---

## Ferramentas Utilizadas
- GitHub: versionamento do código e hospedagem do projeto  
- Trello: organização das tarefas no modelo Kanban  
- Figma: protótipos  
- Node.js: backend  
- Banco de dados: a definir  

---

## Considerações
O planejamento do projeto foi estruturado utilizando o método Kanban, permitindo maior flexibilidade e controle visual das tarefas. A divisão clara das responsabilidades e o uso de ferramentas adequadas contribuem para um desenvolvimento organizado e eficiente.

A abordagem adotada possibilita entregas contínuas e adaptação às necessidades do projeto, garantindo maior qualidade no sistema final.