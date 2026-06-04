const app = require('./app');
require('dotenv').config();
require('./database/connection'); // inicia a conexão com o banco

// Lê a porta do arquivo .env, ou usa 3000 como padrão
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
