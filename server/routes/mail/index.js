var express = require('express');
var router = express.Router();


var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


var transport = nodemailer.createTransport(smtpTransport({
    host: '',
    port: 587,
    auth: {
        user: '',
        pass: ''
    },
    rejectUnauthorized: false,
    connectionTimeout:10000
}));

router.post('/', function(req, res) {
  var mailOptions= {
      from: '', // sender address 
      to: [
            { name: "", address: ""},
          ],
      subject : "",
      html : req.body.html,
  	  text : "",
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