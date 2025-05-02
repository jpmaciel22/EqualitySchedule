const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Definindo rotas de login e registro
router.post('/', loginController.login);
router.post('/register', loginController.register);

module.exports = router; 