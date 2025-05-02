const express = require('express');
const router = express.Router();
const medController = require('../controllers/medController');

// Definindo rotas de login e registro
router.post('/', medController.login);
router.post('/register', medController.register);

module.exports = router; 