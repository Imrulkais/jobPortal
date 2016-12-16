/**
 * Created by Naim on 07-Dec-16.
 */

var express = require('express');
var router = express.Router();
var db = require('../db');
var postjobAction = require('../db/postjobAction');






exports.addJob = function(req, res, id ){

    var usr = req.body;
    console.log(usr);
    var details = {
        companyname: usr.txtCompanyName,
        companyindustrytype: usr.cboJobIndustryType,
        jobtitle: usr.txtJobTitle,
        noofvacancies: usr.txtTotalVacancy,
        jobdetails: usr.txtJobDetails,
        applyinstructions: usr.txtApplyInstruction,
        applicationdeadline: usr.txtDeadlineNew,
        billingcontact: usr.txtBillingContact,
        employeerId: id,

    };
    db.query('INSERT into  `postnewjob` SET ?', details, function (err, result) {
        if (err)
            throw err;
        else{
            console.log(' The value inserted. ');
            req.flash('success', 'Your job has been successfully published.');
            res.redirect('/postnewjobs');
        }

    });

};

exports.postedJobs = function(req, res, user ){

console.log("coming here now");
    var queryName = 'SELECT * FROM postnewjob WHERE employeerId = "'+ user.id +'"';
    db.query(queryName,function(err, result) {
    if (err) {
        console.log(err);
    }
    else {

        res.render('postedjob',
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
