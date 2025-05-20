const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Medico = require('./medicoModel');

const Servico = sequelize.define('Servico', {
  id_servico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_medico: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Medico',
      key: 'cpf',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  }
});

Servico.belongsTo(Medico, {foreignKey: 'id_medico'});
Medico.hasMany(Servico, {foreignKey: 'id_medico'});

module.exports = Servico;