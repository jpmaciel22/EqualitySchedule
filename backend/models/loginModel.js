const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true,
  },
  telefone: {
    unique: true,
    type: DataTypes.STRING
  },
  nome: {
    type: DataTypes.STRING
    }
});

module.exports = User;