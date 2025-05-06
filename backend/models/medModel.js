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
  nota: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tempo: {
    type: DataTypes.STRING,
    defaultValue: '0'
  },
  regiao: {
    type: DataTypes.STRING,
  },
  telefone: {
    unique: true,
    type: DataTypes.STRING
  },
  nome: {
    type: DataTypes.STRING,
  }
  // falta endereco.
});

module.exports = Medico;