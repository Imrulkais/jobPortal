/**
 * Created by Naim on 07-Dec-16.
 */

var express = require('express');
var router = express.Router();
var db = require('../db');
var path = require('path');

exports.singleJobs = function(req, res, Id ){

    var queryName = 'SELECT * FROM postnewjob WHERE id = "'+ Id +'"';

    db.query(queryName,function(err, result) {
    if (err) {
        console.log(err);
    }
    else {
    	// console.log("Formindustry--" + result[0].companyindustrytype);
     //    var industry = db.query('SELECT * FROM industry WHERE id = "'+ result[0].companyindustrytype +'"');
     //    console.log("industry--" + industry[0]);

        var newquery = 'SELECT * FROM industry WHERE id = "'+ result[0].companyindustrytype +'"';
        db.query(newquery,function(error, industry) {
    if (err) {
        console.log(err);
    }
    else{
    console.log("industry:" +industry[0].name);
        res.render('singlejob',
        {
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
            singlejob : result,
            industry : industry[0],
            user: req.user
        });
    	}
    });
    }
   }); 
}



exports.allJobs = function(req, res, Id ){

console.log("Employee id is:" + Id);
    var queryName = 'SELECT * FROM postnewjob WHERE companyindustrytype = "'+ Id +'"';
    db.query(queryName,function(err, result) {
    if (err) {
        console.log(err);
    }
    else {
        
        res.render('allpostedjobs',
        {
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
            user : user,
            jobs : result
        });

//         // req.flash('jobs', result);
//         //     res.redirect('/postnewjobs');
    }
    
});

}
