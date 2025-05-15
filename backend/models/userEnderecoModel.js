const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./userModel');

const UserEndereco = sequelize.define('userEndereco', {
  id_end: {
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
  id_user: {
    type: DataTypes.STRING,
    references: {
      model: 'User',
      key: 'cpf',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  }
});

UserEndereco.belongsTo(User, { foreignKey: 'id_user' });
User.hasMany(UserEndereco, { foreignKey: 'id_user' });

module.exports = UserEndereco;