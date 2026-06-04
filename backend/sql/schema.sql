-- TABELA: tipos de usuário (operador, engenheiro)
CREATE TABLE IF NOT EXISTS tipo_usuario (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(50) NOT NULL
);

-- TABELA: tipos de ferramenta (fresa topo, esférica, etc.)
CREATE TABLE IF NOT EXISTS tipo (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(100) NOT NULL,
  qtdade_min INTEGER NOT NULL DEFAULT 1,
  diametro_mm DECIMAL(8,2),
  altura_mm DECIMAL(8,2),
  material VARCHAR(50)
);

-- TABELA: usuários do sistema
CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  login VARCHAR(50) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  id_tipo_usuario INTEGER NOT NULL REFERENCES tipo_usuario(id)
);

-- TABELA: ferramentas CNC
CREATE TABLE IF NOT EXISTS ferramenta (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  diametro_mm DECIMAL(8,2),
  altura_mm DECIMAL(8,2),
  material VARCHAR(50),
  quantidade INTEGER DEFAULT 0,
  id_tipo INTEGER NOT NULL REFERENCES tipo(id)
);

-- TABELA: sinistros (ferramentas quebradas)
CREATE TABLE IF NOT EXISTS sinistro (
  id SERIAL PRIMARY KEY,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  descricao TEXT,
  id_usuario INTEGER NOT NULL REFERENCES usuario(id),
  id_ferramenta INTEGER NOT NULL REFERENCES ferramenta(id)
);

-- SEEDS: dados iniciais para tipo_usuario
INSERT INTO tipo_usuario (descricao) VALUES ('operador'), ('engenheiro')
ON CONFLICT DO NOTHING;
