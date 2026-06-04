const { expressjwt: expressJwt } = require('express-jwt');
require('dotenv').config();

// Chave secreta usada para assinar e verificar os tokens JWT
const segredo = process.env.JWT_SECRET;

// Middleware que protege rotas — rejeita requisições sem token válido
// Quando aplicado em uma rota, o Express retorna 401 automaticamente
// se o token estiver ausente ou inválido
const protegerRota = expressJwt({
  secret: segredo,
  algorithms: ['HS256'],
});

module.exports = { protegerRota, segredo };
