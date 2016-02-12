var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var session = require('express-session');

var routes = require('./routes/index');
var api = require('./routes/api');
var users = require('./routes/users');
var generate = require('./routes/generate');

var SteamManager = require('./steam-manager/');
if(!process.env.PROD_STEAM_KEY){
    var vars = require('./config/vars.json');
}
var steamKey = process.env.PROD_STEAM_KEY || vars.apiKey;

SteamManager = new SteamManager(steamKey);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.disable('etag');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', api);
app.use('/generate', generate); 

var mainDbUrl;
if(process.env.PROD_MONGODB){
    mainDbUrl = process.env.PROD_MONGODB;
}else{
    mainDbUrl = 'mongodb://localhost:27017/team-og'
}

mongoose.connect(mainDbUrl);

SteamManager.getItemList();
SteamManager.getHeroList();

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


module.exports = app;
