const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const useSsl =
  process.env.DB_SSL === 'true' ||
  process.env.NODE_ENV === 'production' ||
  Boolean(process.env.DATABASE_URL);

const sequelizeOptions = {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

if (useSsl) {
  sequelizeOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, sequelizeOptions)
  : new Sequelize(
      process.env.DB_NAME || 'store_rating_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'password',
      {
        ...sequelizeOptions,
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
      },
    );

module.exports = sequelize;
