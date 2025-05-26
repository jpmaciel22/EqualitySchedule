require('dotenv').config();
const UserEndereco = require('../models/userEnderecoModel');
const MedicoEndereco = require('../models/medicoEnderecoModel');

exports.createEndereco = async (req, res, next) => {
  try {
    const { rua, cidade, estado, cpf, typeUser } = req.body;

    if (typeUser == 'cliente') {
      await UserEndereco.create({ rua, cidade, estado, id_user: cpf });
      return res.status(201).json({ success: true, message: 'Endereço registrado.' });
    }

    if (typeUser == 'medico') {
      await MedicoEndereco.create({ rua, cidade, estado, id_medico: cpf });
      return res.status(201).json({ success: true, message: 'Endereço registrado.' });
    }

    return res.status(400).json({ success: false, message: 'Tipo de usuário inválido.' });

  } catch (error) {
    return res.status(500).json(error, { success: false, message: 'Algo falhou.' });
  }
}

exports.getAll = async (req, res, next) => {
  const typeUser = req.body.typeUser;
  if (typeUser == 'cliente') {
    const id_user = req.body.cpf
    const enderecos = await UserEndereco.findAll({ where: { 'id_user': id_user } });
    if (!enderecos) {
      return res.status(401).json({ success: false, message: 'Nenhum endereço encontrado.' })
    }
    return res.status(201).json({ success: true, data: enderecos })
  }
  if (typeUser == 'medico') {
    const id_medico = req.body.cpf
    const enderecos = await MedicoEndereco.findAll({ where: { 'id_medico': id_medico } });
    if (!enderecos) {
      return res.status(401).json({ success: false, message: 'Nenhum endereço encontrado.' })
    }
    return res.status(201).json({ success: true, data: enderecos })
  }
  return res.status(500).json({success: false, message: 'Algo falhou.'})
}