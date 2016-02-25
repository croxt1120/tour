var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var PATH_DATAS_DIR = '../../datas/';

router.get('/test/:fileName', function(req, res, next) {

    var filePath = path.resolve(__dirname, PATH_DATAS_DIR + 'test.json');
    var data = {};
    console.log(filePath);
    
    if(!fs.existsSync(filePath)) {
        console.log("File not found");
        data['isSuccess'] = false;
    } else {
        var text = fs.readFileSync(filePath,'utf8');
        data['data'] = JSON.parse(text);
        data['isSuccess'] = true;
    }
    
    return res.json(data);
});

module.exports = router;