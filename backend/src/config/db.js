const { Sequelize } = require('sequelize');

const DB_NAME = process.env.DB_NAME || 'khao-pio';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '2501';

const rootConnection = new Sequelize({
  dialect: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: 'mysql',
  logging: false,
});

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

async function initializeDatabase() {
  await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await rootConnection.close();
  await sequelize.authenticate();
}

module.exports = {
  sequelize,
  initializeDatabase,
};
