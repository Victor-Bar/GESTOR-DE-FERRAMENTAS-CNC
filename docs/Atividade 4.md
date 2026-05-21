# Atividade 4 — Arquitetura de Software

## Arquitetura Geral

O sistema **Gestor de Ferramentas CNC** utiliza arquitetura baseada em **API REST**.

A API foi desenvolvida utilizando **Node.js** e **Express**, permitindo a comunicação entre frontend e backend através de requisições HTTP.

A arquitetura REST organiza o sistema utilizando operações **CRUD (Create, Read, Update e Delete)** para gerenciamento das funcionalidades.

O sistema possui módulos responsáveis pelo:

- Cadastro e gerenciamento de ferramentas;
- Controle de usuários;
- Controle individual das unidades das ferramentas;
- Registro de ferramentas quebradas;
- Atualização automática do estoque;
- Histórico de ferramentas quebradas com filtro por mês.

Quando uma ferramenta quebra, o operador registra a ocorrência no sistema. Após a confirmação, a unidade específica é removida automaticamente do estoque e armazenada no histórico.

---

## Estrutura do Projeto

```bash
backend/
├── routes/
│   ├── tools.js
│   ├── users.js
│   └── brokenTools.js
│
├── data/
│   ├── tools.json
│   ├── users.json
│   └── brokenTools.json
│
├── server.js
├── package.json
└── node_modules/
```

Descrição:

- **routes/** → definição das rotas da API;
- **data/** → armazenamento dos dados em arquivos JSON;
- **server.js** → inicialização do servidor;
- **package.json** → gerenciamento das dependências do projeto.

---

## Tecnologias Utilizadas

### Backend
- Node.js
- Express.js

### Frontend
- HTML5
- CSS3
- JavaScript

### Banco de Dados
- JSON local

### Outros
- Git
- GitHub
- GitHub Pages
- Figma

---

## Endpoints da API

| Método | Rota | Descrição |
|----------|-------|------------|
| GET | /tools | Lista ferramentas |
| POST | /tools | Cadastra ferramenta |
| PUT | /tools/:id | Atualiza ferramenta |
| DELETE | /tools/:id | Remove ferramenta |
| POST | /users | Cadastra usuário |
| POST | /login | Realiza login |
| POST | /broken-tools | Registra ferramenta quebrada |
| GET | /broken-tools | Lista histórico de ferramentas quebradas |
| GET | /broken-tools?month=Janeiro | Filtra histórico por mês |

---

## Autenticação

O sistema utilizará autenticação baseada em login e senha utilizando **JWT (JSON Web Token)**.

Funcionamento:

1. O usuário realiza login informando e-mail e senha;
2. O backend valida as credenciais;
3. Caso estejam corretas, será gerado um token JWT;
4. O token será enviado ao frontend;
5. O frontend utilizará o token para acessar rotas protegidas.

---

## Diagrama de Classes


![Diagrama de Classes](images/diagrama-classes.png)


---

## Protótipos de Tela



### Dashboard Principal
![Dashboard](images/dashboard.jpg)

### Gestão de Ferramentas
![Gestão de Ferramentas](images/gestao-ferramentas.jpg)

###  de Ferramenta Quebrada
![Ferramenta Quebrada](images/ferramenta-quebrada.jpg)

### Histórico de Ferramentas registrada e Quebradas
![Histórico](images/historico-quebradas.jpg)

---

## Considerações

A arquitetura REST foi escolhida devido à simplicidade de implementação, organização e facilidade de manutenção do sistema.

O sistema automatiza o controle de estoque ao reduzir automaticamente a quantidade disponível quando uma ferramenta quebrada é registrada. Além disso, o histórico por período permite acompanhamento das ocorrências e auxilia no gerenciamento operacional.

