const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Medico = require('./medicoModel');

const Disponibilidade = sequelize.define('Disponibilidade', {
  id_disponibilidade: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_medico: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Medicos',
      key: 'cpf',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  data: {
    type: DataTypes.DATEONLY, 
    allowNull: false,
  },
  hora_inicio: {
    type: DataTypes.TIME, 
    allowNull: false,
  },
  hora_fim: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  disponivel: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

Disponibilidade.belongsTo(Medico, { foreignKey: 'id_medico' });
Medico.hasMany(Disponibilidade, { foreignKey: 'id_medico' });

module.exports = Disponibilidade;