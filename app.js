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
// var db = require('./db/users');

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


//Getting the index page

app.get('/', function(req, res, next) {
    res.render('index',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} ,
            user : req.user
        });
});

//Getting the training page

app.get('/traning', function(req, res, next) {
    res.render('traning',
        {
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
            user : req.user
        });
});

//Getting the employer page

app.get('/employercreate', function(req, res, next) {
    res.render('employercreate',
        {
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
            user : req.user
        });
});

//Employer registration

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

//Employer signin page

app.get('/employersign', function(req, res, next) {
    res.render('employersign',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });
});

//Employer signin chech through post method

app.post('/employersign',
    passport.authenticate('EmployerSignIn-local', {  
      failureRedirect: '/employersign' ,
      successRedirect : '/',
      failureFlash: true
    })
);

// Employer pannel Page

app.get('/employerpannel', function(req, res, next) {
    res.render('employerpannel',
        {
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
            user : req.user
        });
});

//Post a new job 

app.get('/postnewjobs', isEmployeerAuthenticated,function(req, res, next) {
    res.render('postnewjobs',
        {
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
            user : req.user
        });
});

//Posting a job with verification 

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


//Showing posted jobs for an individual employer

app.get('/postedjob',isEmployeerAuthenticated, function(req, res) {
    postjobAction.postedJobs(req, res, req.user);
});


//Checking Employer is logged in or not

function isEmployeerAuthenticated(req, res, next) {
    if (req.user.aEmail)
        return next();
    res.redirect('/');
}

// Employee Registration page showing

app.get('/employeecreate', function(req, res, next) {
    res.render('employeecreate',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });
});

// Employee Registration verification and post

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

//Employee signin page 

app.get('/employeesign', function(req, res, next) {
    res.render('employeesign',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });
});

//Employee authentication check

app.post('/employeesign',
    passport.authenticate('EmployeeSignIn-local',{ 
      failureRedirect: '/employeesign' ,
      successRedirect: '/',
      failureFlash: true
    })
);

//Apply on a Job after signin

app.get('/apply', function(req, res, next) {
    userId = req.query.userid;
    Id = req.query.id;
    generalAction.applyJob(req, res,userId,Id);
});

//Showing the applied jobs after applying

app.get('/appliedjobs',isEmployeeAuthenticated, function(req, res, next) {
    employeeAction.appliedJobs(req,res,req.user.id);
});

//Showing Post Resume page 

app.get('/postResume',isEmployeeAuthenticated, function(req, res, next) {
    console.log(req.body);

    res.render('post_resume',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
            user: req.user
        });
});

//Posting a job with verification

app.post('/postResume',isEmployeeAuthenticated,function(req, res, next) {
    console.log(req.body);
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
      // postResume.addEmployee(req, res);
      postResume.findNationalID(req, res,req.user.id);
    }
});


//Checking Employee authentication

function isEmployeeAuthenticated(req, res, next) {
    if (req.user.username)
        return next();
    res.redirect('/');
}

//Logging out 

app.get('/logout', function(req, res){
  console.log(req.user);
  req.logout();
  res.redirect('/');
});


// View Resume Action //

app.get('/viewresume',isEmployeeAuthenticated, function(req, res, next) {
    employeeAction.viewresume(req,res,req.user.id);
});


// General pages 


//Showing the single job details

app.get('/singleJobDetails', function(req, res, next) {
    // Id = req.params.id;
    Id = req.query.id;
    console.log("query id =" + Id);
    generalAction.singleJobs(req, res, Id);
});

//Showing the jobs category wise

app.get('/allpostedjobs', function(req, res, next) {
    // Id = req.params.id;
    Id = req.query.id;
    console.log("query id =" + Id);
    generalAction.allJobs(req, res,req.user, Id);
});

//Search the job by title

app.post('/search', function(req, res, next) {
    generalAction.searchByTitle(req, res);
});

//Showing about us page

app.get('/aboutus', function(req, res, next) {
    res.render('aboutus',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} ,
            user : req.user
        });
});

//Showing contactUs page 

app.get('/contactus', function(req, res, next) {
    res.render('contactus',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} ,
            user : req.user
        });
});



          // working on Websocket 

          // Configuring the websocket

          var io = require('socket.io').listen(3080);
          var employerSocket = [];
          var employeeSocket = [];
          var connections = [];

          //Employee interview page

          app.get('/websocket', isEmployeeAuthenticated, function(req, res){
            res.render('websocket',
              { 
                      partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
                      user: req.user
                  });
          });

          //Employee interview page

          app.get('/companyinterview', isEmployeerAuthenticated, function(req, res){
            res.render('companyinterview',
              { 
                      partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
                      user: req.user
                  });
          });

          //Showing who are connected

          io.on('connection', function(socket){

            console.log('coming here');
              connections.push(socket);
              console.log('connected: %s ',connections.length);



              socket.on('disconnect',function(socket){
                employeeSocket.splice(employeeSocket.indexOf(socket),1);
                updateUsernames();   
                connections.splice(connections.indexOf(socket),1);
                console.log('Disconnected:%s connected',connections.length);
              });

            //Sending the username who are chatting

            socket.on('username',function(data,callback){
                      console.log('username is:' +data);
                      // callback(true);
                      socket.employeeSocket = data.username;
                      employeeSocket.push(socket.employeeSocket);
                      updateUsernames();
                  });
                  function updateUsernames(){
                io.emit('get users', employeeSocket);
                }


            socket.on('chat message', function(data){
              io.emit('chat message', {msg : data, username: socket.employeeSocket});
            });

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
