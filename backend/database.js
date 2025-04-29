require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('AV3_igor', 'postgres', process.env.DBPASS, {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;