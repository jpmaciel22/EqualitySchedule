const express = require('express');
const router = express.Router();

const loginRoutes = require('./routes/loginRoutes');
const enderecoRoutes = require('./routes/enderecoRoutes');
const consultaRoutes = require('./routes/consultaRoutes');

// Definindo as rotas
router.use('/login', loginRoutes);
router.use('/endereco', enderecoRoutes);
router.use('/tasks', consultaRoutes);

module.exports = router;