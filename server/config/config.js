var path = require('path');
var config = {
    db:{},
    server:{},
    file : {
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
            maxWidth : 900,
            maxHeight : 600
        },
        accessControl: {
            allowOrigin: '*',
            allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
            allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
        },
        storage : {
            type : 'local', // local or aws 
        }
    },

    mailOptions : {
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
    }
    
};

module.exports = config;