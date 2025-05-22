const Medico = require('../models/medicoModel');
const User = require('../models/userModel');
const Consulta = require('../models/consultaModel')
const MedEnd = require('../models/medicoEnderecoModel')
const UsEnd = require('../models/userEnderecoModel');
const sequelize = require('../database');
require('dotenv').config();

exports.criaConsulta = async (req, res, next) => {
    try{
        const {codigo, horario, id_user, id_medico, descricao} = req.body
        await Consulta.create({codigo, horario, id_user, id_medico, descricao});
        return res.status(201).json({ success: true, message: 'Consulta registrada com sucesso.' });
    }
    catch(err){
        return res.status(500).json(err, { success: false ,message: 'Algo falhou.' });
    }
}

exports.queryByParams = async (req, res, next) => {
    try {
        const medicoAlvo = req.body.medico;
        const medicos = await sequelize.query(
            'SELECT * FROM Medico WHERE nome LIKE ?', {
                replacements: [`%${medicoAlvo}%`],
                type: sequelize.QueryTypes.SELECT
            }
        );

        console.log("Medicos: " + medicos);

        if (!medicos) return res.status(400).json(err, { success: false, message: 'Médico não encontrado.' });
        return res.status(201).json({ success: true, message: 'Médico encontrado.'})
    } catch (err) {
        return res.status(500).json(err, { success: false, message: 'Algo falhou.' });
    }
}