const express = require('express');

const router = express.Router();

const connection = require('../database/connection');
const { protegerRota } = require('../middleware/auth');
const { apenasEngenheiroOuAdministrador} = require('../middleware/permissoes');
const controller =require('../controllers/ferramentasController');




// LISTAR TODAS AS FERRAMENTAS

router.get(
    '/',
    protegerRota,
    controller.listar
);



// ALERTAS (IMPORTANTE: ANTES DO /:id)

router.get(
    '/alertas',
    protegerRota,
    controller.alertas
);


// BUSCAR POR ID

router.get(
    '/:id',
    protegerRota,
    controller.buscarPorId
);



// CADASTRAR

router.post(
    '/',
    protegerRota,
    apenasEngenheiroOuAdministrador,
    controller.cadastrar
);


// ATUALIZAR

router.put('/:id', protegerRota,  apenasEngenheiroOuAdministrador,(req, res) => {

    const id = req.params.id;

    const {
        tipo,
        diametro,
        comprimento,
        material,
        quantidade
    } = req.body;

    if (!id) {
        return res.status(400).json({
            erro: 'ID obrigatório'
        });
    }

    const sql = `
        UPDATE ferramentas
        SET tipo = ?, diametro = ?, comprimento = ?, material = ?, quantidade = ?
        WHERE id = ?
    `;

    connection.query(sql,
        [tipo, diametro, comprimento, material, quantidade, id],
        (erro) => {

            if (erro) {
                return res.status(500).json({
                    erro: 'Erro ao atualizar ferramenta'
                });
            }

            res.json({
                mensagem: 'Ferramenta atualizada com sucesso'
            });

        }
    );

});



// EXCLUIR

router.delete('/:id', protegerRota, apenasEngenheiroOuAdministrador, (req, res) => {

    const id = req.params.id;

    const sql = 'DELETE FROM ferramentas WHERE id = ?';

    connection.query(sql, [id], (erro) => {

        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao remover ferramenta'
            });
        }

        res.json({
            mensagem: 'Ferramenta removida com sucesso',
            idRemovido: id
        });

    });

});



// QUEBRAR FERRAMENTA 

router.post('/:id/quebrar', protegerRota, (req, res) => {

    const id = req.params.id;
    const { quantidade } = req.body;

    if (!quantidade || quantidade <= 0) {
        return res.status(400).json({
            erro: 'Quantidade inválida'
        });
    }

    const sqlBusca = 'SELECT * FROM ferramentas WHERE id = ?';

    connection.query(sqlBusca, [id], (erro, resultados) => {

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

        const ferramenta = resultados[0];

        if (ferramenta.quantidade < quantidade) {
            return res.status(400).json({
                erro: 'Estoque insuficiente'
            });
        }

        const novaQtd = ferramenta.quantidade - quantidade;

        const sqlUpdate = `
            UPDATE ferramentas
            SET quantidade = ?
            WHERE id = ?
        `;

        connection.query(sqlUpdate, [novaQtd, id], (erro2) => {

            if (erro2) {
                return res.status(500).json({
                    erro: 'Erro ao atualizar estoque'
                });
            }

            const sqlInsert = `
                INSERT INTO ferramentas_quebradas
                (ferramenta_id, quantidade)
                VALUES (?, ?)
            `;

            connection.query(sqlInsert, [id, quantidade]);

            return res.json({
                mensagem: 'Ferramenta registrada como quebrada',
                ferramenta_id: id,
                quantidade_quebrada: quantidade,
                estoque_atual: novaQtd
            });

        });

    });

});

module.exports = router;