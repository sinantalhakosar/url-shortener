/*
Sequelize JS configs and model relations are here
*/
const dbConfig = require("../config/db.config.js");

const activeDb = dbConfig[process.env.NODE_ENV] 

const Sequelize = require("sequelize");
const sequelize = new Sequelize(activeDb.DB, activeDb.USER, activeDb.PASSWORD, {
  host: activeDb.HOST,
  dialect: activeDb.dialect,
  operatorsAliases: 0,

  pool: {
    max: activeDb.pool.max,
    min: activeDb.pool.min,
    acquire: activeDb.pool.acquire,
    idle: activeDb.pool.idle
  },

});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.url = require("./url.model.js")(sequelize, Sequelize);

// Relations ( users <-> urls)
db.url.belongsToMany(db.user, {
  through: "user_url",
  as: "users",
  foreignKey: "url_id",
});
db.user.belongsToMany(db.url, {
  through: "user_url",
  as: "urls",
  foreignKey: "user_id",
  onDelete: 'CASCADE'
});

module.exports = db;