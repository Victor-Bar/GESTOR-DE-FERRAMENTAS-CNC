# Atividade 5 — Plano de Implementação

## Gestor de Ferramentas CNC

> **Documento de referência centralizado** — contém a análise completa do que precisa ser feito para entregar a Atividade 5 do Projeto Integrado.

---

## 1. Contexto do Projeto

- **Nome:** Gestor de Ferramentas CNC
- **Integrantes:** Victor Baratta e Matheus Moraes
- **Disciplina principal:** Desenvolvimento Web Avançado
- **Repositório:** https://github.com/Victor-Bar/GESTOR-DE-FERRAMENTAS-CNC
- **Modelo de processo adotado:** Kanban (Ágil)
- **Stack definida:**
  - Backend: Node.js + Express
  - Banco de dados: PostgreSQL
  - Frontend: HTML/CSS/JS (ou React)
  - Autenticação: JWT

---

## 2. Requisitos Obrigatórios da Atividade 5

A Atividade 5 exige que o sistema funcional seja entregue com:

| # | Requisito | Status atual |
|---|-----------|--------------|
| 1 | API REST em Node.js | ⚠️ Parcial (existe mas sem DB) |
| 2 | Autenticação de usuários (JWT) | ❌ Ausente |
| 3 | Conexão com banco de dados | ❌ Ausente (usa JSON) |
| 4 | Pelo menos 4 CRUDs (1 por aluno) | ❌ Só 1 existe |
| 5 | Organização em camadas (controller/service/repository) | ❌ Tudo nas rotas |
| 6 | Tratamento de erros | ⚠️ Básico |
| 7 | Integração entre módulos | ❌ Não há |
| 8 | Testes básicos documentados | ❌ Ausentes |
| 9 | Implementação incremental (3+ semanas no Git) | ⚠️ Atenção |

---

## 3. Entidades do Sistema (baseado no DER)

| Entidade | Atributos | Responsabilidade |
|----------|-----------|------------------|
| **ferramenta** | id, nome, diametro_mm, altura_mm, material, vida_util, id_tipo | Cadastro físico das fresas/brocas |
| **tipo** | id, descricao, qtdade_min, diametro_mm, altura_mm, material | Categoria da ferramenta (Topo, Esférica) |
| **usuario** | id, nome, login, senha, id_tipo_usuario | Quem acessa o sistema |
| **tipo_usuario** | id, descricao | Perfil (operador, engenheiro) |
| **sinistro** | id, data, descricao, id_usuario, id_ferramenta | Registro de quebra — **reduz estoque** |
| **vida_util** | id, data, porcentagem_uso, id_usuario, id_ferramenta | Histórico de uso |

### Relações importantes
- `ferramenta.id_tipo` → `tipo.id`
- `usuario.id_tipo_usuario` → `tipo_usuario.id`
- `sinistro.id_ferramenta` → `ferramenta.id`
- `sinistro.id_usuario` → `usuario.id`
- `vida_util.id_ferramenta` → `ferramenta.id`

---

## 4. Divisão dos CRUDs por Integrante

Como a equipe tem **2 integrantes**, o mínimo são 2 CRUDs próprios, mas o enunciado pede **pelo menos 4 CRUDs no total**. Sugestão de divisão:

| CRUD | Responsável sugerido | Endpoint base |
|------|---------------------|---------------|
| **ferramentas** | Victor | `/ferramentas` |
| **tipos** | Victor | `/tipos` |
| **usuarios** | Matheus | `/usuarios` |
| **sinistros** | Matheus | `/sinistros` |

> **Importante:** cada integrante deve fazer commits regulares no GitHub do seu CRUD — o professor avalia individualmente pela frequência de commits.

---

## 5. Estrutura de Pastas Esperada (Arquitetura em Camadas)

```
backend/
├── src/
│   ├── database/
│   │   └── connection.js          # conexão PostgreSQL
│   ├── middleware/
│   │   ├── auth.js                # JWT middleware
│   │   └── errorHandler.js        # tratamento centralizado de erros
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
│   │   └── sinistro.service.js   # contém a regra "reduzir estoque"
│   ├── repositories/
│   │   ├── ferramenta.repository.js
│   │   ├── tipo.repository.js
│   │   ├── usuario.repository.js
│   │   └── sinistro.repository.js
│   ├── app.js
│   └── server.js
├── sql/
│   └── schema.sql                 # script de criação das tabelas
├── tests/
│   └── testes.md                  # documentação dos testes feitos
├── .env                           # variáveis de ambiente (não commitar)
├── .env.example                   # exemplo (commitar)
├── .gitignore
└── package.json
```

### Responsabilidade de cada camada

- **routes/** → só mapeia URL para o método do controller. Sem lógica.
- **controllers/** → recebe `req`/`res`, valida entrada, chama o service, retorna resposta.
- **services/** → regra de negócio. Não conhece HTTP nem SQL diretamente.
- **repositories/** → única camada que executa queries no banco.
- **middleware/** → funções de uso transversal (auth, erros).

---

## 6. Endpoints Necessários

### Autenticação
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/login` | Não | Login (retorna JWT) |

### Ferramentas
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/ferramentas` | Não | Lista todas |
| GET | `/ferramentas/:id` | Não | Detalhe de uma |
| POST | `/ferramentas` | Sim | Cadastra |
| PUT | `/ferramentas/:id` | Sim | Atualiza |
| DELETE | `/ferramentas/:id` | Sim | Remove |
| GET | `/ferramentas/alertas` | Sim | Lista ferramentas abaixo da qtd mínima |

### Tipos
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/tipos` | Não | Lista |
| POST | `/tipos` | Sim | Cadastra |
| PUT | `/tipos/:id` | Sim | Atualiza |
| DELETE | `/tipos/:id` | Sim | Remove |

### Usuários
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/usuarios` | Sim | Lista |
| POST | `/usuarios` | Não | Cadastra (registro) |
| PUT | `/usuarios/:id` | Sim | Atualiza |
| DELETE | `/usuarios/:id` | Sim | Remove |

### Sinistros (ferramentas quebradas)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/sinistros` | Sim | Lista histórico |
| GET | `/sinistros?mes=Janeiro` | Sim | Filtra por mês |
| POST | `/sinistros` | Sim | Registra quebra (reduz estoque) |
| DELETE | `/sinistros/:id` | Sim | Remove registro |

---

## 7. Regras de Negócio Críticas (para Services)

Essas são as regras que o enunciado pede que estejam **integradas entre módulos**:

1. **Ao registrar um sinistro**, o `sinistro.service` deve:
   - Validar que a ferramenta existe
   - Validar que o usuário existe
   - Chamar o `ferramenta.repository` para **reduzir a quantidade**
   - Salvar o sinistro no banco

2. **Ao cadastrar uma ferramenta**, validar que o `id_tipo` informado existe na tabela `tipo`.

3. **Ao cadastrar um usuário**, validar que o `id_tipo_usuario` existe.

4. **Ao listar alertas**, comparar `ferramenta.quantidade` com `tipo.qtdade_min` e retornar as que estão abaixo.

5. **Senha do usuário** deve ser armazenada com hash (bcrypt) — boa prática que melhora a nota.

---

## 8. Plano de Implementação Faseado

### Fase 1 — Infraestrutura (Semana 1)
**Objetivo:** preparar a base para todos trabalharem em cima.

- [ ] Instalar dependências: `express`, `pg`, `jsonwebtoken`, `bcrypt`, `dotenv`, `cors`
- [ ] Criar `.env` e `.env.example`
- [ ] Criar `database/connection.js` (PostgreSQL)
- [ ] Criar `sql/schema.sql` com as 6 tabelas + FKs
- [ ] Configurar `app.js` com middlewares básicos (json, cors, errorHandler)
- [ ] Criar estrutura de pastas vazias (routes/controllers/services/repositories)

### Fase 2 — Autenticação (Semana 1)
**Objetivo:** sem isso não dá para proteger nenhuma rota.

- [ ] Criar middleware `auth.js` (verifica JWT)
- [ ] Criar `auth.controller.js` + `auth.routes.js` com `POST /auth/login`
- [ ] Hash de senha com bcrypt
- [ ] Testar login no Postman

### Fase 3 — CRUDs em camadas (Semanas 2 e 3)
**Objetivo:** cada integrante implementa seus CRUDs seguindo o padrão.

**Victor:**
- [ ] CRUD de `tipos` (mais simples — começar por aqui)
- [ ] CRUD de `ferramentas` (depende de tipos)
- [ ] Endpoint de alertas

**Matheus:**
- [ ] CRUD de `usuarios` (depende de tipo_usuario — pode ser seed fixo)
- [ ] CRUD de `sinistros` (depende de usuario + ferramenta)
- [ ] Integração: registrar sinistro reduz quantidade da ferramenta

### Fase 4 — Polimento (Semana 3)
- [ ] Tratamento centralizado de erros
- [ ] Validação de entradas
- [ ] Documentar todos os testes em `tests/testes.md` (prints do Postman)
- [ ] README com instruções de instalação

---

## 9. Padrão de Código por Camada (Template)

Use este padrão para todos os CRUDs. Exemplo com `tipo`:

### `repositories/tipo.repository.js`
```javascript
const connection = require('../database/connection');

async function listarTodos() {
  const { rows } = await connection.query('SELECT * FROM tipo');
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await connection.query('SELECT * FROM tipo WHERE id = $1', [id]);
  return rows[0];
}

async function criar(dados) {
  const { descricao, qtdade_min, diametro_mm, altura_mm, material } = dados;
  const sql = `INSERT INTO tipo (descricao, qtdade_min, diametro_mm, altura_mm, material)
               VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const { rows } = await connection.query(sql, [descricao, qtdade_min, diametro_mm, altura_mm, material]);
  return rows[0];
}

module.exports = { listarTodos, buscarPorId, criar /* ... */ };
```

### `services/tipo.service.js`
```javascript
const tipoRepository = require('../repositories/tipo.repository');

async function listar() {
  return await tipoRepository.listarTodos();
}

async function cadastrar(dados) {
  if (!dados.descricao) {
    throw new Error('Descrição é obrigatória');
  }
  return await tipoRepository.criar(dados);
}

module.exports = { listar, cadastrar /* ... */ };
```

### `controllers/tipo.controller.js`
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

async function cadastrar(req, res, next) {
  try {
    const novo = await tipoService.cadastrar(req.body);
    res.status(201).json(novo);
  } catch (erro) {
    next(erro);
  }
}

module.exports = { listar, cadastrar /* ... */ };
```

### `routes/tipo.routes.js`
```javascript
const express = require('express');
const router = express.Router();
const tipoController = require('../controllers/tipo.controller');
const { protegerRota } = require('../middleware/auth');

router.get('/', tipoController.listar);
router.post('/', protegerRota, tipoController.cadastrar);

module.exports = router;
```

---

## 10. Documentação de Testes

Criar `backend/tests/testes.md` com:

```markdown
## Teste 1 — Login com credenciais válidas
**Endpoint:** POST /auth/login
**Body:** { "login": "victor", "senha": "1234" }
**Resultado esperado:** 200 + token JWT
**Resultado obtido:** [print do Postman]

## Teste 2 — Cadastrar ferramenta sem token
**Endpoint:** POST /ferramentas
**Resultado esperado:** 401 Unauthorized
...
```

Mínimo: 1 teste por endpoint (cerca de 15 testes).

---

## 11. Cuidados com o Git

> ⚠️ O professor avalia individualmente pelos commits.

- [ ] **Cada integrante** faz commits do seu próprio CRUD
- [ ] **Cadência:** distribuir o código em pelo menos 3 semanas
- [ ] Commits pequenos e descritivos (ex: `feat: cria repository de tipo`)
- [ ] **Não fazer commits enormes** no final — gera penalização

---

## 12. Checklist Final de Entrega

Antes de entregar, verificar:

- [ ] Servidor sobe sem erro (`npm run dev`)
- [ ] Banco está conectando
- [ ] Login retorna token JWT
- [ ] Os 4 CRUDs funcionam (testar todos no Postman)
- [ ] Registrar sinistro reduz a quantidade da ferramenta (integração)
- [ ] Rotas de escrita exigem token (testar sem token = 401)
- [ ] Estrutura em camadas está aparente no código
- [ ] `tests/testes.md` está preenchido com prints
- [ ] README com instruções claras de como rodar
- [ ] `.env` no `.gitignore`, `.env.example` commitado
- [ ] Cada integrante tem commits visíveis no GitHub

---

## 13. Referência Externa

O projeto de exemplo da professora está em:
`C:\Users\vitin\Desktop\ContextoProjeto\26052026_api-express\26052026_api-express`

Usar como referência para:
- Estrutura do `database/connection.js`
- Estrutura do `middleware/auth.js` (JWT)
- Estrutura do endpoint de login

**Atenção:** o projeto de exemplo NÃO usa camadas — não copiar essa parte. A Atividade 5 exige separação em controller/service/repository.

---

## 14. Próximos Passos Imediatos

1. **Decidir banco:** PostgreSQL (definido na Atividade 1) ou MySQL (mais simples se for seguir o exemplo)
2. **Criar `.gitignore` e `.env.example`**
3. **Começar pela Fase 1** (infraestrutura)
4. **Cada integrante escolhe quais 2 CRUDs vai assumir** e abre suas próprias issues/cards no Kanban
