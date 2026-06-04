// Middleware centralizado de tratamento de erros
// O Express identifica como handler de erro por ter 4 parâmetros (err, req, res, next)
// IMPORTANTE: deve ser registrado por último no app.js
function errorHandler(err, req, res, next) {
  console.error('Erro capturado:', err.message);

  // Token JWT ausente ou inválido
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ erro: 'Token inválido ou ausente' });
  }

  // Erros lançados pelos services com status definido (400, 404, etc.)
  if (err.status) {
    return res.status(err.status).json({ erro: err.message });
  }

  // Erro do PostgreSQL: chave estrangeira violada (ex: id_tipo inexistente)
  if (err.code === '23503') {
    return res.status(400).json({ erro: 'Registro relacionado não existe no banco' });
  }

  // Erro do PostgreSQL: valor duplicado (ex: login já cadastrado)
  if (err.code === '23505') {
    return res.status(400).json({ erro: 'Já existe um registro com esses dados' });
  }

  // Erro genérico — nunca expor detalhes internos para o cliente
  res.status(500).json({ erro: 'Erro interno do servidor' });
}

module.exports = errorHandler;
