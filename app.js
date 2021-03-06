var express = require('express');
var path = require('path');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var cors = require('cors');
var session = require('express-session');
var flash = require('req-flash');
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var authRouter = require('./routes/auth');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(cors());
app.use(session({
secret: 'djhxcvxfgshajfgjhgsjhfgsakjeauytsdfy',
resave: false,
saveUninitialized: true,
cookie: {
  expires: 600000,
  httpOnly: true
}
}));
app.use(flash());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  //next(createError(404));
  res.render('404')
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
//const UserService = require("./services/user.services");
//const UrlService = require("./services/url.services");

// const run = async () => {
  // const user1 = await UserService.createUser({
  //   username: "sinan",
  //   password: "talha",
  //   email: "kosar",
  // });

  // const url1 = await UrlService.createURL({
  //   long_url: "https://google.com.tr",
  // }, user1.user_id);

  //await UserService.findUserById(user1.user_id);
  //await UrlService.findAllUrlsOfUser();
  //await UrlService.deleteUrlByShortUrl(url1.short_url);
// };

db.sequelize.sync();
//For development
// db.sequelize.sync({ force: true}).then(() => {
//   console.log("Drop and re-sync db.");
//   run();
// });



module.exports = app;
