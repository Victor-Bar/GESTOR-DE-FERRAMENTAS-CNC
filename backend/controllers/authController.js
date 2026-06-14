const jwt = require('jsonwebtoken');

const authService = require('../services/authService');
const { segredo } = require('../middleware/auth');

exports.login = (req, res) => {

    const { email, senha } = req.body;

    authService.login(email, senha, (erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao autenticar usuário'
            });
        }

        if (resultados.length === 0) {
            return res.status(401).json({
                erro: 'E-mail ou senha inválidos'
            });
        }

        const usuario = resultados[0];

        const token = jwt.sign(
            {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo
            },
            segredo,
            {
                expiresIn: '7d'
            }
        );

        res.json({
            mensagem: 'Login realizado com sucesso',
            token: token
        });

    });

};