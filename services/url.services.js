const db = require("../models");
const Url = db.url;
const User = db.user;

/*
Add url to user_url table for relations
*/
addURL = async (urlId, userId) =>{
    return User.findByPk(userId)
      .then((user) => {
        if (!user) {
          console.log("User not found!");
          return null;
        }
        return Url.findByPk(urlId).then((url) => {
          if (!url) {
            console.log("URL not found!");
            return null;
          }
          user.addUrl(url);
          console.log(`>> added URL id=${url.url_id} to User id=${user.user_id}`);
          return user;
        });
      })
      .catch((err) => {
        console.log(">> Error while adding URL to User: ", err);
      });
};

module.exports.createURL = (url, user_id) => {
    return Url.create({
        url_id: url.url_id,
        long_url: url.long_url,
        short_url: url.long_url,
    })
      .then(async (url) => {
        await addURL(url.url_id, user_id);
        console.log(">> Created URL: " + JSON.stringify(url, null, 4));
        return url;
      })
      .catch((err) => {
        console.log(">> Error while creating URL: ", err);
      });
};

  module.exports.findAllUrlsOfUser = (user_id) => {
    return Url.findAll({
      include: [
        {
          model: User,
          as: "users",
          through: {
            attributes: ["user_id","url_id"],
            where: {user_id: user_id}
          }
        },
      ],
    })
      .then((url) => {
        //console.log(">> Returned Urls: " + JSON.stringify(url, null, 4));
        return url;
      })
      .catch((err) => {
        console.log(">> Error while retrieving Url: ", err);
      });
  };

  module.exports.findUrlsOfUserById = (short_url) => {
    return Url.findOne({where: {short_url:short_url}})
      .then((url) => {
        //console.log(">> Returned Urls: " + JSON.stringify(url, null, 4));
        return url;
      })
      .catch((err) => {
        console.log(">> Error while retrieving Url: ", err);
      });
  };

  module.exports.deleteUrlByShortUrl = (short_url) =>{
      return Url.destroy({
        where: {
            short_url: short_url
        }
      })
      .then((deleted_row) => {
          if(deleted_row === 1){
            //console.log('Deleted successfully');
            return true;
          }
        return false;
      })
      .catch((err) => {
        console.log(">> Error while deleting Url: ", err);
      });
  }