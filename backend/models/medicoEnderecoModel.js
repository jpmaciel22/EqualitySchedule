const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Medico = require('./medicoModel');

const EnderecoMedico = sequelize.define('EnderecoMedico', {
  id_endereco: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  rua: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_medico: {
    type: DataTypes.STRING,
    references: {
      model: 'Medico',
      key: 'cpf',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  }
});

EnderecoMedico.belongsTo(Medico, { foreignKey: 'id_medico' });
Medico.hasMany(EnderecoMedico, { foreignKey: 'id_medico' });

module.exports = EnderecoMedico;