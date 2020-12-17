const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        user_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        username: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        }
    });
    return User;
  };