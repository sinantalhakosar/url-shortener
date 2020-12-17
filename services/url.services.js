const db = require("../models");
const Url = db.url;  

module.exports.createURL = (url) => {
    return Url.create({
        url_id: url.url_id,
        long_url: url.long_url,
        short_url: url.long_url,
    })
      .then((url) => {
        console.log(">> Created URL: " + JSON.stringify(url, null, 4));
        return url;
      })
      .catch((err) => {
        console.log(">> Error while creating URL: ", err);
      });
  };