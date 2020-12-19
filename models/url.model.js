const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const Url = sequelize.define("urls", {
        url_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        long_url: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        short_url: {
            type: DataTypes.STRING(1000),
            allowNull: false,
            unique: true
        },
        last_accessed: {
            type:DataTypes.DATE
        },
        access_count: {
            type:DataTypes.INTEGER
        }
    });

    return Url;
  };