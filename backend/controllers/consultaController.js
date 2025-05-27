const Medico = require('../models/medicoModel');
const User = require('../models/userModel');
const Consulta = require('../models/consultaModel')
const MedEnd = require('../models/medicoEnderecoModel')
const UsEnd = require('../models/userEnderecoModel');
const sequelize = require('../database');
const ConsultaAgenda = require('../models/consultaModel');
require('dotenv').config();

exports.criaConsulta = async (req, res, next) => {
    const { codigo, data, descricao, medico, user } = req.body
    let jaExiste = await Consulta.findOne({ where: { 'codigo': codigo } })
    if (jaExiste) {
        return res.status(401).json({ success: false, message: 'ID de consulta já cadastrado.' })
    }
    await Consulta.create({ codigo, horario: data, id_user: user, id_medico: medico, descricao });
    return res.status(201).json({ success: true, message: 'Consulta registrada com sucesso.' });
}

exports.queryByParams = async (req, res, next) => {
    try {
        const pesquisa = req.body;
        const medicos = await sequelize.query(
            'SELECT * FROM Medico WHERE nome LIKE :pesquisa OR regiao LIKE :pesquisa', {
            replacements: { pesquisa: `%${pesquisa}%` },
            type: sequelize.QueryTypes.SELECT
        }
        );

        console.log("Medicos: " + medicos);
        if (!medicos) return res.status(400).json(err, { success: false, message: 'Médico não encontrado.' });

        return res.status(201).json({ success: true, message: 'Médico encontrado.' })
    } catch (err) {
        return res.status(500).json(err, { success: false, message: 'Algo falhou.' });
    }
}

exports.getAll = async (req, res, next) => {
    const id_user = req.body.id_user
    const consultas = await ConsultaAgenda.findAll({ where: { 'id_user': id_user } });
    if (!consultas) {
        return res.status(401).json({ success: false, message: 'Nenhuma consulta encontrada.' })
    }
    if (id_user == null) {
        return res.status(500).json({ success: false, message: 'Cpf inválido.' })
    }
    return res.status(201).json({ success: true, data: consultas })
}