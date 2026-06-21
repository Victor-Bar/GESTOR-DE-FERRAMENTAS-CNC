const ferramentaModel = require('../models/ferramentaModel');

exports.listar = (callback) => {
    ferramentaModel.listar(callback);
};

exports.buscarAlertas = (callback) => {
    ferramentaModel.buscarAlertas(callback);
};

exports.buscarPorId = (id, callback) => {
    ferramentaModel.buscarPorId(id, callback);
};

exports.cadastrar = (
    tipo,
    diametro,
    comprimento,
    material,
    quantidade,
    callback
) => {
    ferramentaModel.cadastrar(
        tipo,
        diametro,
        comprimento,
        material,
        quantidade,
        callback
    );
};

exports.atualizar = (
    tipo,
    diametro,
    comprimento,
    material,
    quantidade,
    id,
    callback
) => {
    ferramentaModel.atualizar(
        tipo,
        diametro,
        comprimento,
        material,
        quantidade,
        id,
        callback
    );
};

exports.excluir = (id, callback) => {
    ferramentaModel.excluir(id, callback);
};

exports.atualizarQuantidade = (novaQtd, id, callback) => {
    ferramentaModel.atualizarQuantidade(novaQtd, id, callback);
};

exports.registrarQuebra = (id, quantidade, callback) => {
    ferramentaModel.registrarQuebra(id, quantidade, callback);
};

/*vamos manter o services caso futuramente precisamos enserir 
regras de negocio assim da para deixar mais organizado*/