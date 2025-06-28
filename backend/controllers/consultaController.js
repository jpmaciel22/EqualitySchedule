const Medico = require('../models/medicoModel');
const Consulta = require('../models/consultaModel')
const sequelize = require('../database');
const ConsultaAgenda = require('../models/consultaModel');
require('dotenv').config();

exports.criaConsulta = async (req, res, next) => {
  const { codigo, data, descricao, medico_cpf, user } = req.body
  let jaExiste = await Consulta.findOne({ where: { 'codigo': codigo } })
  if (jaExiste) {
    return res.status(401).json({ success: false, message: 'ID de consulta já cadastrado.' })
  }
  await Consulta.create({ codigo, horario: data, id_user: user, id_medico: medico_cpf, descricao });
  return res.status(201).json({ success: true, message: 'Consulta registrada com sucesso.' });
}

exports.getAll = async (req, res, next) => {
  const { id, typeUser } = req.body;

  if (!id || !typeUser) {
    return res.status(400).json({ success: false, message: 'Parâmetros inválidos.' });
  }

  const query = `
    SELECT 
      c.*,
      m.nome AS medico_nome,
      m.especificacao AS medico_especializacao,
      u.nome AS user_nome
    FROM "ConsultaAgendas" c
    LEFT JOIN "Medicos" m ON c.id_medico = m.cpf
    LEFT JOIN "Users" u ON c.id_user = u.cpf
    WHERE ${typeUser === 'cliente' ? 'c.id_user' : 'c.id_medico'} = :id
  `;

  try {
    const consultas = await sequelize.query(query, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT
    });

    if (!consultas || consultas.length === 0) {
      return res.status(404).json({ success: false, message: 'Nenhuma consulta encontrada.' });
    }

    return res.status(200).json({ success: true, data: consultas });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro ao buscar consultas.' });
  }
};

exports.realizada = async (req, res, next) => {
  const { codigo } = req.body
  const consulta = await ConsultaAgenda.findOne({ where: { 'codigo': codigo } });
  consulta.status = 'realizado'
  await consulta.save();
  console.log(req.body)
  res.status(201).json({ success: true, message: 'Consulta atualizada' })
}

exports.getMedicos = async (req, res, next) => {
  const medicos = await Medico.findAll();
  res.status(200).json({ data: medicos });
}