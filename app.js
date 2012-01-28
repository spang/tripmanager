/**
 * Module dependencies.
 */

var express = require('express'),
    form = require('express-form'),
    filter = form.filter,
    validate = form.validate,
    app = express.createServer();

var models = require('./models');

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
      title: 'MITOC Trip Manager - Creating new trip',
      flash: req.flash()
    }
  });
});

app.post('/trip/new/done',
  form( // form filter and validation middleware
    filter("trip_name").trim(),
    validate("trip_name").required(),
    filter("trip_description").trim(),
    validate("trip_description").required()
  ),

  // Express request-handler gets filtered and validated data
  function(req, res) {
    if (!req.form.isValid) {
      console.log(req.form.errors);
      // re-render the form with errors highlighted
      req.form.flashErrors();
      res.redirect('/trip/new');
    }
    else {
      // Or, use filtered data from the form object
      console.log("trip name:", req.form.trip_name);
      console.log("trip description:", req.form.password);
    }
  }
);


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
