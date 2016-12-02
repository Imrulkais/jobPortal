var express = require('express');
var router = express.Router();
var db = require('../db');


exports.findEmployeeName = function(user){

console.log(user);
var queryString = 'SELECT * FROM `employee` WHERE username = ?';
db.query(queryString,[user] ,function(err, result) {
    if (err) throw err;

    else {
        console.log(result);
        return result;
    }
});
// return db.query('SELECT * from  `employee`');
 // console.log(found);
 // return found;
        // if (found) {
        //     console.log('username available');
        //     return user;
        // };
};

exports.addEmployee = function(usr){


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
        console.log(' The value inserted. ');
    });

};