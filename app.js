require('./jobs/idFinder.js');
require('./jobs/status.js');
require('./jobs/gpsd.js');
require('./jobs/calculateDistance.js');
require('./jobs/routeSync.js');
require('./jobs/CalculateMedia.js');
require('./jobs/usb_finder.js');
require('./jobs/syncUsers.js');
require('./jobs/syncFeedbacks.js');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var config= require('config');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth=require('./authentication/authentication');
var details=require('./authentication/detailsFetch');
var log = require('tracer').colorConsole(config.get('log'));
var routes = require('./routes/index');
var users = require('./routes/users');
var route = require('./routes/RouteDetailsCalls');
var content = require('./routes/ContentCalls');
var cors = require("cors");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * middleware to authenticate the jwt and routes
 */
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type');
    //res.setHeader('Access-Control-Allow-Headers', 'Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
app.use(
    function(req,res,next){
        if(req.method=='OPTIONS'){
            next();
        }
      auth(req,res)
          .then(function(user){
              console.log(user,req.user);
            req.user=user;
            next();
          })
          .catch(function(err){
            res.status(err.status).json(err.message);
          })
    },
    function(req,res,next){
        if(req.method=='OPTIONS'){
            //next();
            res.json(config.get('ok'));
        }
      details(req,res)
          .then(function(user){
              if(user) {
                  req.user = user;
                  next();
              }else{
                  next();
              }
          })
          .catch(function(err){
            res.status(err.status).json(err.message);
          });
    });

/**
 * routes
 */
app.use('/api/v1/', routes);
app.use('/api/v1/users', users);
app.use('/api/v1/content', content);
app.use('/api/v1/route', route);
app.use('/',function(req,res){
    res.render('splash')
})
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
    //res.status(err.status || 500);
    //res.render('error', {
    //  message: err.message,
    //  error: err
    //});
    log.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message,
        error: err
      });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  //res.status(err.status || 500);
  //res.render('error', {
  //  message: err.message,
  //  error: {}
  //});
  log.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: ""
  });
});


module.exports = app;
