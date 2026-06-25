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
    imagem_url,
    callback
) => {
    ferramentaModel.cadastrar(
        tipo,
        diametro,
        comprimento,
        material,
        quantidade,
        imagem_url,
        callback
    );
};

exports.atualizar = (
    tipo,
    diametro,
    comprimento,
    material,
    quantidade,
    imagem_url,
    id,
    callback
) => {
    ferramentaModel.atualizar(
        tipo,
        diametro,
        comprimento,
        material,
        quantidade,
        imagem_url,
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

exports.listarQuebras = (callback) => {
    ferramentaModel.listarQuebras(callback);
};
