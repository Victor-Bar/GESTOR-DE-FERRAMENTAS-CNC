const usuariosService = require('../services/usuariosService');

exports.listar = (req, res) => {

    usuariosService.listar((erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao buscar usuários'
            });
        }

        res.json(resultados);

    });

};

exports.buscarPorId = (req, res) => {

    const id = req.params.id;

    usuariosService.buscarPorId(id, (erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao buscar usuário'
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        res.json(resultados[0]);

    });

};

exports.cadastrar = (req, res) => {

    const {
        nome,
        email,
        senha,
        tipo
    } = req.body;

    if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({
            erro: 'Preencha todos os campos'
        });
    }

    usuariosService.cadastrar(
        nome,
        email,
        senha,
        tipo,
        (erro, resultado) => {

            if (erro) {
                return res.status(500).json({
                    erro: 'Erro ao cadastrar usuário'
                });
            }

            res.status(201).json({
                mensagem: 'Usuário criado com sucesso',
                idInserido: resultado.insertId
            });

        }
    );

};

exports.atualizar = (req, res) => {

    const id = req.params.id;

    const {
        nome,
        email,
        senha,
        tipo
    } = req.body;

    usuariosService.atualizar(
        nome,
        email,
        senha,
        tipo,
        id,
        (erro) => {

            if (erro) {
                return res.status(500).json({
                    erro: 'Erro ao atualizar usuário'
                });
            }

            res.json({
                mensagem: 'Usuário atualizado com sucesso'
            });

        }
    );

};

exports.excluir = (req, res) => {

    const id = req.params.id;

    usuariosService.excluir(id, (erro) => {

        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao excluir usuário'
            });
        }

        res.json({
            mensagem: 'Usuário removido com sucesso',
            idRemovido: id
        });

    });

};