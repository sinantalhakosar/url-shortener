const db = require("../models");
const User = db.user;

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
