const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');

router.post('/', consultaController.criaConsulta);

module.exports = router;