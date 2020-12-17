const db = require("../models");
const Url = db.url;
const User = db.user;

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