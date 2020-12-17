const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.url = require("./url.model.js")(sequelize, Sequelize);

db.url.belongsToMany(db.user, {
  through: "user_url",
  as: "user",
  foreignKey: "url_id",
});
db.user.belongsToMany(db.url, {
  through: "user_url",
  as: "url",
  foreignKey: "user_id",
});

module.exports = db;