const db = require("../models");
const Url = db.url;
const User = db.user;

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

module.exports.createURL = (url, user) => {
    return Url.create({
        url_id: url.url_id,
        long_url: url.long_url,
        short_url: url.long_url,
    })
      .then(async (url) => {
        await addURL(url.url_id, user.user_id);
        console.log(">> Created URL: " + JSON.stringify(url, null, 4));
        return url;
      })
      .catch((err) => {
        console.log(">> Error while creating URL: ", err);
      });
};

  module.exports.findAllUrlsOfUser = () => {
    return Url.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: ["user_id", "username"],
          through: {
            attributes: [],
          },
          // through: {
          //   attributes: ["tag_id", "tutorial_id"],
          // },
        },
      ],
    })
      .then((url) => {
        console.log(">> Returned Urls: " + JSON.stringify(url, null, 4));
        return url;
      })
      .catch((err) => {
        console.log(">> Error while retrieving Url: ", err);
      });
  };

  module.exports.deleteUrlById = (url_id) =>{
      return Url.destroy({
        where: {
            url_id: url_id
        }
      })
      .then((deleted_row) => {
          if(deleted_row === 1){
            console.log('Deleted successfully');
          }
        return deleted_row;
      })
      .catch((err) => {
        console.log(">> Error while deleting Url: ", err);
      });
  }