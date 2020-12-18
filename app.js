var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var cors = require('cors')

var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');

var app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const db = require("./models");
const UserService = require("./services/user.services");
const UrlService = require("./services/url.services");

const run = async () => {
  const user1 = await UserService.createUser({
    username: "sinan",
    password: "talha",
    email: "kosar",
  });

  const url1 = await UrlService.createURL({
    long_url: "www.google.com.tr",
  }, user1);

  await UserService.findUserById(user1.user_id);
  await UrlService.findAllUrlsOfUser();
  await UrlService.deleteUrlById(url1.url_id);
};

//db.sequelize.sync();
//For development
db.sequelize.sync({ force: true}).then(() => {
  console.log("Drop and re-sync db.");
  run();
});



module.exports = app;
