/*
Database connection credentials
Do not forget to change after postgresql setup
*/
module.exports = {
    HOST: "localhost",
    USER: "sinan",
    PASSWORD: "kosar",
    DB: "urlshortener",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
};