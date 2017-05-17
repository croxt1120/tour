var express = require('express');
var router = express.Router();


var nodemailer = require('nodemailer');


var transport = nodemailer.createTransport("smtp", {
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
});

router.post('/', function(req, res) {
  var mailOptions= {
      from: 'jeongkilahan@naver.com', // sender address 
      to: [
            { name: "carran", address: "carran@naver.com"},
          ],
      subject : "test",
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