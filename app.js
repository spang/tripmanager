
/**
 * Module dependencies.
 */

var express = require('express');
// var mongooseAuth = require("mongoose-auth");

var everyauth = require('everyauth')
  , Promise = everyauth.Promise;
everyauth.debug = true;

var models = require('./models');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'ebi3Ial8poophoh$B1ju' }));
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
    title: 'Express'
  });
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

models.mongooseAuth.helpExpress(app);

app.listen(3000);
console.log("Express server listening on port %d in %s mode",
    app.address().port, app.settings.env);
