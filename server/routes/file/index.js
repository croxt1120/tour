// init the uploader 
var express = require('express');
var router = express.Router();
var options=  {
    tmpDir: __dirname + '/../../image/tmp', // tmp dir to upload files to 
    uploadDir: __dirname + '/../../../client/image/', // actual location of the file 
    uploadUrl: '/image', // end point for delete route 
    API_URL : '/file/upload',
    maxPostSize: 11000000000, // 11 GB 
    minFileSize: 1,
    maxFileSize: 10000000000, // 10 GB 
    acceptFileTypes: /.+/i,
    inlineFileTypes: /\.(gif|jpe?g|png)/i,
    imageTypes:  /\.(gif|jpe?g|png)/i,
    copyImgAsThumb : true, // required 
    imageVersions :{
        maxWidth : 200,
        maxHeight : 200
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
    },
    storage : {
        type : 'local', // local or aws 
    }
};

var uploader = require('uni-blueimp-file-upload-expressjs')(options);
 
router.get('/upload', function(req, res) {
  uploader.get(req, res, function (obj) {
        res.send(JSON.stringify(obj));
  });

});

router.post('/upload', function(req, res) {
  uploader.post(req, res, function (obj, redirect, error) {
      if(!error)
      {
        res.send(JSON.stringify(obj));
      }
  });

});

// the path SHOULD match options.uploadUrl 
router.delete('/upload/:name', function(req, res) {
  uploader.delete(req, res, function (obj) {
        res.send(JSON.stringify(obj));
  });

});

module.exports = router;