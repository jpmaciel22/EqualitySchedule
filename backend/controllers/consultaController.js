const Medico = require('../models/medicoModel');
const User = require('../models/userModel');
const Consulta = require('../models/consultaModel')
const MedEnd = require('../models/medicoEnderecoModel')
const UsEnd = require('../models/userEnderecoModel');
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
    const id = req.body.id
    const typeUser = req.body.typeUser
    if (typeUser == 'cliente') {
    const consultas = await sequelize.query(`
      SELECT 
        c.*,
        m.nome AS medico_nome,
        m.especificacao AS medico_especializacao
      FROM "ConsultaAgendas" c
      LEFT JOIN "Medicos" m ON c.id_medico = m.cpf
      WHERE c.id_user = :id
    `, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT
    });
        if (!consultas) {
            return res.status(401).json({ success: false, message: 'Nenhuma consulta encontrada.' })
        }
        if (id == null) {
            return res.status(500).json({ success: false, message: 'Cpf inválido.' })
        }
        return res.status(200).json({ success: true, data: consultas })
    }
        if (typeUser == 'medico') {
               const consultas = await sequelize.query(`
      SELECT 
        c.*,
        m.nome AS medico_nome,
        m.especificacao AS medico_especializacao
      FROM "ConsultaAgendas" c
      LEFT JOIN "Medicos" m ON c.id_medico = m.cpf
      WHERE m.cpf = :id
    `, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT
    });
        if (!consultas) {
            return res.status(401).json({ success: false, message: 'Nenhuma consulta encontrada.' })
        }
        if (id == null) {
            return res.status(500).json({ success: false, message: 'Cpf inválido.' })
        }
        return res.status(200).json({ success: true, data: consultas })
    }


}
exports.realizada = async (req,res,next) => {
    const {codigo} = req.body
    const consulta = await ConsultaAgenda.findOne({ where: { 'codigo': codigo } });
    consulta.status = 'realizado'
    await consulta.save();
    console.log(req.body)
    res.status(201).json({success: true, message: 'Consulta atualizada'})
}

exports.getMedicos = async (req,res,next) => {
    const medicos = await Medico.findAll();
    res.status(200).json({data: medicos});
}