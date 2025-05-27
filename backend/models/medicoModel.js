const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Medico = sequelize.define('Medico', {
  cpf: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  regiao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone: {
    unique: true,
    type: DataTypes.STRING
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  especificacao: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  }
});


module.exports = Medico;