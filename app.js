var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');




// Configuring Passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./db/users');

var database = require('./db');
var action = require('./db/action');
var employerAction = require('./db/employerAction');
var employeeAction = require('./db/employeeAction');
var postjobAction = require('./db/postjobAction');
var generalAction = require('./db/generalAction');
var postResume = require('./db/postResume');

//Configuring flash
var flash = require('express-flash');

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke callback `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.

passport.use('EmployeeSignIn-local',new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true, },
    function(req, username, password, cb ) {
      employeeAction.findByUsername(username, function( err, user) {
        if (err) { return cb(err); }
        if (!user) { 
         return cb(null, false, req.flash('username','Invalid username')); 
       }
        if (user.password != password) { 
         return cb(null, false, req.flash('password','Wrong password'));
          }
        return cb(null, user);
      });
    }));

passport.use('EmployerSignIn-local',new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true, },
    function(req, email, password, cb ) {
      employerAction.findByEmail(email, function( err, user) {
        if (err) { return cb(err); }
        if (!user) { 
         return cb(null, false, req.flash('email','Invalid email address')); 
       }
        if (user.password != password) { 
         return cb(null, false, req.flash('password','Wrong password'));
          }
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
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {

if (user.fname) {
    // serialize user
    employeeAction.findById(user.id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
  }
if (user.aEmail) {
    // serialize user
    employerAction.findById(user.id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
}
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
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} ,
            user : req.user
        });
});

app.get('/traning', function(req, res, next) {
    res.render('traning',
        {
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
            user : req.user
        });
});

// Employer Actions

app.get('/employercreate', function(req, res, next) {
    res.render('employercreate',
        {
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
            user : req.user
        });
});


app.post('/employerRegistration', function(req, res, next) {

    req.checkBody('password', 'Password is too short. Minimum size is 8.').notEmpty().isLength({min:8});
    req.checkBody('confirmPassword', 'Confirm password does not match with password').equals(req.body.password);
    var errors = req.validationErrors();

    console.log(errors);
    if (errors) {

        console.log(req.body);
        // req.flash( 'formdata',req.body); // load form data into flash
        req.flash('errors', errors);
        res.redirect('/employercreate');
        // return done(null, false, req.flash('formdata', req.body));
    }
    else
    {
        employerAction.findEmployerEmail(req, res);
        // employerAction.findEmployerEmail(req, res);
    }

});

app.get('/employersign', function(req, res, next) {
    res.render('employersign',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });
});

app.post('/employersign',
    passport.authenticate('EmployerSignIn-local', {  
      failureRedirect: '/employersign' ,
      successRedirect : '/',
      failureFlash: true
    })
);

// Employer pannel Action

app.get('/employerpannel', function(req, res, next) {
    res.render('employerpannel',
        {
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
            user : req.user
        });
});

app.get('/postnewjobs', isEmployeerAuthenticated,function(req, res, next) {
    res.render('postnewjobs',
        {
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
            user : req.user
        });
});

app.post('/postjobs', isEmployeerAuthenticated, function(req, res, next) {


    if(req.body.txtTotalVacancy <= 0){
        req.flash('vacancy', 'Number of vacancy should be minimum 1');
        res.redirect('/postnewjobs');
    }
    else {
        req.checkBody('txtTotalVacancy', 'Number of vacancy can not be letter.').isInt();
        var errors = req.validationErrors();

        console.log(errors);
        if (errors) {

            console.log(req.body);
            // req.flash( 'formdata',req.body); // load form data into flash
            req.flash('errors', errors);
            res.redirect('/postnewjobs');
            // return done(null, false, req.flash('formdata', req.body));
        }
        else {
            postjobAction.addJob(req, res, req.user.id );
            // postjobs.addJob(req, res);
        }
    }

});

// app.get('/singlejob', function(req, res, next) {
//     res.render('singlejob',
//         {
//             partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
//             user : req.user
//         });
// });

app.get('/postedjob',isEmployeerAuthenticated, function(req, res) {
    postjobAction.postedJobs(req, res, req.user);
});



function isEmployeerAuthenticated(req, res, next) {
    if (req.user.aEmail)
        return next();
    res.redirect('/');
}

// Employee Actions

app.get('/employeecreate', function(req, res, next) {
    res.render('employeecreate',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });
});

app.post('/employeeRegistration', function(req, res, next) {

    req.checkBody('password', 'Password is too short. Minimum size is 8.').notEmpty().isLength({min:8});
    req.checkBody('rePassword', 'Confirm password is too short. Minimum size is 8.').isLength({min:8});
    req.checkBody('rePassword', 'Confirm password does not match with password').equals(req.body.password);
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

app.get('/employeesign', function(req, res, next) {
    res.render('employeesign',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });
});

app.post('/employeesign',
    passport.authenticate('EmployeeSignIn-local',{ 
      failureRedirect: '/employeesign' ,
      successRedirect: '/',
      failureFlash: true
    })
);

app.get('/apply', function(req, res, next) {
    userId = req.query.userid;
    Id = req.query.id;
    generalAction.applyJob(req, res,userId,Id);
});

app.get('/appliedjobs',isEmployeeAuthenticated, function(req, res, next) {
    employeeAction.appliedJobs(req,res,req.user.id);
});

function isEmployeeAuthenticated(req, res, next) {
    if (req.user.username)
        return next();
    res.redirect('/');
}

app.get('/logout', function(req, res){
  console.log(req.user);
  req.logout();
  res.redirect('/');
});
// app.post('/employeesign', function(req, res, next) {
//   console.log('working');
//   res.redirect('/employeesign');
// });


// General pages 

app.get('/singleJobDetails', function(req, res, next) {
    // Id = req.params.id;
    Id = req.query.id;
    console.log("query id =" + Id);
    generalAction.singleJobs(req, res, Id);
});

app.get('/allpostedjobs', function(req, res, next) {
    // Id = req.params.id;
    Id = req.query.id;
    console.log("query id =" + Id);
    generalAction.allJobs(req, res,req.user, Id);
});

app.get('/postResume', function(req, res, next) {
    console.log(req.body);

    res.render('post_resume',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });

    req.checkBody('nationalID', 'National ID is required. Minimum size is 10.').notEmpty().isLength({min:10});
    var errors = req.validationErrors();

    console.log(errors);
    if (errors) {
            
            console.log(errors);
            // req.flash( 'formdata',req.body); // load form data into flash
            req.flash('errors', errors);
           res.redirect('/myAccount');
            // return done(null, false, req.flash('formdata', req.body));
    }
    else
    {
      console.log('hello');
      postResume.addEmployee(req, res);
      // postResume.findNationID(req, res);
    }
});});

app.post('/postResume',function(req, res, next) {
    console.log(req.body);


app.post('/myAccount',function(req, res, next) {
res.render ('postResume', {name: req.username});
});



app.get('/aboutus', function(req, res, next) {
    res.render('aboutus',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} ,
            user : req.user
        });
});

app.get('/contactus', function(req, res, next) {
    res.render('contactus',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} ,
            user : req.user
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


// Websocket working

// var http = require('http').Server(app);
var io = require('socket.io').listen(3080);


app.get('/websocket', function(req, res){
  res.render('websocket',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

// http.listen(process.env.PORT || 3080, function(){
//   console.log('listening on *:3080');
// });


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
