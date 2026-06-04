# Plano de 3 Dias — Implementação do Gestor de Ferramentas CNC

> Cada bloco abaixo é um **commit**. Implemente os arquivos listados, teste no Postman, e só então commite. Próximo commit, mesma coisa.

---

## Dia 1 — Base e Autenticação
**Meta do dia:** servidor rodando com banco conectado e login funcionando.

---

### Commit 1 — Estrutura e ambiente
**O que fazer:**
- Crie todas as pastas dentro de `backend/src/`: `database/`, `middleware/`, `controllers/`, `services/`, `repositories/`
- Crie as pastas `backend/sql/` e `backend/tests/`
- Dentro de `backend/`, execute: `npm install express pg jsonwebtoken bcrypt dotenv cors express-jwt`
- Adicione `"dev": "nodemon src/server.js"` nos scripts do `backend/package.json`
- Crie `backend/.env` com as variáveis (PORT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET)
- Crie `backend/.env.example` com as mesmas chaves mas sem valores
- Crie `backend/.gitignore` com `node_modules/` e `.env`

```
git commit -m "chore: estrutura de pastas, dependências, .env e .gitignore"
```

---

### Commit 2 — Schema SQL
**O que fazer:**
- Crie `backend/sql/schema.sql` com as 6 tabelas: `tipo_usuario`, `tipo`, `usuario`, `ferramenta`, `sinistro`, `vida_util`
- Inclua os INSERTs de seed para `tipo_usuario` (operador, engenheiro)
- Execute o script no banco: `psql -U postgres -d gestor_ferramentas -f sql/schema.sql`

```
git commit -m "feat: schema SQL com as 6 tabelas, FKs e seeds iniciais"
```

---

### Commit 3 — Conexão com o banco
**O que fazer:**
- Crie `backend/src/database/connection.js` com o Pool do `pg`
- Leia as variáveis do `.env` via `dotenv`
- Inclua o `pool.connect()` de teste que imprime "Banco conectado!" no console

**Teste:** rode `node src/server.js` e confirme a mensagem de conexão sem erro.

```
git commit -m "feat: conexão com PostgreSQL via Pool"
```

---

### Commit 4 — app.js base
**O que fazer:**
- Reescreva `backend/src/app.js` com: `cors()`, `express.json()`, e as importações de rotas comentadas (vai descomentando conforme cria)
- Deixe o slot do `errorHandler` no final (ainda comentado)

```
git commit -m "feat: app.js com middlewares globais (cors, json)"
```

---

### Commit 5 — Middlewares de auth e erros
**O que fazer:**
- Crie `backend/src/middleware/auth.js` com o `express-jwt` configurado com o `JWT_SECRET` do `.env`
- Exporte `protegerRota` e `segredo`
- Crie `backend/src/middleware/errorHandler.js` com tratamento de: `UnauthorizedError`, `err.status`, códigos `23503` e `23505` do PostgreSQL, e fallback 500
- Descomente o `errorHandler` no `app.js`

```
git commit -m "feat: middleware JWT (auth) e handler centralizado de erros"
```

---

### Commit 6 — Endpoint de login
**O que fazer:**
- Crie `backend/src/controllers/auth.controller.js` com a função `login` que: busca usuário por login, compara senha com `bcrypt.compare`, gera token com `jwt.sign` e retorna `{ token }`
- Crie `backend/src/routes/auth.routes.js` com `POST /login → authController.login`
- Registre no `app.js`: `app.use('/auth', authRoutes)`
- Insira um usuário de teste no banco (gere o hash com: `node -e "require('bcrypt').hash('senha123',10).then(console.log)"`)

**Teste no Postman:** `POST /auth/login` com `{ "login": "victor", "senha": "senha123" }` → deve retornar `200` com token JWT.

```
git commit -m "feat: endpoint POST /auth/login com JWT e bcrypt"
```

**Fim do Dia 1 ✅ — banco conectado, login funcionando, infraestrutura pronta.**

---

## Dia 2 — CRUDs de Tipos e Ferramentas (Victor)
**Meta do dia:** 2 CRUDs completos e funcionais, com endpoint de alertas.

---

### Commit 7 — CRUD completo de Tipos
**O que fazer (4 arquivos de uma vez):**
- `repositories/tipo.repository.js` → funções: `listarTodos`, `buscarPorId`, `criar`, `atualizar`, `remover`
- `services/tipo.service.js` → mesmas funções com validação (`!dados.descricao` lança erro 400, `buscarPorId` lança 404 se não achar)
- `controllers/tipo.controller.js` → 5 funções com `try/catch → next(erro)`, `res.status(201)` no cadastrar
- `routes/tipo.routes.js` → GET público, POST/PUT/DELETE com `protegerRota`
- Registre no `app.js`: `app.use('/tipos', tipoRoutes)`

**Testes no Postman:**
- `GET /tipos` → 200 (sem token)
- `POST /tipos` sem token → 401
- `POST /tipos` com token → 201 com objeto criado
- `PUT /tipos/1` com token → 200 com objeto atualizado
- `DELETE /tipos/1` com token → 204

```
git commit -m "feat: CRUD completo de tipos (repository/service/controller/route)"
```

---

### Commit 8 — CRUD completo de Ferramentas
**O que fazer (4 arquivos):**
- `repositories/ferramenta.repository.js` → funções: `listarTodos` (com JOIN em `tipo`), `buscarPorId`, `criar`, `atualizar`, `remover`, e já inclua `reduzirQuantidade` (vai usar no Dia 3)
- `services/ferramenta.service.js` → validação de `id_tipo` existente antes de criar/atualizar (chama `tipoRepository.buscarPorId`)
- `controllers/ferramenta.controller.js` → padrão
- `routes/ferramenta.routes.js` → **atenção: a rota `/alertas` vem ANTES de `/:id`**
- Registre no `app.js`: `app.use('/ferramentas', ferramentaRoutes)`

**Testes no Postman:**
- `GET /ferramentas` → 200 com array
- `POST /ferramentas` sem token → 401
- `POST /ferramentas` com token e `id_tipo` inexistente → 400 "Tipo não encontrado"
- `POST /ferramentas` com token e dados válidos → 201

```
git commit -m "feat: CRUD completo de ferramentas com validação de tipo"
```

---

### Commit 9 — Endpoint de alertas
**O que fazer:**
- No `ferramenta.repository.js`, adicione `listarAlertas` com JOIN e `WHERE f.quantidade < t.qtdade_min`
- Adicione `listarAlertas` no `ferramenta.service.js` (só delega para o repository)
- Adicione `listarAlertas` no `ferramenta.controller.js`
- A rota `GET /alertas` já deve estar no `ferramenta.routes.js` (com `protegerRota`)

**Testes no Postman:**
- Insira uma ferramenta com `quantidade = 0` e tipo com `qtdade_min = 5`
- `GET /ferramentas/alertas` com token → deve aparecer essa ferramenta
- `GET /ferramentas/alertas` sem token → 401

```
git commit -m "feat: endpoint GET /ferramentas/alertas compara quantidade vs mínimo"
```

**Fim do Dia 2 ✅ — 2 CRUDs funcionando, endpoint especial de alertas pronto.**

---

## Dia 3 — Usuários, Sinistros, Integração e Entrega
**Meta do dia:** sistema completo e documentado.

---

### Commit 10 — CRUD completo de Usuários (Matheus)
**O que fazer (4 arquivos):**
- `repositories/usuario.repository.js` → `listarTodos`, `buscarPorId`, `criar`, `atualizar`, `remover`
- `services/usuario.service.js` → no `cadastrar`, faça hash com `bcrypt.hash(dados.senha, 10)` antes de salvar. No `listar`, remova o campo `senha` de cada objeto antes de retornar (`const { senha, ...semSenha } = u`)
- `controllers/usuario.controller.js` → padrão
- `routes/usuario.routes.js` → `GET` e `POST` sem token (cadastro é público), `PUT` e `DELETE` com `protegerRota`
- Registre no `app.js`

**Testes no Postman:**
- `POST /usuarios` sem token → 201 (cadastro público)
- Verifique no banco que a senha está como hash (`$2b$...`), nunca o texto puro
- `GET /usuarios` → lista sem o campo `senha`

```
git commit -m "feat: CRUD completo de usuários com hash bcrypt e senha oculta na listagem"
```

---

### Commit 11 — CRUD de Sinistros (Matheus)
**O que fazer (4 arquivos, sem a integração ainda):**
- `repositories/sinistro.repository.js` → `listarTodos` (com JOIN em `usuario` e `ferramenta`, suporte ao filtro `?mes=`), `buscarPorId`, `criar`, `remover`
- `services/sinistro.service.js` → valida que `id_usuario` e `id_ferramenta` existem antes de criar
- `controllers/sinistro.controller.js` → passa `req.query` para o `listar` (para o filtro por mês funcionar)
- `routes/sinistro.routes.js` → todas as rotas com `protegerRota`
- Registre no `app.js`

**Testes no Postman:**
- `POST /sinistros` com token e dados válidos → 201
- `GET /sinistros` → lista
- `GET /sinistros?mes=Junho` → filtra por mês

```
git commit -m "feat: CRUD de sinistros com filtro por mês"
```

---

### Commit 12 — Integração: sinistro reduz quantidade da ferramenta
**O que fazer (só 1 arquivo muda):**
- Em `services/sinistro.service.js`, na função `registrar`, após salvar o sinistro, chame: `await ferramentaRepository.reduzirQuantidade(id_ferramenta, 1)`

**Teste crítico no Postman:**
1. Anote a `quantidade` atual de uma ferramenta via `GET /ferramentas/:id`
2. Faça `POST /sinistros` com o `id_ferramenta` dessa ferramenta
3. Busque novamente `GET /ferramentas/:id` — a `quantidade` deve ter diminuído 1

> Este é o ponto de integração entre módulos que o professor avalia. Documente esse teste com print.

```
git commit -m "feat: registrar sinistro reduz automaticamente a quantidade da ferramenta"
```

---

### Commit 13 — Documentação dos testes
**O que fazer:**
- Preencha `backend/tests/testes.md` com pelo menos 1 teste por endpoint
- Cole prints do Postman ou descreva o resultado obtido
- Mínimo: login válido, login inválido, rota sem token, rota com token, cada CRUD (criar, listar, atualizar, deletar), alertas, sinistro com redução de estoque

```
git commit -m "docs: testes documentados para todos os endpoints no Postman"
```

---

### Commit 14 — README de instalação
**O que fazer:**
- Crie `backend/README.md` com: pré-requisitos, passo a passo de instalação, como executar, lista de endpoints

```
git commit -m "docs: README com instruções de instalação e endpoints da API"
```

**Fim do Dia 3 ✅ — sistema completo, testado e documentado.**

---

## Resumo dos 14 commits

| Dia | # | Commit |
|-----|---|--------|
| 1 | 1 | `chore: estrutura de pastas, dependências, .env e .gitignore` |
| 1 | 2 | `feat: schema SQL com as 6 tabelas, FKs e seeds iniciais` |
| 1 | 3 | `feat: conexão com PostgreSQL via Pool` |
| 1 | 4 | `feat: app.js com middlewares globais (cors, json)` |
| 1 | 5 | `feat: middleware JWT (auth) e handler centralizado de erros` |
| 1 | 6 | `feat: endpoint POST /auth/login com JWT e bcrypt` |
| 2 | 7 | `feat: CRUD completo de tipos (repository/service/controller/route)` |
| 2 | 8 | `feat: CRUD completo de ferramentas com validação de tipo` |
| 2 | 9 | `feat: endpoint GET /ferramentas/alertas compara quantidade vs mínimo` |
| 3 | 10 | `feat: CRUD completo de usuários com hash bcrypt e senha oculta na listagem` |
| 3 | 11 | `feat: CRUD de sinistros com filtro por mês` |
| 3 | 12 | `feat: registrar sinistro reduz automaticamente a quantidade da ferramenta` |
| 3 | 13 | `docs: testes documentados para todos os endpoints no Postman` |
| 3 | 14 | `docs: README com instruções de instalação e endpoints da API` |

---

> **Dica:** comece cada dia testando os commits do dia anterior no Postman. Confirme que tudo ainda funciona antes de avançar.

*Gerado em: 2026-06-03*
