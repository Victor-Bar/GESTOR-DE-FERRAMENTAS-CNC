const connection = require('../database/connection');

exports.listar = (req, res) => {

    const sql = 'SELECT * FROM ferramentas';

    connection.query(sql, (erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao buscar ferramentas'
            });
        }

        res.status(200).json(resultados);

    });

};