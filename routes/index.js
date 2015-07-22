var express = require('express');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var Report = require('../models/report');
var path = require('path');
var fs = require('fs');

var config = require('../config');


var transporter = nodemailer.createTransport(smtpTransport({
  host: 'mail.nbi.ac.uk',
  port: 25
}));

var router = express.Router();

router.route('/')
  .get(function (req, res) {
    res.render('index');
  })
  .post(function (req, res) {
    var allegation = req.body.allegation;
    var attachments = req.files['attachment[]'];
    var files = [];

    if (attachments) {
      saveFiles(attachments, function () {
        makeSaveAndRender();
        sendEmail(allegation);
      })
    } else {
      makeSaveAndRender();
      sendEmail(allegation);
    }


    function makeSaveAndRender() {
      var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      var report = new Report({allegation: allegation, ip: ip, files: files});
      report.save().then(function () {
        res.render('success');
      }).error(function (err) {
        res.render('error', {error: err});
      });
    }

    function saveFiles(attachments, cb) {

      attachments.forEach(function (a) {
        var attachmentExtention = path.extname(a.name);

        var newName = new Date().getTime().toString() + attachmentExtention;
        var publicPath = config.url + '/uploads/' + newName;
        var privatePath = './public/uploads/' + newName;

        var data = fs.readFile(a.path);
        fs.writeFileSync(privatePath, data);
        files.push(publicPath);
      });
      cb();
    }

    function sendEmail(allegation) {


      var fileList = '';

      var filesText = '';
      if (files && files.length) {

        files.forEach(function (f) {
          fileList += '\n' + f;
        });

        filesText = '\nattachments: ' + fileList;
      }

      config.emails.forEach(function (emailAddress) {
        if (emailAddress)
          transporter.sendMail({
            from: 'scinteg@tsl.ac.uk',
            to: emailAddress,
            subject: 'REPORT OF SCIENTIFIC MISCONDUCT',
            text: allegation + filesText
          }, function (error, info) {
            if (error) {
              console.error(error);
            } else {
              console.log('Message sent:', info.response);
            }
          });
      })

    }

  });


module.exports = router;
