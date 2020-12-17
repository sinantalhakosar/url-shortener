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

module.exports.findUserById = (user_id) => {
  return User.findByPk(user_id).then((user)=> {
    if (!user) {
        return 'User not found';
    }
    return user;
 })
  .catch((err) => {
    console.log(">> Error while finding User: ", err);
  });
};