const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const URL = sequelize.define("urls", {
        url_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        long_url: {
            type: DataTypes.STRING(1000)
        },
        short_url: {
            type: DataTypes.STRING(1000)
        }
    });
    return URL;
  };