const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');

router.post('/', consultaController.criaConsulta);
router.post('/queryByParams', consultaController.queryByParams);

module.exports = router;