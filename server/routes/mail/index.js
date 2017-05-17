var express = require('express');
var router = express.Router();


var nodemailer = require('nodemailer');
var smtp = require("nodemailer-smtp-transport");

var transport = nodemailer.createTransport(smtp({
    service : "Gmail",
    auth: {
        user: 'jeongkilahan@gmail.com',
        pass: 'ajk405..'
    }
    // host: 'smtp.naver.com',
    // port: 587,
    // secure : true,
    // auth: {
    //     user: 'jeongkilahan',
    //     pass: 'ajk405..'
    // },
    // rejectUnauthorized: false,
    // connectionTimeout:10000
}));

router.post('/', function(req, res) {
  var mailOptions= {
      from: 'hanatour2009@live.co.kr', // sender address 
      to: [
            { address: req.body.mail },
          ],
      subject : "test",
      html : req.body.html,
  };
  
  console.log(JSON.stringify(req.body));
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