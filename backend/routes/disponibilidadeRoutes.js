const express = require('express');
const router = express.Router();
const disponibilidadeController = require('../controllers/disponibilidadeController');

router.post('/criar', disponibilidadeController.criarDisponibilidade);
router.post('/get', disponibilidadeController.getDisponibilidades);
router.post('/horarios', disponibilidadeController.getHorariosDisponiveis);
router.post('/deletar', disponibilidadeController.deletarDisponibilidade);

module.exports = router;