const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /auth/login — rota pública, não exige token
router.post('/login', authController.login);

module.exports = router;
