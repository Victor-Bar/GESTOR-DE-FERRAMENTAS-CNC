const { expressjwt } = require('express-jwt');

// chave secreta do token
const segredo = 'chave_secreta_da_api';

// middleware que verifica se o usuário está logado
const protegerRota = expressjwt({
  secret: segredo,
  algorithms: ['HS256'],
  requestProperty: 'auth', // dados do token ficam em req.auth
  getToken: (req) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }
});

module.exports = {
  segredo,
  protegerRota
};