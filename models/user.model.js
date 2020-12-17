const { DataTypes } = require("sequelize");
const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        user_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        timestamps: false
    });

    function encodePassword(user) {
        if (user === null) {
            throw new Error('User not found');
        }
        else if (!user.changed('password')) return user.password;
        else {
            let salt = bcrypt.genSaltSync();
            return user.password = bcrypt.hashSync(user.password, salt);
        }
    }

    User.beforeCreate(encodePassword);
    User.beforeUpdate(encodePassword);

    return User;
  };