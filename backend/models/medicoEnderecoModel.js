const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Medico = require('./medicoModel');

const MedicoEndereco = sequelize.define('medicoEndereco', {
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
      model: 'Medicos',
      key: 'cpf',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  }
});

MedicoEndereco.belongsTo(Medico, { foreignKey: 'id_medico' });
Medico.hasMany(MedicoEndereco, { foreignKey: 'id_medico' });

module.exports = MedicoEndereco;