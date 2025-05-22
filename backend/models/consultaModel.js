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
    type: DataTypes.DATE,
    allowNull: false,
    timestamps: false 
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
    require: true,
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
  },
  timestamps: false,
});

ConsultaAgenda.belongsTo(User, { foreignKey: 'id_user' });
User.hasMany(ConsultaAgenda, { foreignKey: 'id_user' });

ConsultaAgenda.belongsTo(Medico, {foreignKey: 'id_medico'});
Medico.hasMany(ConsultaAgenda, {foreignKey: 'id_medico'});

module.exports = ConsultaAgenda;