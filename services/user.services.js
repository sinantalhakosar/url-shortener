const db = require("../models");
const bcrypt = require('bcrypt-nodejs');
const User = db.user;

module.exports.createUser = (user) => {
    return User.create({
        user_id: user.user_id,
        username: user.username,
        password: user.password,
        email:user.email,
        token:null
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

module.exports.loginUser = (username, password) => {
  return User.findOne({where: {username: username}}).then((user)=> {
    if (!user) {
        return 'User not found';
    }
    if(bcrypt.compareSync(password, user.password)){
      return user;
    }
    return "Wrong password or username";
 })
  .catch((err) => {
    console.log(">> Error while finding User: ", err);
  });
};

module.exports.isUserExists = (username) => {
  return User.findOne({where: {username: username}}).then((user)=> {
    if (!user) {
        return false;
    }
    return true;
 })
  .catch((err) => {
    console.log(">> Error while finding User: ", err);
  });
};