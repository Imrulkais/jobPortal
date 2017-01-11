var express = require('express');
var router = express.Router();
var db = require('../db');



//Adding the user

exports.addUser = function(usr){


	console.log(usr);
    var details = {
        firstname: usr.firstname,
        lastname: usr.lastname,
        username: usr.username,
        password: usr.password,
        confirmPassword: usr.confirmPassword
    };
    db.query('INSERT into  `test` SET ?', details, function (err, result) {
        if (err)
            throw err;
        console.log(' The value inserted. ');
    });

};