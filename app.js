
/**
 * Module dependencies.
 */

var express = require('express');

var models = require('./models');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: '0rC+Na99I0GPv7jNN3Xl7cHW6v2BR8rb' }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    locals: {
      title: 'MITOC Trip Manager'
    }
  });
});

app.get('/trip/new', function(req, res){
  res.render('trip/new', {
    locals: {
      title: 'MITOC Trip Manager - Creating new trip'
    }
  });
});

app.get('/trip/join', function(req, res){
  res.render('trip/join', {
    locals: {
      title: 'MITOC Trip Manager - Join a trip'
    }
  });
});

app.listen(3000);
console.log("Express server listening at http://localhost:%d/ in %s mode",
    app.address().port, app.settings.env);
