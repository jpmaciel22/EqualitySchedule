const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');

router.post('/', enderecoController.createEndereco);
router.post('/get', enderecoController.getAll);

module.exports = router;