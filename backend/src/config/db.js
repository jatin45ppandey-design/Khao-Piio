const { Sequelize } = require('sequelize');

const DB_NAME = process.env.DB_NAME || 'khao-pio';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '2501';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  logging: false,
  dialectOptions: {
    // This is the crucial SSL addition required for Aiven to accept the connection
    ssl: {
      rejectUnauthorized: false
    }
  },
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
  // Removed the rootConnection database creation logic. 
  // Cloud DBs are pre-created (defaultdb), so we just authenticate directly.
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error; // Throwing the error helps Render logs capture exactly why it failed
  }
}

module.exports = {
  sequelize,
  initializeDatabase,
};