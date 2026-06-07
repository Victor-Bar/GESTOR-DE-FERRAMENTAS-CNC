## Atividade 5 — Implementação

### Gestor CNC / Ferramentas

**Integrantes**

- Matheus Moraes
- Victor Baratta
---

# 1. Link do Repositório

GitHub: https://github.com/[usuario]/gestor-cnc

---

# 2. Descrição da Implementação

O sistema **Gestor CNC** é uma API REST desenvolvida em Node.js com o framework Express, voltada para o gerenciamento de ferramentas utilizadas em máquinas CNC.

O backend realiza a autenticação de usuários via JWT (JSON Web Token) e controla o acesso às rotas com base no perfil de cada usuário (administrador, engenheiro ou operador).

A aplicação conecta-se a um banco de dados MySQL (**gestor_cnc**) e disponibiliza endpoints para criação, leitura, atualização e remoção de ferramentas e usuários, além de funcionalidades específicas como alertas de estoque baixo e registro de ferramentas quebradas.

---

# 3. Estrutura do Backend

## Controllers

Atualmente, o projeto utiliza as próprias rotas do Express para desempenhar o papel de controllers. Dessa forma, cada arquivo de rota é responsável por receber as requisições HTTP, validar os dados necessários, executar as regras de negócio e retornar as respostas ao cliente.

Como melhoria futura, está prevista a refatoração da arquitetura para uma separação completa em camadas (**Controllers**, **Services**, **Models** e **Routes**), visando maior organização, manutenção e escalabilidade do sistema.

## Services

A camada de serviços encontra-se incorporada às rotas. As principais regras de negócio do sistema, como controle de estoque, registro de ferramentas quebradas, validações de permissões e geração de alertas, são executadas diretamente nos arquivos de rota.

Em versões futuras, essas responsabilidades serão movidas para uma camada específica de Services, permitindo maior reutilização e organização do código.

## Models

O acesso aos dados é realizado diretamente através de consultas SQL parametrizadas utilizando MySQL. Não foi utilizado ORM, pois o objetivo foi manter simplicidade e controle direto sobre as consultas ao banco de dados.

### Entidades

#### usuarios

- id
- nome
- email
- senha
- tipo

#### ferramentas

- id
- tipo
- diametro
- comprimento
- material
- quantidade

#### ferramentas_quebradas

- id
- ferramenta_id
- quantidade

Como evolução da arquitetura, as consultas SQL poderão ser isoladas em arquivos Models específicos para cada entidade.

## Routes

As rotas da aplicação estão organizadas em arquivos separados dentro do diretório `/routes`.

### auth.js

Responsável pela autenticação de usuários e geração de tokens JWT.

### ferramentas.js

Responsável pelo CRUD de ferramentas, controle de estoque, alertas de estoque baixo e registro de ferramentas quebradas.

### usuarios.js

Responsável pelo CRUD de usuários e gerenciamento de permissões, com acesso restrito ao administrador.

---

# 4. CRUDs Desenvolvidos

| Integrante | Entidade | Operações |
|------------|-----------|------------|
| Matheus Moraes | Ferramentas | CREATE, READ, UPDATE, DELETE |
| Victor Baratta | Usuários | CREATE, READ, UPDATE, DELETE |

---

# 5. Funcionalidades Implementadas

## Autenticação com JWT

- Login via e-mail e senha.
- Geração de token JWT.
- Validade do token: 7 dias.
- Rotas protegidas utilizando Bearer Token.

---

## Controle de Permissões por Perfil

### Operador

- Visualizar ferramentas.
- Registrar ferramentas quebradas.

### Engenheiro

- Todas as permissões do Operador.
- Cadastrar ferramentas.
- Editar ferramentas.
- Excluir ferramentas.

### Administrador

- Todas as permissões do Engenheiro.
- Gerenciar usuários do sistema.

---

## Alertas de Estoque Baixo

Endpoint:

GET /ferramentas/alertas

Classificação:

- BAIXO → quantidade = 3
- ALTO → quantidade ≤ 2
- CRÍTICO → quantidade = 0

---

## Registro de Ferramenta Quebrada

Endpoint:

POST /ferramentas/:id/quebrar

Fluxo:

1. Verifica estoque disponível.
2. Reduz a quantidade da ferramenta.
3. Registra a ocorrência na tabela `ferramentas_quebradas`.

---

