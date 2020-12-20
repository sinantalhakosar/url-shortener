/*
Database connection credentials
Do not forget to change after postgresql setup
*/
module.exports = {
    development:{
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
    },
    logging: false,
  },
    test: {
      HOST: "localhost",
      USER: "sinan",
      PASSWORD: "kosar",
      DB: "urlshortener_test",
      dialect: "postgres",
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
      logging: false,
    },
    production: {}
};