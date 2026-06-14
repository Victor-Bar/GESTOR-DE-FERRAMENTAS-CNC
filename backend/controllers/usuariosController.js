const connection = require('../database/connection');


exports.listar = (req, res) => {

    const sql = 'SELECT id, nome, email, tipo FROM usuarios';

    connection.query(sql, (erro, resultados) => {

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

    const sql = `
        SELECT id, nome, email, tipo
        FROM usuarios
        WHERE id = ?
    `;

    connection.query(sql, [id], (erro, resultados) => {

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

    const sql = `
        INSERT INTO usuarios
        (nome, email, senha, tipo)
        VALUES (?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [nome, email, senha, tipo],
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

    const sql = `
        UPDATE usuarios
        SET
            nome = ?,
            email = ?,
            senha = ?,
            tipo = ?
        WHERE id = ?
    `;

    connection.query(
        sql,
        [
            nome,
            email,
            senha,
            tipo,
            id
        ],
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

    const sql = 'DELETE FROM usuarios WHERE id = ?';

    connection.query(sql, [id], (erro) => {

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