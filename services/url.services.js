const db = require("../models");
const Url = db.url;
const User = db.user;
const Sequelize = require("sequelize");

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
/*
Long url to shortener
Unique string with length = 6
*/
getRandomString = (short_url) => {
  if(short_url.length !== 0){
    return short_url
  }
  var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for ( var i = 0; i < 6; i++ ) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}

/* 
Long url to shortener
Unique string and convert to Base 36 for even shorter string. No length Propery
*/
shortenUrl = (url) => {
    if (url === null) {
        throw new Error('User not found');
    }
    else {
        if(url.short_url.length === 0){
            let unique_short_url = (Date.now() + ~~(Math.random()*1000)).toString(36);
            unique_short_url = unique_short_url.split('')
            for(let i=0;i<Math.floor(Math.random() * unique_short_url.length/2);i++){
                unique_short_url[i] = unique_short_url[i].toUpperCase()
            }
            unique_short_url = unique_short_url.join('')
            return url.short_url = unique_short_url
        }
        return;
    }
}

module.exports.createURL = async (url, user_id) => {
    //await shortenUrl(url);
    url.short_url = getRandomString(url.short_url);
    return Url.findOrCreate({
        where:{
            short_url: url.short_url
        },
        defaults:{
        url_id: url.url_id,
        long_url: url.long_url,
        short_url: url.short_url,
        last_accessed: url.last_accessed,
        access_count: url.access_count
    }
    })
      .then(async (url) => {
        if(url[0]._options.isNewRecord === false){
          this.createURL(url,user_id);
        }else{
          await addURL(url.url_id, user_id);
          console.log(">> Created URL: " + JSON.stringify(url, null, 4));
          return url;
        }
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
            attributes: ["user_id","url_id","createdAt"],
            where: {user_id: user_id}
          }
        },
      ],
      order: [[Sequelize.literal('"users->user_url"."createdAt"'), 'DESC']]
    })
      .then((url) => {
        //console.log(">> Returned Urls: " + JSON.stringify(url, null, 4));
        return url;
      })
      .catch((err) => {
        console.log(">> Error while retrieving Url: ", err);
      });
  };

  module.exports.findUrlsOfUserByShortUrl = (short_url) => {
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

  module.exports.updateShortUrlLastAccess = (short_url) =>{
    return Url.update({
      last_accessed: Date.now(),
      access_count: Sequelize.literal('access_count + 1')
     }, {
      where: {
       short_url: short_url
      }
     })
    .then((updated_row) => {
        if(updated_row === 1){
          //console.log('Deleted successfully');
          return true;
        }
      return false;
    })
    .catch((err) => {
      console.log(">> Error while updating Url: ", err);
    });
}