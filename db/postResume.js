var express = require('express');
var router = express.Router();
var db = require('../db');
var postResume = require('../db/postResume');


exports.findNationalID = function(req, res){

console.log('coming here with national id');

var queryName = 'SELECT * FROM employeeAccount WHERE nationalidnumber = "'+ req.body.nationalID +'"';
db.query(queryName,function(err, result) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result[0]); 
        if(result[0] != undefined)
        {
            console.log("here it is"); 
            req.flash('nationalIDRequired', 'The nationalID is already exist');
            res.redirect('/postResume');
        }
        else 
            postResume.findEmployeeEmail(req, res);
    }
    
});
        
};

exports.findEmployeeEmail = function(req, res){
console.log('email is getting');

var queryName = 'SELECT * FROM employeeAccount WHERE email = "'+ req.body.email +'"';
db.query(queryName,function(err, result) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result[0]); 
        if(result[0] != undefined)
        {
            req.flash('email', 'email is exist');
            res.redirect('/postResume');

        }
        else 
            postResume.addEmployee(req, res);
    }
    
});

};

exports.addEmployee = function(req, res){

    console.log("error not found");
    var usr = req.body;
    console.log(usr);
    var details = {
        name: usr.username,
        fathersName: usr.fathername,
        mothersName: usr.mothersname,
        gender: usr.gender,
        nationality: usr.natioanality,
        nationalidnumber: usr.nationalID,
        presentAddress: usr.presentAddress,
        permanentAddress: usr.permanentAddress,
        email: usr.email,
        mobile: usr.mobile,
        objective: usr.objective,
        presentSalary: usr.PresentSalary,
        expectedSalary: usr.expectedSalary,
        joblevel: usr.radioGroup,
        careerSummary: usr.careerSammary,
        specialQualification: usr.SpecialQualification
    };
    db.query('INSERT into  `employeeAccount` SET ?', details, function (err, result) {
        if (err)
            console.log("Error is here --" + err);
        else{
        console.log(' The value inserted. ');
                req.flash('success', 'Your resume has been successfully updated.');
            res.redirect('/postResume');
        }
    });

};