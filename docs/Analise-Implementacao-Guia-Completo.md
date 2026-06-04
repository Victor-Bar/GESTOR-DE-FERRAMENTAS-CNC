# Guia Completo de Implementação — Gestor de Ferramentas CNC
## Análise Detalhada e Passo a Passo para a Atividade 5

> **Para quem é este guia?** Para você, Victor, que precisa sair de um backend quase vazio e entregar um sistema funcional com banco de dados, autenticação JWT e 4 CRUDs em camadas. Este documento explica o **porquê** de cada decisão, não apenas o código.

---

## Índice

1. [Diagnóstico: o que existe vs o que falta](#1-diagnóstico)
2. [Entendendo a Arquitetura em Camadas](#2-arquitetura-em-camadas)
3. [Fase 1 — Infraestrutura](#3-fase-1--infraestrutura)
4. [Fase 2 — Autenticação JWT](#4-fase-2--autenticação-jwt)
5. [Fase 3 — CRUDs em Camadas](#5-fase-3--cruds-em-camadas)
6. [Fase 4 — Polimento e Entrega](#6-fase-4--polimento-e-entrega)
7. [Ordem de Implementação Recomendada](#7-ordem-de-implementação)
8. [Checklist Final](#8-checklist-final)

---

## 1. Diagnóstico

### O que o projeto tem hoje

```
backend/
├── src/
│   ├── app.js          ← Express básico, sem DB
│   ├── server.js       ← Só sobe o servidor
│   └── routes/
│       └── tool.routes.js  ← 1 CRUD, lê de arquivo JSON
└── data/
    └── tools.json      ← "banco de dados" temporário
```

### O que a Atividade 5 exige

| Requisito | Situação atual | O que falta |
|-----------|----------------|-------------|
| API REST com Node.js | ✅ Parcial | Expandir |
| Banco de dados real (PostgreSQL/MySQL) | ❌ Usa JSON | Tudo |
| Autenticação JWT | ❌ Ausente | Tudo |
| 4 CRUDs completos | ❌ Só 1 incompleto | 3 novos CRUDs |
| Arquitetura em camadas | ❌ Tudo na rota | Separar em controller/service/repository |
| Tratamento de erros centralizado | ❌ Ausente | Criar middleware |
| Integração entre módulos | ❌ Ausente | Sinistro → reduz estoque |
| Testes documentados | ❌ Ausente | Documentar no Postman |

### Conclusão do diagnóstico

O projeto está aproximadamente **10% pronto**. A base do Express existe, o que é bom — mas tudo precisa ser reconstruído em cima de uma estrutura nova. A boa notícia: o planejamento está excelente. Agora é executar.

---

## 2. Arquitetura em Camadas

Antes de escrever qualquer código, você precisa entender **por que** vamos separar em camadas. Sem isso, você vai fazer errado e não vai saber por quê.

### O problema de colocar tudo na rota (forma ruim)

```javascript
// ❌ ERRADO — tudo numa rota só
router.post('/ferramentas', async (req, res) => {
  // validação, regra de negócio, query SQL... tudo misturado
  if (!req.body.nome) return res.status(400).json({ erro: 'nome obrigatório' });
  const resultado = await db.query('INSERT INTO ferramenta...', [req.body.nome]);
  res.json(resultado);
});
```

**Problemas:** difícil de testar, impossível de reutilizar, se o banco mudar você tem que editar a rota.

### Como deve ser (forma correta — 4 camadas)

```
Requisição HTTP
      ↓
  ROUTE        → "qual URL chama qual função?" (sem lógica alguma)
      ↓
  CONTROLLER   → "o que fazer com o req e res?" (valida entrada, chama service)
      ↓
  SERVICE      → "qual é a regra de negócio?" (não sabe de HTTP nem SQL)
      ↓
  REPOSITORY   → "como buscar/salvar no banco?" (só SQL, sem regra de negócio)
```

### Analogia do mundo real

Pense num restaurante:
- **Route** = o cardápio (mostra o que existe)
- **Controller** = o garçom (recebe o pedido, anota, leva para a cozinha)
- **Service** = o chef (decide como preparar o prato, as regras)
- **Repository** = a despensa (busca os ingredientes de onde estão guardados)

O garçom não cozinha. O chef não vai na despensa. Cada um faz só o seu papel.

---

## 3. Fase 1 — Infraestrutura

**Objetivo:** preparar o terreno para que tudo mais possa ser construído.

**Tempo estimado:** 1 a 2 dias

### 3.1 Criar a estrutura de pastas

Primeiro, dentro da pasta `backend/src/`, crie estas pastas:

```
mkdir backend/src/database
mkdir backend/src/middleware
mkdir backend/src/controllers
mkdir backend/src/services
mkdir backend/src/repositories
mkdir backend/sql
mkdir backend/tests
```

A estrutura final deve ser:

```
backend/
├── src/
│   ├── database/
│   │   └── connection.js     ← você vai criar
│   ├── middleware/
│   │   ├── auth.js           ← você vai criar
│   │   └── errorHandler.js   ← você vai criar
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── ferramenta.routes.js
│   │   ├── tipo.routes.js
│   │   ├── usuario.routes.js
│   │   └── sinistro.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── ferramenta.controller.js
│   │   ├── tipo.controller.js
│   │   ├── usuario.controller.js
│   │   └── sinistro.controller.js
│   ├── services/
│   │   ├── ferramenta.service.js
│   │   ├── tipo.service.js
│   │   ├── usuario.service.js
│   │   └── sinistro.service.js
│   ├── repositories/
│   │   ├── ferramenta.repository.js
│   │   ├── tipo.repository.js
│   │   ├── usuario.repository.js
│   │   └── sinistro.repository.js
│   ├── app.js
│   └── server.js
├── sql/
│   └── schema.sql
├── tests/
│   └── testes.md
├── .env
├── .env.example
└── package.json
```

### 3.2 Instalar as dependências

No terminal, dentro da pasta `backend/`, execute:

```bash
npm install express pg jsonwebtoken bcrypt dotenv cors express-jwt
npm install nodemon --save-dev
```

**O que cada pacote faz:**

| Pacote | Para que serve |
|--------|----------------|
| `express` | O framework web (já instalado) |
| `pg` | Driver para conectar ao PostgreSQL |
| `jsonwebtoken` | Cria e verifica tokens JWT |
| `bcrypt` | Gera hash de senhas (nunca salvar senha pura no banco) |
| `dotenv` | Lê o arquivo `.env` com as configurações |
| `cors` | Permite que o frontend (outro domínio) acesse a API |
| `express-jwt` | Middleware que valida JWT automaticamente nas rotas |
| `nodemon` | Reinicia o servidor automaticamente quando você salva o arquivo |

> 💡 **Por que não usar MySQL?** O plano original cita PostgreSQL. O projeto de referência da professora usa MySQL, mas você pode escolher qualquer um. O código SQL muda um pouco, mas a lógica é igual. Se quiser seguir o exemplo da professora, substitua `pg` por `mysql2`.

### 3.3 Criar o arquivo .env

Crie `backend/.env` (nunca commite este arquivo!):

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=gestor_ferramentas
JWT_SECRET=uma_chave_secreta_longa_e_aleatoria_aqui
```

Crie também `backend/.env.example` (este você commita, sem os valores reais):

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_NAME=gestor_ferramentas
JWT_SECRET=
```

Crie `backend/.gitignore`:

```
node_modules/
.env
```

> 💡 **Por que ter .env e .env.example?** O `.env` tem sua senha real — se for pro GitHub, qualquer um pode ver. O `.env.example` mostra quais variáveis existem sem expor os valores. É uma prática padrão da indústria.

### 3.4 Criar o script SQL do banco

Crie `backend/sql/schema.sql`:

```sql
-- Cria o banco (execute só uma vez, fora do script se preferir)
-- CREATE DATABASE gestor_ferramentas;

-- Tabela de tipos de usuário (operador, engenheiro)
CREATE TABLE IF NOT EXISTS tipo_usuario (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(50) NOT NULL
);

-- Tabela de tipos de ferramenta (fresa topo, esférica, etc.)
CREATE TABLE IF NOT EXISTS tipo (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(100) NOT NULL,
  qtdade_min INTEGER NOT NULL DEFAULT 1,
  diametro_mm DECIMAL(8,2),
  altura_mm DECIMAL(8,2),
  material VARCHAR(50)
);

-- Tabela de usuários do sistema
CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  login VARCHAR(50) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,  -- sempre armazenar hash, nunca a senha pura
  id_tipo_usuario INTEGER NOT NULL REFERENCES tipo_usuario(id)
);

-- Tabela de ferramentas CNC
CREATE TABLE IF NOT EXISTS ferramenta (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  diametro_mm DECIMAL(8,2),
  altura_mm DECIMAL(8,2),
  material VARCHAR(50),
  vida_util INTEGER DEFAULT 100,  -- porcentagem de vida útil
  quantidade INTEGER DEFAULT 0,
  id_tipo INTEGER NOT NULL REFERENCES tipo(id)
);

-- Tabela de sinistros (ferramentas quebradas)
CREATE TABLE IF NOT EXISTS sinistro (
  id SERIAL PRIMARY KEY,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  descricao TEXT,
  id_usuario INTEGER NOT NULL REFERENCES usuario(id),
  id_ferramenta INTEGER NOT NULL REFERENCES ferramenta(id)
);

-- Tabela de histórico de vida útil
CREATE TABLE IF NOT EXISTS vida_util (
  id SERIAL PRIMARY KEY,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  porcentagem_uso INTEGER NOT NULL,
  id_usuario INTEGER NOT NULL REFERENCES usuario(id),
  id_ferramenta INTEGER NOT NULL REFERENCES ferramenta(id)
);

-- Dados iniciais (seeds) — tipos de usuário
INSERT INTO tipo_usuario (descricao) VALUES ('operador'), ('engenheiro')
ON CONFLICT DO NOTHING;
```

> 💡 **Por que `SERIAL PRIMARY KEY`?** No PostgreSQL, `SERIAL` cria um número que se auto-incrementa — você não precisa informar o `id` na inserção, o banco gera automaticamente. No MySQL, o equivalente é `INT AUTO_INCREMENT`.

> 💡 **Por que `REFERENCES`?** A cláusula `REFERENCES` cria uma **chave estrangeira** — o banco garante que você não consiga cadastrar uma ferramenta com um `id_tipo` que não existe na tabela `tipo`. É integridade referencial.

### 3.5 Criar a conexão com o banco

Crie `backend/src/database/connection.js`:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

// Pool é um conjunto de conexões reutilizáveis
// É mais eficiente que abrir/fechar uma conexão por requisição
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Testa a conexão quando o servidor sobe
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  console.log('Banco de dados conectado!');
  release(); // devolve a conexão para o pool
});

module.exports = pool;
```

> 💡 **Pool vs conexão única:** o projeto da professora usa `createConnection()` — uma conexão só. `Pool` é mais robusto: mantém várias conexões abertas e reutiliza quando chegam requisições simultâneas. Para produção, sempre use Pool.

### 3.6 Reescrever o app.js

Substitua o conteúdo de `backend/src/app.js`:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares globais
app.use(cors());                // permite requisições de origens diferentes
app.use(express.json());        // transforma o body JSON da requisição em objeto JavaScript

// Importação das rotas (adicione cada rota aqui conforme criar)
// const authRoutes = require('./routes/auth.routes');
// app.use('/auth', authRoutes);

// Middleware de tratamento de erros — SEMPRE por último
// const errorHandler = require('./middleware/errorHandler');
// app.use(errorHandler);

module.exports = app;
```

> 💡 **Por que `errorHandler` vai por último?** Middlewares no Express são executados em ordem. O handler de erro precisa estar depois de todas as rotas para "capturar" qualquer erro que aconteça nelas.

---

## 4. Fase 2 — Autenticação JWT

**Objetivo:** criar o sistema de login. Sem isso, não consegue proteger nenhuma rota.

**Tempo estimado:** 1 dia

### O que é JWT?

JWT (JSON Web Token) é como um "crachá digital". Quando você faz login com usuário/senha corretos, o servidor emite um crachá (token) assinado. Nas próximas requisições, você apresenta esse crachá e o servidor verifica se é válido sem precisar consultar o banco.

```
1. POST /auth/login → usuário envia login + senha
2. Servidor verifica no banco → senha correta?
3. Servidor gera token JWT → "aqui está seu crachá"
4. Cliente guarda o token
5. Nas próximas requisições: envia o token no header Authorization
6. Servidor valida o token → sem consultar o banco
```

### 4.1 Criar o middleware de autenticação

Crie `backend/src/middleware/auth.js`:

```javascript
const { expressjwt: expressJwt } = require('express-jwt');
require('dotenv').config();

const segredo = process.env.JWT_SECRET;

// Middleware que verifica se o token JWT é válido
// Quando aplicado a uma rota, o Express rejeita a requisição com 401
// se o token estiver ausente ou inválido
const protegerRota = expressJwt({
  secret: segredo,
  algorithms: ['HS256'],
});

module.exports = { protegerRota, segredo };
```

### 4.2 Criar o controller de autenticação

Crie `backend/src/controllers/auth.controller.js`:

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/connection');
const { segredo } = require('../middleware/auth');

async function login(req, res, next) {
  try {
    const { login, senha } = req.body;

    // Validação básica de entrada
    if (!login || !senha) {
      return res.status(400).json({ erro: 'Login e senha são obrigatórios' });
    }

    // Busca o usuário pelo login (não pela senha — comparamos com bcrypt depois)
    const { rows } = await db.query(
      'SELECT * FROM usuario WHERE login = $1',
      [login]
    );

    const usuario = rows[0];

    // Se não encontrou o usuário
    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    // Compara a senha enviada com o hash armazenado no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    // Gera o token JWT com os dados do usuário (nunca incluir a senha!)
    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, login: usuario.login },
      segredo,
      { expiresIn: '8h' } // token expira em 8 horas
    );

    res.json({ mensagem: 'Login realizado com sucesso', token });

  } catch (erro) {
    next(erro); // repassa para o errorHandler
  }
}

module.exports = { login };
```

> 💡 **Por que não comparamos login E senha no SQL?** Porque a senha no banco é um hash (string embaralhada). `bcrypt.compare()` faz a comparação de forma segura. Se você filtrar `WHERE login = ? AND senha = ?` no SQL, vai comparar texto com hash e nunca vai bater.

### 4.3 Criar a rota de autenticação

Crie `backend/src/routes/auth.routes.js`:

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /auth/login — rota pública, não requer token
router.post('/login', authController.login);

module.exports = router;
```

### 4.4 Registrar a rota no app.js

Edite `backend/src/app.js` para descomentar as linhas de auth:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

// Error handler (por último)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
```

### 4.5 Criar o errorHandler

Crie `backend/src/middleware/errorHandler.js`:

```javascript
// Middleware de tratamento de erros centralizado
// Recebe 4 parâmetros — o Express identifica isso como handler de erro
function errorHandler(err, req, res, next) {
  console.error('Erro capturado:', err.message);

  // Erros de JWT inválido ou ausente
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ erro: 'Token inválido ou ausente' });
  }

  // Erros de integridade do banco (FK violada, unique constraint, etc.)
  if (err.code === '23503') {
    return res.status(400).json({ erro: 'Registro relacionado não encontrado' });
  }
  if (err.code === '23505') {
    return res.status(400).json({ erro: 'Registro duplicado' });
  }

  // Erro genérico — nunca expor detalhes internos para o cliente
  res.status(500).json({ erro: 'Erro interno do servidor' });
}

module.exports = errorHandler;
```

### 4.6 Testar o login no Postman

Antes de continuar, teste:

1. Crie um usuário manualmente no banco (via psql ou pgAdmin):
```sql
INSERT INTO tipo_usuario (descricao) VALUES ('operador');
INSERT INTO usuario (nome, login, senha, id_tipo_usuario)
VALUES (
  'Victor',
  'victor',
  '$2b$10$...',  -- gere um hash com bcrypt antes de inserir
  1
);
```

Para gerar o hash antes de inserir, crie um script temporário:
```javascript
// gerar-hash.js (apague depois)
const bcrypt = require('bcrypt');
bcrypt.hash('senha123', 10).then(hash => console.log(hash));
```

Execute com `node gerar-hash.js` e copie o resultado para o INSERT.

2. No Postman, faça `POST http://localhost:3000/auth/login` com body:
```json
{
  "login": "victor",
  "senha": "senha123"
}
```

Resultado esperado: `200 OK` com um token JWT.

---

## 5. Fase 3 — CRUDs em Camadas

**Objetivo:** implementar os 4 CRUDs seguindo rigorosamente o padrão de camadas.

**Tempo estimado:** 3 a 5 dias

**Ordem recomendada (do mais simples ao mais complexo):**
1. `tipos` — sem dependências externas, o mais simples
2. `ferramentas` — depende de `tipo`
3. `usuarios` — depende de `tipo_usuario` (já populado no seed)
4. `sinistros` — depende de `usuario` + `ferramenta`, tem regra de negócio

### 5.1 CRUD de Tipos (Victor)

#### Repository

Crie `backend/src/repositories/tipo.repository.js`:

```javascript
const db = require('../database/connection');

async function listarTodos() {
  const { rows } = await db.query('SELECT * FROM tipo ORDER BY id');
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await db.query('SELECT * FROM tipo WHERE id = $1', [id]);
  return rows[0]; // undefined se não encontrar
}

async function criar(dados) {
  const { descricao, qtdade_min, diametro_mm, altura_mm, material } = dados;
  const sql = `
    INSERT INTO tipo (descricao, qtdade_min, diametro_mm, altura_mm, material)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const { rows } = await db.query(sql, [descricao, qtdade_min, diametro_mm, altura_mm, material]);
  return rows[0];
}

async function atualizar(id, dados) {
  const { descricao, qtdade_min, diametro_mm, altura_mm, material } = dados;
  const sql = `
    UPDATE tipo
    SET descricao = $1, qtdade_min = $2, diametro_mm = $3, altura_mm = $4, material = $5
    WHERE id = $6
    RETURNING *
  `;
  const { rows } = await db.query(sql, [descricao, qtdade_min, diametro_mm, altura_mm, material, id]);
  return rows[0]; // undefined se id não existir
}

async function remover(id) {
  const { rowCount } = await db.query('DELETE FROM tipo WHERE id = $1', [id]);
  return rowCount > 0; // true se deletou, false se não achou o id
}

module.exports = { listarTodos, buscarPorId, criar, atualizar, remover };
```

> 💡 **Por que `RETURNING *`?** No PostgreSQL, o `INSERT` e `UPDATE` não retornam o registro por padrão. Com `RETURNING *`, o banco devolve a linha modificada, incluindo o `id` gerado automaticamente.

#### Service

Crie `backend/src/services/tipo.service.js`:

```javascript
const tipoRepository = require('../repositories/tipo.repository');

async function listar() {
  return await tipoRepository.listarTodos();
}

async function buscarPorId(id) {
  const tipo = await tipoRepository.buscarPorId(id);
  if (!tipo) {
    const erro = new Error('Tipo não encontrado');
    erro.status = 404;
    throw erro;
  }
  return tipo;
}

async function cadastrar(dados) {
  if (!dados.descricao) {
    const erro = new Error('Descrição é obrigatória');
    erro.status = 400;
    throw erro;
  }
  return await tipoRepository.criar(dados);
}

async function atualizar(id, dados) {
  // Verifica se existe antes de atualizar
  await buscarPorId(id); // já lança 404 se não achar
  return await tipoRepository.atualizar(id, dados);
}

async function remover(id) {
  await buscarPorId(id); // já lança 404 se não achar
  return await tipoRepository.remover(id);
}

module.exports = { listar, buscarPorId, cadastrar, atualizar, remover };
```

> 💡 **Por que jogar erro com `status`?** O errorHandler pode usar `err.status` para retornar o código HTTP correto. É uma técnica simples de comunicar erros esperados (404, 400) vs erros inesperados (500).

#### Controller

Crie `backend/src/controllers/tipo.controller.js`:

```javascript
const tipoService = require('../services/tipo.service');

async function listar(req, res, next) {
  try {
    const tipos = await tipoService.listar();
    res.json(tipos);
  } catch (erro) {
    next(erro);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const tipo = await tipoService.buscarPorId(req.params.id);
    res.json(tipo);
  } catch (erro) {
    next(erro);
  }
}

async function cadastrar(req, res, next) {
  try {
    const novo = await tipoService.cadastrar(req.body);
    res.status(201).json(novo);
  } catch (erro) {
    next(erro);
  }
}

async function atualizar(req, res, next) {
  try {
    const atualizado = await tipoService.atualizar(req.params.id, req.body);
    res.json(atualizado);
  } catch (erro) {
    next(erro);
  }
}

async function remover(req, res, next) {
  try {
    await tipoService.remover(req.params.id);
    res.status(204).send(); // 204 = sem conteúdo, deu certo mas não tem body
  } catch (erro) {
    next(erro);
  }
}

module.exports = { listar, buscarPorId, cadastrar, atualizar, remover };
```

> 💡 **Por que `res.status(201)` no cadastrar?** O código HTTP `201 Created` indica que algo foi criado com sucesso. `200 OK` significa que a requisição foi bem-sucedida mas não necessariamente criou algo. Usar o código correto é boa prática.

#### Route

Crie `backend/src/routes/tipo.routes.js`:

```javascript
const express = require('express');
const router = express.Router();
const tipoController = require('../controllers/tipo.controller');
const { protegerRota } = require('../middleware/auth');

// Rotas públicas (leitura)
router.get('/', tipoController.listar);
router.get('/:id', tipoController.buscarPorId);

// Rotas protegidas (escrita — exigem token JWT)
router.post('/', protegerRota, tipoController.cadastrar);
router.put('/:id', protegerRota, tipoController.atualizar);
router.delete('/:id', protegerRota, tipoController.remover);

module.exports = router;
```

#### Registrar no app.js

```javascript
const tipoRoutes = require('./routes/tipo.routes');
app.use('/tipos', tipoRoutes);
```

---

### 5.2 CRUD de Ferramentas (Victor)

Segue o mesmo padrão do `tipo`, com duas diferenças importantes:

**Repository** — `backend/src/repositories/ferramenta.repository.js`:

```javascript
const db = require('../database/connection');

async function listarTodos() {
  // JOIN com tipo para trazer a descrição do tipo junto
  const sql = `
    SELECT f.*, t.descricao as tipo_descricao, t.qtdade_min
    FROM ferramenta f
    JOIN tipo t ON f.id_tipo = t.id
    ORDER BY f.id
  `;
  const { rows } = await db.query(sql);
  return rows;
}

async function buscarPorId(id) {
  const sql = `
    SELECT f.*, t.descricao as tipo_descricao, t.qtdade_min
    FROM ferramenta f
    JOIN tipo t ON f.id_tipo = t.id
    WHERE f.id = $1
  `;
  const { rows } = await db.query(sql, [id]);
  return rows[0];
}

async function listarAlertas() {
  // Ferramentas cuja quantidade está ABAIXO do mínimo do tipo
  const sql = `
    SELECT f.*, t.descricao as tipo_descricao, t.qtdade_min
    FROM ferramenta f
    JOIN tipo t ON f.id_tipo = t.id
    WHERE f.quantidade < t.qtdade_min
  `;
  const { rows } = await db.query(sql);
  return rows;
}

async function criar(dados) {
  const { nome, diametro_mm, altura_mm, material, vida_util, quantidade, id_tipo } = dados;
  const sql = `
    INSERT INTO ferramenta (nome, diametro_mm, altura_mm, material, vida_util, quantidade, id_tipo)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const { rows } = await db.query(sql, [nome, diametro_mm, altura_mm, material, vida_util, quantidade, id_tipo]);
  return rows[0];
}

async function atualizar(id, dados) {
  const { nome, diametro_mm, altura_mm, material, vida_util, quantidade, id_tipo } = dados;
  const sql = `
    UPDATE ferramenta
    SET nome = $1, diametro_mm = $2, altura_mm = $3, material = $4,
        vida_util = $5, quantidade = $6, id_tipo = $7
    WHERE id = $8
    RETURNING *
  `;
  const { rows } = await db.query(sql, [nome, diametro_mm, altura_mm, material, vida_util, quantidade, id_tipo, id]);
  return rows[0];
}

async function reduzirQuantidade(id, quantidade = 1) {
  // Reduz a quantidade quando ocorre um sinistro
  const sql = `
    UPDATE ferramenta
    SET quantidade = quantidade - $1
    WHERE id = $2
    RETURNING *
  `;
  const { rows } = await db.query(sql, [quantidade, id]);
  return rows[0];
}

async function remover(id) {
  const { rowCount } = await db.query('DELETE FROM ferramenta WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { listarTodos, buscarPorId, listarAlertas, criar, atualizar, reduzirQuantidade, remover };
```

**Service** — `backend/src/services/ferramenta.service.js`:

```javascript
const ferramentaRepository = require('../repositories/ferramenta.repository');
const tipoRepository = require('../repositories/tipo.repository');

async function listar() {
  return await ferramentaRepository.listarTodos();
}

async function listarAlertas() {
  return await ferramentaRepository.listarAlertas();
}

async function buscarPorId(id) {
  const ferramenta = await ferramentaRepository.buscarPorId(id);
  if (!ferramenta) {
    const erro = new Error('Ferramenta não encontrada');
    erro.status = 404;
    throw erro;
  }
  return ferramenta;
}

async function cadastrar(dados) {
  if (!dados.nome || !dados.id_tipo) {
    const erro = new Error('Nome e tipo são obrigatórios');
    erro.status = 400;
    throw erro;
  }

  // Valida que o tipo existe antes de inserir
  const tipo = await tipoRepository.buscarPorId(dados.id_tipo);
  if (!tipo) {
    const erro = new Error('Tipo de ferramenta não encontrado');
    erro.status = 400;
    throw erro;
  }

  return await ferramentaRepository.criar(dados);
}

async function atualizar(id, dados) {
  await buscarPorId(id);
  if (dados.id_tipo) {
    const tipo = await tipoRepository.buscarPorId(dados.id_tipo);
    if (!tipo) {
      const erro = new Error('Tipo de ferramenta não encontrado');
      erro.status = 400;
      throw erro;
    }
  }
  return await ferramentaRepository.atualizar(id, dados);
}

async function remover(id) {
  await buscarPorId(id);
  return await ferramentaRepository.remover(id);
}

module.exports = { listar, listarAlertas, buscarPorId, cadastrar, atualizar, remover };
```

**Route** — `backend/src/routes/ferramenta.routes.js`:

```javascript
const express = require('express');
const router = express.Router();
const ferramentaController = require('../controllers/ferramenta.controller');
const { protegerRota } = require('../middleware/auth');

// ATENÇÃO: rota /alertas deve vir ANTES de /:id
// O Express lê as rotas em ordem — se /:id vier antes, "alertas" seria interpretado como um id
router.get('/alertas', protegerRota, ferramentaController.listarAlertas);
router.get('/', ferramentaController.listar);
router.get('/:id', ferramentaController.buscarPorId);
router.post('/', protegerRota, ferramentaController.cadastrar);
router.put('/:id', protegerRota, ferramentaController.atualizar);
router.delete('/:id', protegerRota, ferramentaController.remover);

module.exports = router;
```

> ⚠️ **Cuidado com a ordem das rotas!** A rota `/alertas` deve sempre vir antes de `/:id`. Se não, o Express vai interpretar a palavra "alertas" como um parâmetro de ID e vai tentar buscar uma ferramenta com id "alertas".

---

### 5.3 CRUD de Usuários (Matheus)

A diferença principal aqui é o hash de senha:

**Service** — trecho de `usuario.service.js` com hash:

```javascript
const bcrypt = require('bcrypt');
const usuarioRepository = require('../repositories/usuario.repository');

async function cadastrar(dados) {
  if (!dados.login || !dados.senha || !dados.nome) {
    const erro = new Error('Nome, login e senha são obrigatórios');
    erro.status = 400;
    throw erro;
  }

  // Hash da senha — NUNCA salvar a senha pura no banco
  // O número 10 é o "salt rounds" — quantas vezes embaralha. Mais = mais seguro, mas mais lento
  const senhaHash = await bcrypt.hash(dados.senha, 10);

  return await usuarioRepository.criar({ ...dados, senha: senhaHash });
}

// Nunca retornar a senha, mesmo que seja hash
async function listar() {
  const usuarios = await usuarioRepository.listarTodos();
  return usuarios.map(u => {
    const { senha, ...semSenha } = u; // desestruturação: remove a senha do objeto
    return semSenha;
  });
}

module.exports = { listar, cadastrar /* ... */ };
```

---

### 5.4 CRUD de Sinistros (Matheus) — com integração

Este é o CRUD mais importante porque tem **regra de negócio entre módulos**:

**Service** — `backend/src/services/sinistro.service.js`:

```javascript
const sinistroRepository = require('../repositories/sinistro.repository');
const ferramentaRepository = require('../repositories/ferramenta.repository');
const usuarioRepository = require('../repositories/usuario.repository');

async function listar(filtros = {}) {
  return await sinistroRepository.listarTodos(filtros);
}

async function registrar(dados) {
  const { id_usuario, id_ferramenta, descricao } = dados;

  // 1. Validar que a ferramenta existe
  const ferramenta = await ferramentaRepository.buscarPorId(id_ferramenta);
  if (!ferramenta) {
    const erro = new Error('Ferramenta não encontrada');
    erro.status = 404;
    throw erro;
  }

  // 2. Validar que o usuário existe
  const usuario = await usuarioRepository.buscarPorId(id_usuario);
  if (!usuario) {
    const erro = new Error('Usuário não encontrado');
    erro.status = 404;
    throw erro;
  }

  // 3. Salvar o sinistro
  const sinistro = await sinistroRepository.criar({ id_usuario, id_ferramenta, descricao });

  // 4. Reduzir a quantidade da ferramenta (integração entre módulos!)
  await ferramentaRepository.reduzirQuantidade(id_ferramenta, 1);

  return sinistro;
}

async function remover(id) {
  const sinistro = await sinistroRepository.buscarPorId(id);
  if (!sinistro) {
    const erro = new Error('Sinistro não encontrado');
    erro.status = 404;
    throw erro;
  }
  return await sinistroRepository.remover(id);
}

module.exports = { listar, registrar, remover };
```

**Repository** — com filtro por mês:

```javascript
async function listarTodos(filtros = {}) {
  let sql = `
    SELECT s.*, u.nome as usuario_nome, f.nome as ferramenta_nome
    FROM sinistro s
    JOIN usuario u ON s.id_usuario = u.id
    JOIN ferramenta f ON s.id_ferramenta = f.id
  `;
  const params = [];

  // Filtro por mês (ex: ?mes=Janeiro)
  if (filtros.mes) {
    sql += ` WHERE TO_CHAR(s.data, 'Month') ILIKE $1`;
    params.push(`%${filtros.mes}%`);
  }

  sql += ' ORDER BY s.data DESC';
  const { rows } = await db.query(sql, params);
  return rows;
}
```

**Controller** — passando o filtro:

```javascript
async function listar(req, res, next) {
  try {
    // req.query contém os parâmetros da URL: /sinistros?mes=Janeiro
    const sinistros = await sinistroService.listar(req.query);
    res.json(sinistros);
  } catch (erro) {
    next(erro);
  }
}
```

---

## 6. Fase 4 — Polimento e Entrega

**Objetivo:** garantir que tudo está robusto e documentado para a entrega.

**Tempo estimado:** 1 a 2 dias

### 6.1 Atualizar o errorHandler para tratar status customizado

```javascript
function errorHandler(err, req, res, next) {
  console.error('Erro:', err.message);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ erro: 'Token inválido ou ausente' });
  }

  // Erros que o service lançou com status definido (400, 404, etc.)
  if (err.status) {
    return res.status(err.status).json({ erro: err.message });
  }

  // Constraint do banco: FK violada
  if (err.code === '23503') {
    return res.status(400).json({ erro: 'Registro relacionado não existe no banco' });
  }

  // Constraint do banco: unique violada
  if (err.code === '23505') {
    return res.status(400).json({ erro: 'Já existe um registro com esses dados' });
  }

  res.status(500).json({ erro: 'Erro interno do servidor' });
}
```

### 6.2 Criar o arquivo de testes

Crie `backend/tests/testes.md` seguindo este modelo:

```markdown
# Testes da API — Gestor de Ferramentas CNC

## Teste 1 — Login com credenciais válidas
**Endpoint:** POST /auth/login
**Body:** { "login": "victor", "senha": "senha123" }
**Resultado esperado:** 200 OK + token JWT no body
**Resultado obtido:** [cole o print do Postman aqui]

## Teste 2 — Login com credenciais inválidas
**Endpoint:** POST /auth/login
**Body:** { "login": "victor", "senha": "errada" }
**Resultado esperado:** 401 Unauthorized
**Resultado obtido:** [cole o print aqui]

## Teste 3 — Listar tipos (sem token)
**Endpoint:** GET /tipos
**Resultado esperado:** 200 OK + array de tipos
**Resultado obtido:** [...]

## Teste 4 — Criar tipo sem token
**Endpoint:** POST /tipos
**Body:** { "descricao": "Fresa Topo", "qtdade_min": 5 }
**Resultado esperado:** 401 Unauthorized
**Resultado obtido:** [...]

## Teste 5 — Criar tipo com token
**Endpoint:** POST /tipos
**Header:** Authorization: Bearer [seu-token]
**Body:** { "descricao": "Fresa Topo", "qtdade_min": 5 }
**Resultado esperado:** 201 Created + objeto criado com id
**Resultado obtido:** [...]

[Continue para todos os endpoints...]
```

### 6.3 Criar o README

Crie `backend/README.md` com:

```markdown
# Gestor de Ferramentas CNC — API

## Pré-requisitos
- Node.js 18+
- PostgreSQL 14+

## Instalação
1. Clone o repositório
2. `cd backend && npm install`
3. Copie `.env.example` para `.env` e preencha as variáveis
4. Crie o banco: `psql -U postgres -c "CREATE DATABASE gestor_ferramentas;"`
5. Execute o schema: `psql -U postgres -d gestor_ferramentas -f sql/schema.sql`

## Executar
```bash
npm run dev    # modo desenvolvimento
npm start      # modo produção
```

## Endpoints principais
- POST /auth/login — login
- GET/POST/PUT/DELETE /tipos — tipos de ferramentas
- GET/POST/PUT/DELETE /ferramentas — ferramentas
- GET/POST/PUT/DELETE /usuarios — usuários
- GET/POST/DELETE /sinistros — sinistros (quebras)
```

---

## 7. Ordem de Implementação

Aqui está o roteiro exato, do início ao fim. Cada passo deve ser um commit separado:

```
Semana 1 — Infraestrutura e Autenticação
  commit: "feat: cria estrutura de pastas e instala dependências"
  commit: "feat: cria schema SQL com as 6 tabelas"
  commit: "feat: cria conexão com PostgreSQL"
  commit: "feat: cria middleware de autenticação JWT"
  commit: "feat: cria endpoint POST /auth/login"
  commit: "feat: cria middleware de tratamento de erros"

Semana 2 — CRUDs principais
  commit: "feat: cria CRUD completo de tipos (repository/service/controller/route)"
  commit: "feat: cria CRUD completo de ferramentas"
  commit: "feat: adiciona endpoint GET /ferramentas/alertas"
  commit: "feat: cria CRUD completo de usuários"

Semana 3 — Integração e polimento
  commit: "feat: cria CRUD de sinistros"
  commit: "feat: registrar sinistro reduz quantidade da ferramenta"
  commit: "fix: trata erros de validação em todos os endpoints"
  commit: "docs: documenta todos os testes no Postman"
  commit: "docs: atualiza README com instruções de instalação"
```

> ⚠️ **Regra de ouro do Git:** um commit por funcionalidade. Não faça um commit gigante com tudo de uma vez. O professor avalia a progressão. Commits pequenos e frequentes mostram trabalho real.

---

## 8. Checklist Final

Antes de entregar, passe por cada item:

### Funcionamento técnico
- [ ] `npm run dev` sobe sem erros
- [ ] Banco conecta (mensagem no console)
- [ ] `POST /auth/login` retorna token JWT
- [ ] `GET /tipos` retorna array (sem token)
- [ ] `POST /tipos` sem token retorna 401
- [ ] `POST /tipos` com token retorna 201 e objeto criado
- [ ] CRUD de ferramentas funciona completo
- [ ] CRUD de usuários funciona completo
- [ ] CRUD de sinistros funciona completo
- [ ] `GET /ferramentas/alertas` lista ferramentas abaixo do mínimo
- [ ] Ao registrar sinistro, a `quantidade` da ferramenta diminui

### Arquitetura
- [ ] Cada módulo tem: route → controller → service → repository
- [ ] Nenhuma query SQL está em controller ou service
- [ ] Nenhuma lógica de negócio está na rota
- [ ] `errorHandler` está no final do `app.js`

### Boas práticas
- [ ] `.env` está no `.gitignore`
- [ ] `.env.example` está commitado (sem valores reais)
- [ ] Senhas estão em hash bcrypt no banco
- [ ] Commits estão distribuídos ao longo das semanas

### Documentação
- [ ] `tests/testes.md` tem pelo menos 1 teste por endpoint
- [ ] `README.md` tem instruções de instalação e execução
- [ ] Cada integrante tem commits visíveis

---

## Dicas Finais

**Quando travar em um erro:**
1. Leia a mensagem de erro por inteiro — geralmente diz a linha exata
2. Verifique se o `require()` aponta para o caminho correto
3. Use `console.log()` para ver o que está chegando em cada camada
4. Teste no Postman antes de avançar para a próxima funcionalidade

**Quando um endpoint não funcionar:**
1. Verifique se a rota está registrada no `app.js`
2. Verifique se o método HTTP está correto (GET vs POST)
3. Verifique se o middleware de auth está aplicado onde deve

**Fluxo de debug recomendado:**
```
Postman → Route → Controller → Service → Repository → Banco
```
Vá etapa por etapa com `console.log` até achar onde o dado "sumiu".

---

*Gerado em: 2026-06-03*
*Baseado no Plano de Implementação — Atividade 5 e na análise do estado atual do projeto*
