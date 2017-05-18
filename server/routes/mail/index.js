var config = require('../../config/config');
var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var smtp = require("nodemailer-smtp-transport");

var transport = nodemailer.createTransport(smtp(config.mailOptions));

router.post('/', function(req, res) {
  var mailOptions= {
      from: 'hanatour2009@live.co.kr', // sender address 
      to: [
            { address: req.body.mail },
          ],
      subject : req.body.title,
      html : req.body.html,
  };
  
  transport.sendMail(mailOptions, function(err, info){
    var data  = {};
    if(err){ //메일 보내기 실패시 
        console.log(err);
        data['isSuccess'] = false;     
    }else{
        data['isSuccess'] = true;     
    }
    
    return res.json(data);
  });  
});

module.exports = router;