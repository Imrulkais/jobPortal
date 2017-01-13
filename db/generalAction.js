
var express = require('express');
var router = express.Router();
var db = require('../db');
var path = require('path');
var generalAction = require('../db/generalAction');


//Getting the single job details

exports.singleJobs = function(req, res, Id, value ){

    var queryName = 'SELECT * FROM postnewjob WHERE id = "'+ Id +'"';

    db.query(queryName,function(err, result) {
    if (err) {
        console.log(err);
    }
    else {

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
                    user: req.user,
                    value: value
                });
            	}
    });
    }
   }); 
}

//Getting the jobs in a specific category

exports.allJobs = function(req, res, user, Id ){

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

//Getting the signed in user all applied jobs

exports.applyJob =  function(req, res, userId, Id ){

console.log("Employee id is:" + Id);

var queryName = 'SELECT * FROM appliedjobs WHERE userid = "'+ userId +'" and jobid= "'+ Id +'"';

db.query(queryName,function(err, result) {
    if (err) {
        console.log(err);
    }
    else
    {
        if(result[0]!= undefined){
            var message = 'You have already applied for this job!';
            generalAction.singleJobs(req,res,Id,message);
        }
        else{
                var details = {
                jobid: Id,
                userid: userId
                };
                db.query('INSERT into  `appliedjobs` SET ?', details, function (err, result) {
                    if (err)
                        throw err;
                    else{
                        var insertMessage = 'Your application has been completed successfully!';
                        generalAction.singleJobs(req,res,Id,insertMessage);
                    }
                });
        }
        
    }
});
}

// Search by title

exports.searchByTitle = function(req, res){

    var queryName = 'SELECT * FROM postnewjob WHERE jobtitle LIKE "%'+ req.body.searchvalue +'%"';
    console.log(queryName);
    db.query(queryName,function(err, result) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
        res.render('searchresult',
        {
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
            user: req.user,
            jobs : result
        });

//         // req.flash('jobs', result);
//         //     res.redirect('/postnewjobs');
    }

});

}