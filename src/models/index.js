'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
let config = {};
try {
  config = require(__dirname + '/../config/config.json')[env] || {};
} catch (_) {
  try {
    config = require(__dirname + '/../config/config.json.example')[env] || {};
  } catch (__) {
    config = {};
  }
}
const db = {};

let sequelize;
if (process.env.DATABASE_URL) {
  const isPostgres = process.env.DATABASE_URL.startsWith('postgres');
  const isExternalRender = process.env.DATABASE_URL.includes('oregon-postgres.render.com') || process.env.DATABASE_URL.includes('sslmode=require');
  const requireSSL = process.env.DB_SSL === 'true' || isExternalRender;
  const dialectOptions = requireSSL
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {};
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: isPostgres ? 'postgres' : 'mysql',
    logging: false,
    dialectOptions: dialectOptions
  });
} else if (config.use_env_variable && process.env[config.use_env_variable]) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || config.database || 'Flights_Search_DEV',
    process.env.DB_USER || config.username || 'root',
    process.env.DB_PASSWORD || config.password || '',
    {
      host: process.env.DB_HOST || config.host || 'localhost',
      port: process.env.DB_PORT || config.port || 3306,
      dialect: 'mysql',
      logging: false
    }
  );
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
