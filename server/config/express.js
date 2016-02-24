var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

module.exports = function(app, config) {
    // express 설정
    
    // bodyParser
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded    

    // client 폴더 위치 지정 html, css ...
    app.use(express.static(path.resolve(__dirname, '../../client')));
    
    // router 등록
    require('./routes')(app);
};