const connection = require('../database/connection');

exports.listar = (callback) => {

    const sql = 'SELECT * FROM ferramentas';

    connection.query(sql, callback);

};

exports.buscarAlertas = (callback) => {

    const sql = `
        SELECT *
        FROM ferramentas
        WHERE quantidade <= 3
        ORDER BY quantidade ASC
    `;

    connection.query(sql, callback);

};

exports.buscarPorId = (id, callback) => {

    const sql = 'SELECT * FROM ferramentas WHERE id = ?';

    connection.query(sql, [id], callback);

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

    const sql = `
        INSERT INTO ferramentas
        (tipo, diametro, comprimento, material, quantidade, imagem_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [
            tipo,
            diametro,
            comprimento,
            material,
            quantidade,
            imagem_url
        ],
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

    const sql = `
        UPDATE ferramentas
        SET tipo = ?, diametro = ?, comprimento = ?, material = ?, quantidade = ?, imagem_url = ?
        WHERE id = ?
    `;

    connection.query(
        sql,
        [
            tipo,
            diametro,
            comprimento,
            material,
            quantidade,
            imagem_url,
            id
        ],
        callback
    );

};

exports.excluir = (id, callback) => {

    const sql = 'DELETE FROM ferramentas WHERE id = ?';

    connection.query(sql, [id], callback);

};

exports.atualizarQuantidade = (novaQtd, id, callback) => {

    const sql = `
        UPDATE ferramentas
        SET quantidade = ?
        WHERE id = ?
    `;

    connection.query(sql, [novaQtd, id], callback);

};

exports.registrarQuebra = (id, quantidade, callback) => {

    const sql = `
        INSERT INTO ferramentas_quebradas
        (ferramenta_id, quantidade)
        VALUES (?, ?)
    `;

    connection.query(sql, [id, quantidade], callback);

};

exports.listarQuebras = (callback) => {

    const sql = `
        SELECT
            fq.id,
            fq.ferramenta_id,
            f.tipo,
            f.diametro,
            f.comprimento,
            f.material,
            fq.quantidade,
            fq.data_quebra
        FROM ferramentas_quebradas fq
        INNER JOIN ferramentas f
            ON fq.ferramenta_id = f.id
        ORDER BY fq.data_quebra DESC, fq.id DESC
    `;

    connection.query(sql, callback);

};
