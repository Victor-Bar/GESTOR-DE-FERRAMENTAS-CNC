const connection = require('../database/connection');

exports.login = (email, senha, callback) => {

    const sql = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';

    connection.query(
        sql,
        [email, senha],
        callback
    );

};