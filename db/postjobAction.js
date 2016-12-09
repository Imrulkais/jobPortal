/**
 * Created by Naim on 07-Dec-16.
 */

var express = require('express');
var router = express.Router();
var db = require('../db');
var postjobAction = require('../db/postjobAction');




exports.addJob = function(req, res ){

    var usr = req.body;
    console.log(usr);
    var details = {
        companyname: usr.txtCompanyName,
        jobcategory: usr.cboJobCategory,
        companyindustrytype: usr.cboJobIndustryType,
        jobtitle: usr.txtJobTitle,
        noofvacancies: usr.txtTotalVacancy,
        jobdetails: usr.txtJobDetails,
        applyinstructions: usr.txtApplyInstruction,
        applicationdeadline: usr.txtDeadlineNew,
        billingcontact: usr.txtBillingContact,

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