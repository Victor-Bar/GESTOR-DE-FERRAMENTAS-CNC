const { Pool } = require('pg');
require('dotenv').config();

// Pool é um conjunto de conexões reutilizáveis com o banco
// É mais eficiente que abrir e fechar uma conexão a cada requisição
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Testa a conexão assim que o servidor sobe
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  console.log('Banco de dados conectado!');
  release(); // devolve a conexão para o pool após o teste
});

module.exports = pool;
