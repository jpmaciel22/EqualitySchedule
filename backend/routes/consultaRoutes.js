const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');

router.post('/add', consultaController.criaConsulta);
router.post('/queryByParams', consultaController.queryByParams);
router.post('/',consultaController.getAll)
router.post('/realizar',consultaController.realizada)

module.exports = router;