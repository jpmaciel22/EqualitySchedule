const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  cpf: {
    type: DataTypes.STRING,
    primaryKey: true,
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
  telefone: {
    type: DataTypes.STRING,
    unique: true
  },
  nome: {
    type: DataTypes.STRING
  },
});

module.exports = User;