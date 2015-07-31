var express = require('express');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var Report = require('../models/report');
var path = require('path');
var fs = require('fs');
var uuid = require('node-uuid');

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


    if (allegation && allegation.length && allegation.length > 0) {
      if (attachments) {

        saveFiles(attachments, function () {
          makeSaveAndRender();
          sendEmail(allegation, attachments);
        })
      } else {
        makeSaveAndRender();
        sendEmail(allegation);
      }

    } else {
      return res.render('error', {error: ''});
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


      if (attachments.length) {
        attachments.forEach(function (a) {
          saveIt(a)
        });
      } else {
        saveIt(attachments);
      }

      function saveIt(a) {

        var attachmentExtention = path.extname(a.name);

        var newName = uuid.v1() + attachmentExtention;
        var publicPath = config.url + '/uploads/' + newName;
        var privatePath = './public/uploads/' + newName;


        var data = fs.readFileSync(a.path);
        console.error(a.path);
        fs.writeFileSync(privatePath, data);
        files.push(publicPath);
      }
      cb();
    }

    function sendEmail(allegation, attachments) {

      var attachmentObjects = [];
      if (attachments) {

        if (!attachments.length) {
          attachments = [attachments];
        }

        attachments.forEach(function (a) {
          attachmentObjects.push({
            filename: a.originalname,
            path: a.path
          });
        });
      }

      config.emails.forEach(function (emailAddress) {
        if (emailAddress)
          transporter.sendMail({
            from: 'scinteg@tsl.ac.uk',
            to: emailAddress,
            subject: 'REPORT OF SCIENTIFIC MISCONDUCT',
            text: allegation + '\n\n',
            attachments: attachmentObjects
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
