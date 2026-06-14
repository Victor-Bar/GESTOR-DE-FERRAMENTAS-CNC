const connection = require('../database/connection');

exports.listar = (callback) => {
    const sql = 'SELECT id, nome, email, tipo FROM usuarios';
    connection.query(sql, callback);
};

exports.buscarPorId = (id, callback) => {
    const sql = `
        SELECT id, nome, email, tipo
        FROM usuarios
        WHERE id = ?
    `;

    connection.query(sql, [id], callback);
};

exports.cadastrar = (nome, email, senha, tipo, callback) => {
    const sql = `
        INSERT INTO usuarios
        (nome, email, senha, tipo)
        VALUES (?, ?, ?, ?)
    `;

    connection.query(sql, [nome, email, senha, tipo], callback);
};

exports.atualizar = (nome, email, senha, tipo, id, callback) => {
    const sql = `
        UPDATE usuarios
        SET
            nome = ?,
            email = ?,
            senha = ?,
            tipo = ?
        WHERE id = ?
    `;

    connection.query(sql, [nome, email, senha, tipo, id], callback);
};

exports.excluir = (id, callback) => {
    const sql = 'DELETE FROM usuarios WHERE id = ?';
    connection.query(sql, [id], callback);
};

exports.buscarPorEmailESenha = (email, senha, callback) => {
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    connection.query(sql, [email, senha], callback);
};