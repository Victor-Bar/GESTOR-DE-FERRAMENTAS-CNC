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

exports.alertas = (req, res) => {

    const sql = `
        SELECT *
        FROM ferramentas
        WHERE quantidade <= 3
        ORDER BY quantidade ASC
    `;

    connection.query(sql, (erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao buscar alertas'
            });
        }

        const alertas = resultados.map(f => {

            let nivel = 'OK';

            if (f.quantidade === 0) {
                nivel = 'CRÍTICO';
            } else if (f.quantidade <= 2) {
                nivel = 'ALTO';
            } else if (f.quantidade <= 3) {
                nivel = 'BAIXO';
            }

            return {
                ...f,
                nivel_alerta: nivel
            };
        });

        res.json({
            total_alertas: alertas.length,
            ferramentas: alertas
        });

    });

};

exports.buscarPorId = (req, res) => {

    const id = req.params.id;

    const sql = 'SELECT * FROM ferramentas WHERE id = ?';

    connection.query(sql, [id], (erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao buscar ferramenta'
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                erro: 'Ferramenta não encontrada'
            });
        }

        res.status(200).json(resultados[0]);

    });
    };

    exports.cadastrar = (req, res) => {

    const {
        tipo,
        diametro,
        comprimento,
        material,
        quantidade
    } = req.body;

    if (!tipo || !diametro || !comprimento || !material || !quantidade) {
        return res.status(400).json({
            erro: 'Preencha todos os campos'
        });
    }

    const sql = `
        INSERT INTO ferramentas
        (tipo, diametro, comprimento, material, quantidade)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [tipo, diametro, comprimento, material, quantidade],
        (erro, resultado) => {

            if (erro) {
                return res.status(500).json({
                    erro: 'Erro ao inserir ferramenta'
                });
            }

            res.status(201).json({
                mensagem: 'Ferramenta cadastrada com sucesso',
                idInserido: resultado.insertId
            });

        }
    );

};

