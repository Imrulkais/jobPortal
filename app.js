var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



// Configuring Passport
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db/users');

var database = require('./db');
var action = require('./db/action');
var employerAction = require('./db/employerAction');
var employeeAction = require('./db/employeeAction');

//Configuring flash
var flash = require('express-flash')

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke callback `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
    function(username, password, cb) {
      db.findByUsername(username, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
      });
    }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

//Using flash
app.use(flash());

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());



// API routes
//app.get('/', function(req, res, next) {
//  if(!req.user)
//    res.render('login');
//  else
//    res.render('index', { userName: req.user.displayName });
//});


app.get('/', function(req, res, next) {
    res.render('index',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });
});

app.get('/employercreate', function(req, res, next) {
    res.render('employercreate',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });
});

app.post('/employerRegistration', function(req, res, next) {

    // req.checkBody('password', 'Password is too short. Minimum size is 6.').notEmpty().isLength({min:6});
    // req.checkBody('confirmPassword', 'Password is too short. Minimum size is 6.').notEmpty().isLength({min:6});
    // var errors = req.validationErrors();
    // // console.log(errors);
    // if (errors) {
    //         var messages = [];
    //         errors.forEach(function(error) {

    //           // messagess[error.param] = error.msg;
    //              messages.push(error.msg);
    //         });
    //         console.log(messages);
    //         // req.session.errorssss = messagess;
    //         console.log(req.body);
    //         req.flash( 'formdata',req.body); // load form data into flash
    //         req.flash('error', messages);

    //         // console.log(formdata);
    //        res.redirect('/test');
    //         // return done(null, false, req.flash('formdata', req.body));
    // }
    // else {

    employerAction.addEmployer(req.body);
  req.flash('success', 'You have been signed up');
  res.redirect('/employercreate');
// }
});

app.get('/employeecreate', function(req, res, next) {
    res.render('employeecreate',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });
});

app.post('/employeeRegistration', function(req, res, next) {

    req.checkBody('password', 'Password is too short. Minimum size is 8.').notEmpty().isLength({min:8});
    req.checkBody('rePassword', 'Confirm password is not match with password').equals(req.body.password);
    var errors = req.validationErrors();

    console.log(errors);
    if (errors) {
            
            console.log(req.body);
            // req.flash( 'formdata',req.body); // load form data into flash
            req.flash('errors', errors);
           res.redirect('/employeecreate');
            // return done(null, false, req.flash('formdata', req.body));
    }
    else
    {
      employeeAction.findEmployeeName(req, res);
      // employeeAction.findEmployeeEmail(req, res);
    }
      
    
});


app.get('/aboutus', function(req, res, next) {
    res.render('aboutus',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });
});

app.get('/contactus', function(req, res, next) {
    res.render('contactus',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });
});

app.get('/test', function(req, res, next) {
    res.render('test',
        { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });
});

app.post('/test', function(req, res, next) {

    req.checkBody('password', 'Password is too short. Minimum size is 6.').notEmpty().isLength({min:6});
    req.checkBody('confirmPassword', 'Password is too short. Minimum size is 6.').notEmpty().isLength({min:6});
    var errors = req.validationErrors();
    // console.log(errors);
    if (errors) {
            var messages = [];
            errors.forEach(function(error) {

              // messagess[error.param] = error.msg;
                 messages.push(error.msg);
            });
            console.log(messages);
            // req.session.errorssss = messagess;
            console.log(req.body);
            req.flash( 'formdata',req.body); // load form data into flash
            req.flash('error', messages);

            // console.log(formdata);
           res.redirect('/test');
            // return done(null, false, req.flash('formdata', req.body));
    }
    else {
    action.addUser(req.body);
  req.flash('success', 'You have been signed up');
  res.redirect('/test');
}
});






app.get('/login', function(req, res, next) {
  res.render('login');
});

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    }
);

app.get('/signup', function(req, res, next) {
  res.render('signup');
});

app.post('/signup', function(req, res, next) {
  console.log(req.body);
  db.addUser(req.body);
  req.flash('message', 'You have been signed up');
  res.redirect('/signup');
});

app.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});

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
