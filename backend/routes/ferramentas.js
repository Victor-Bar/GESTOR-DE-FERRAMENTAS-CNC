const express = require('express');

const router = express.Router();

const connection = require('../database/connection');
const { protegerRota } = require('../middleware/auth');
const { apenasEngenheiroOuAdministrador} = require('../middleware/permissoes');
const controller =require('../controllers/ferramentasController');

router.get(
    '/quebras',
    protegerRota,
    controller.listarQuebras
);


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

router.put(
    '/:id',
    protegerRota,
    apenasEngenheiroOuAdministrador,
    controller.atualizar
);



// EXCLUIR

router.delete(
    '/:id',
    protegerRota,
    apenasEngenheiroOuAdministrador,
    controller.excluir
);



// QUEBRAR FERRAMENTA 

router.post(
    '/:id/quebrar',
    protegerRota,
    controller.quebrar
);



module.exports = router;