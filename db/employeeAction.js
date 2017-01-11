var express = require('express');
var router = express.Router();
var db = require('../db');
var employeeAction = require('../db/employeeAction');


//Searching the Employee name

exports.findEmployeeName = function(req, res){

var queryName = 'SELECT * FROM employee WHERE username = "'+ req.body.username +'"';
db.query(queryName,function(err, result) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result[0]); 
        if(result[0] != undefined)
        {
            console.log("here is coming"); 
            req.flash('usernameExist', 'The username is already exist');
            res.redirect('/employeecreate');
        }
        else 
            employeeAction.findEmployeeEmail(req, res);
    }
    
});
};

//Maching the email with username

exports.findEmployeeEmail = function(req, res){

var queryName = 'SELECT * FROM employee WHERE email = "'+ req.body.email +'"';
db.query(queryName,function(err, result) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result[0]); 
        if(result[0] != undefined)
        {
            req.flash('userEmail', 'The email is already exist');
            res.redirect('/employeecreate');
        }
        else 
            employeeAction.addEmployee(req, res);
    }
    
});

};


//Registration an employee

exports.addEmployee = function(req, res){

    usr = req.body;
	console.log(usr);
    var details = {
        username: usr.username,
        password: usr.password,
        fname: usr.fname,
        lname: usr.lname,
        gender: usr.gender,
        email: usr.email,
        mobile: usr.mobile,
        industryType: usr.industryType,
        confirmation: usr.confirmation
    };
    db.query('INSERT into  `employee` SET ?', details, function (err, result) {
        if (err)
            throw err;
        else{
        console.log(' The value inserted. ');
                req.flash('success', 'Your registration has been successfully completed.');
            res.redirect('/employeecreate');
        }
    });

};


//Getting the applied jobs 

exports.appliedJobs = function(req, res, userId){

var queryName = 'SELECT postnewjob.* FROM postnewjob INNER JOIN appliedjobs ON postnewjob.id = appliedjobs.jobid WHERE appliedjobs.userid = "'+ userId +'"';
db.query(queryName,function(err, result) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("result is in aplied jobs:"+result[0]); 
        if(result == undefined)
        {
            res.redirect('/');
        }
        else {
            res.render('appliedjobs',
                {
                    partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
                    appliedjob : result,
                    user: req.user
                });
        }
    }
    
});

};

// Getting the Employee account details 


exports.viewresume = function(req, res, userId){

    var queryName = 'SELECT * FROM employeeAccount WHERE employeeid = "'+ userId +'"';
    db.query(queryName,function(err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("result is in view resume"+result[0]);
            if(result == undefined)
            {
                res.redirect('/');
            }
            else {
                res.render('viewresume',
                    {
                        partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
                        viewresume : result,
                        user: req.user
                    });
            }
        }

    });

};


// Passport sign in


exports.findByUsername = function(username, cb) {
    console.log(username);
  process.nextTick(function() {
        console.log(username);
        var queryName = 'SELECT * FROM employee WHERE username = "'+ username +'"';
        db.query(queryName,function(err, result) {
        console.log(result);
      if (result[0] != undefined) {
        return cb(null, result[0]);
      }
    
    return cb(null, null);
        });
  });
    };

//Finding by the userId

    exports.findById = function(id, cb) {
    console.log(id);
  process.nextTick(function() {
    var queryName = 'SELECT * FROM employee WHERE id = "'+ id +'"';
    db.query(queryName,function(err, result) {
        console.log(result);
      if (result[0] != undefined) {
        return cb(null, result[0]);
      }
    
    return cb(null, null);
        });
  });
};
