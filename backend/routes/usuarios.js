const express = require('express');

const router = express.Router();

const { protegerRota } = require('../middleware/auth');
const { apenasAdministrador } = require('../middleware/permissoes');

const controller = require('../controllers/usuariosController');

router.get(
    '/',
    protegerRota,
    apenasAdministrador,
    controller.listar
);

router.get(
    '/:id',
    protegerRota,
    apenasAdministrador,
    controller.buscarPorId
);

router.post(
    '/',
    protegerRota,
    apenasAdministrador,
    controller.cadastrar
);

router.put(
    '/:id',
    protegerRota,
    apenasAdministrador,
    controller.atualizar
);

router.delete(
    '/:id',
    protegerRota,
    apenasAdministrador,
    controller.excluir
);

module.exports = router;