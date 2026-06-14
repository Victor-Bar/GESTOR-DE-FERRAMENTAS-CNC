const usuarioModel = require('../models/usuarioModel');

exports.listar = (callback) => {
    usuarioModel.listar(callback);
};

exports.buscarPorId = (id, callback) => {
    usuarioModel.buscarPorId(id, callback);
};

exports.cadastrar = (nome, email, senha, tipo, callback) => {
    usuarioModel.cadastrar(nome, email, senha, tipo, callback);
};

exports.atualizar = (nome, email, senha, tipo, id, callback) => {
    usuarioModel.atualizar(nome, email, senha, tipo, id, callback);
};

exports.excluir = (id, callback) => {
    usuarioModel.excluir(id, callback);
};