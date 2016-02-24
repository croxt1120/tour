var path = require('path');
var express = require('express');

module.exports = function(app, config) {
    console.log('express setting');
    
    // client 폴더 위치 지정 html, css ...
    app.use(express.static(path.resolve(__dirname, '../../client')));
};