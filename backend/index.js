const express = require('express');
const cors = require('cors');

const app = express();

const authRoutes = require('./routes/auth');
const routerFerramentas = require('./routes/ferramentas');
const usuariosRoutes = require('./routes/usuarios');

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/ferramentas', routerFerramentas);
app.use('/usuarios', usuariosRoutes);

app.listen(3000, () => {
    console.log("Servidor express executando na porta 3000\n http://localhost:3000");
});