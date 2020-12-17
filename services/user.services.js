const db = require("../models");
const User = db.user;
const URL = db.url;

module.exports.createUser = (user) => {
    return User.create({
        user_id: user.user_id,
        username: user.username,
        password: user.password,
        email:user.email
    })
      .then((user) => {
        console.log(">> Created User: " + JSON.stringify(user, null, 4));
        return user;
      })
      .catch((err) => {
        console.log(">> Error while creating User: ", err);
      });
};

module.exports.addURL = (userId, urlId) =>{
  return User.findByPk(userId)
    .then((user) => {
      if (!user) {
        console.log("User not found!");
        return null;
      }
      return URL.findByPk(urlId).then((url) => {
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