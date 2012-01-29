var express = require('express'),
    form = require('express-form'),
    filter = form.filter,
    validate = form.validate,
    sanitize = require('validator').sanitize,
    app = express.createServer();

var models = require('./models');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
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

// routes
app.get('/trip/new', render_new_trip_form);
app.post('/trip/new/done',
  form( // form filter and validation middleware
    filter("trip_name").trim(),
    validate("trip_name").required(),
    filter("trip_description").trim(),
    validate("trip_description").required(),
    // TODO: add more validators
    filter("leader_name").trim(),
    validate("leader_name").required(),
    filter("leader_email").trim(),
    validate("leader_email").required()
  ),
  process_new_trip);

app.get('/trip/join/:id', render_join_trip_form);

// handlers
function render_new_trip_form(req, res) {
  res.render('trip/new', {
    locals: {
      title: 'MITOC Trip Manager - Creating new trip',
      flash: req.flash()
    }
  });
}

function find_or_create_leader_object(name, email) {
  return models.Person.find({ email: email, leader: true },
      function(err, candidates) {
        var leader;
        if (!err) {
          for (var candidate in candidates) {
            if (name==candidate.name) {
              console.log('found leader candidate', candidate.id);
              leader = candidate;
            }
          }
          return leader;
        }
        else {
          console.log('query error in find_or_create_leader_object: ', error);
        }
      });
}

function process_new_trip(req, res) {
  // Express request-handler gets filtered and validated data
  if (!req.form.isValid) {
    console.log(req.form.errors);
    // re-render the form with errors highlighted
    req.form.flashErrors();
    res.redirect('/trip/new');
  }
  else {
    // save filtered trip data & render finished page
    // for now, assume validation
    console.log("trip name:", req.form.trip_name);
    console.log("trip description:", req.form.trip_description);
    // we're going to end up displaying this description on a
    // web page, so we need to strip it of XSS attack vectors
    var sanitized_description = sanitize(req.form.trip_description);

    var leader = find_or_create_leader_object(req.form.leader_name,
                                              req.form.leader_email,
                                              function(leader) {
      var new_trip = new models.Trip({
        leader      : leader.id,
        name        : req.form.trip_name,
        description : sanitized_description,
        start_date  : req.form.start_date,
        end_date    : req.form.end_date,
        signup_start  : req.form.signup_start,
        signup_end    : req.form.signup_end,
        early_drivers : req.form.early_drivers,
        early_signup_start : req.form.early_signup_start,
        fee           : req.form.trip_fee,
      });
      new_trip.save(function(err) {
        // note that saving is asynchronous
        if (!err) {
          console.log('new trip saved');
        }
        else {
          console.log('error!', err);
        }
      });
    });
  }
}

function render_join_trip_form(req, res) {
  // trip id is in req.params.id
  res.render('trip/join', {
    locals: {
      title: 'MITOC Trip Manager - Join a trip'
    }
  });
}

app.listen(3000);
console.log("Express server listening at http://localhost:%d/ in %s mode",
    app.address().port, app.settings.env);
