const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Medico = require('./medicoModel');
const User = require('./userModel');

const ConsultaAgenda = sequelize.define('ConsultaAgenda', {
  codigo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  horario: {
    type: DataTypes.TIME,
    allowNull: false
  },
  id_user: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'User',
      key: 'cpf'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  id_medico: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Medico',
      key: 'cpf'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  }
});

ConsultaAgenda.belongsTo(User, { foreignKey: 'id_user' });
User.hasMany(ConsultaAgenda, { foreignKey: 'id_user' });

ConsultaAgenda.belongsTo(Medico, {foreignKey: 'id_medico'});
Medico.hasMany(ConsultaAgenda, {foreignKey: 'id_medico'});

module.exports = ConsultaAgenda;