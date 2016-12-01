var express = require('express');
var router = express.Router();
var db = require('../db');

exports.addEmployer = function(usr){


	console.log(usr);
    var details = {
        aEmail: usr.aEmail,
        password: usr.password,
        cName: usr.cName,
        cPersonName: usr.cPersonName,
        cPersonDesignation: usr.cPersonDesignation,
        cPersonMobile: usr.cPersonMobile,
        cPersonEmail: usr.cPersonEmail,
        industryType: usr.industryType,
        bDescription: usr.bDescription,
        pEmail: usr.pEmail,
        pCountry: usr.pCountry,
        pCity: usr.pCity,
        pContactAddress: usr.pContactAddress,
        pContactPhone: usr.pContactPhone,
        webAddress: usr.webAddress,
        policy: usr.policy
    };
    db.query('INSERT into  `employer` SET ?', details, function (err, result) {
        if (err)
            throw err;
        console.log(' The value inserted. ');
    });

};