var http = require('http');
var express = require('express');
var config = require('./server/config/config');

var app = express();
require('./server/config/routes')(app);
require('./server/config/express')(app, config);


var server = http.createServer(app);
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log(addr.address + ":" + addr.port);
});