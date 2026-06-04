const mysql = require('mysql2');

const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database : 'gestor_cnc'
    });

connection.connect((error) =>{
    if(error){
        console.log("Erro ao conectar no banco de dados");
        return;
    }
    console.log("Conectado ao MySQL");
});
module.exports = connection;