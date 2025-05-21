const express = require('express');
const router = express.Router();

const loginRoutes = require('./routes/loginRoutes');
const enderecoRoutes = require('./routes/enderecoRoutes');

// Definindo as rotas
router.use('/login', loginRoutes);
router.use('/endereco', enderecoRoutes);

module.exports = router;