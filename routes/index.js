var express = require('express');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var Report = require('../models/report');

var router = express.Router();

router.route('/')
  .get(function (req, res) {
    res.render('index');
  })
  .post(function (req, res) {
    var allegation = req.body.allegation;
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var report = new Report({allegation: allegation, ip: ip});

    report.save().then(function () {

      var transporter = nodemailer.createTransport(smtpTransport({
        host: 'mail.nbi.ac.uk',
        port: 25
      }));

      transporter.sendMail({
        from: 'scinteg@tsl.ac.uk',
        to: 'martin.page@tsl.ac.uk',
        subject: 'REPORT OF SCIENTIFIC MISCONDUCT',
        text: allegation
      }, function (error, info) {
        if (error) {
          console.error(error);
        } else {
          console.log('Message sent:', info.response);
        }
      });

      res.render('success');
    }).error(function (err) {
      res.render('error', {error: err});
    });

  });


module.exports = router;
