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
            type: DataTypes.STRING(1000)
        }
    });
    /* 
    Long url to shortener
    Unique string and convert to Base 36 for even shorter string.
    */
    shortenUrl = (url) => {
        if (url === null) {
            throw new Error('User not found');
        }
        else if (!url.changed('long_url')) return url.long_url;
        else {
            if(url.short_url.length === 0){
                return url.short_url = (Date.now() + ~~(Math.random()*1000)).toString(36);
            }
            return;
        }
    }

    Url.beforeCreate(shortenUrl);
    Url.beforeUpdate(shortenUrl);

    return Url;
  };