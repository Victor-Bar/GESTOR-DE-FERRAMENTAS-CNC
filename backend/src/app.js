const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares globais — executados em toda requisição
app.use(cors());          // permite requisições de outros domínios (frontend)
app.use(express.json());  // transforma o body JSON em objeto JavaScript

// Rotas
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

// Middleware de erros — SEMPRE por último
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
