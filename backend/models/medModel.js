const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Medico = sequelize.define('Medico', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  approved: {
    type: DataTypes.BOOLEAN
  }
});

module.exports = Medico;