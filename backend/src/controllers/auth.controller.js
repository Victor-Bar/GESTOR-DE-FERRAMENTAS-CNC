const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/connection');
const { segredo } = require('../middleware/auth');

async function login(req, res, next) {
  try {
    const { login, senha } = req.body;

    // Validação básica — os dois campos são obrigatórios
    if (!login || !senha) {
      return res.status(400).json({ erro: 'Login e senha são obrigatórios' });
    }

    // Busca o usuário pelo login no banco
    // Não filtramos pela senha aqui — o bcrypt faz essa comparação depois
    const { rows } = await db.query(
      'SELECT * FROM usuario WHERE login = $1',
      [login]
    );

    const usuario = rows[0];

    // Se não encontrou nenhum usuário com esse login
    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    // Compara a senha enviada com o hash armazenado no banco
    // bcrypt.compare faz isso de forma segura
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    // Gera o token JWT com dados básicos do usuário
    // NUNCA incluir a senha no token, mesmo que seja hash
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
