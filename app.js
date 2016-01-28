var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//错误日志
// var log4js = require('log4js');
// log4js.configure({
//   appenders: [
//     { type: "console" }
//   ],
//   replaceConsole: true
// });
// var logger = log4js.getLogger();
// logger.setLevel('INFO');
var routes = require('./routes/index');
// var home = require('./routes/home');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//print error message to file
// app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO, format:':method :url'}));
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// app.use(express.bodyParser({uploadDir:'./publish/upload/images'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//初始化session
app.use(session({
  secret: 'recommand128bytesrandomstring',
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  },
  resave: false,
  saveUninitialized: true
}));
// 未登录或者session失效
app.use(function(req, res, next) {
  var user = req.session['user'];
  if (!user && !/^\/login\?openid=.*$/.test(req.originalUrl)) {
    console.log('please login first!');
  }
  next();
});
routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
//333
module.exports = app;