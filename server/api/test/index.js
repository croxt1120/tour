var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');


var PATH_DATAS_DIR = '../../datas/';

/*
router.param( function(req, res, next) {
   console.log('data');
   
   console.log(req.params); 
   next();
});
*/





// router.get('/test.do', function(req, res, next) {
//     var filePath = path.resolve(__dirname, PATH_DATAS_DIR + 'test.json');
//     var data = {};
//     console.log(filePath);
//     if(!fs.existsSync(filePath)) {
//         console.log("File not found");
//         data['isSuccess'] = false;
//     } else {
//         var text = fs.readFileSync(filePath,'utf8');
//         data['data'] = JSON.parse(text);
//         data['isSuccess'] = true;
//     }
//     return res.json(data);
// });

// router.param('fileName', function(req, res, next, id) {
//     console.log('param');
//     console.log(req.params);
//     console.log(req.body);
//     console.log(id);
//     console.log("-----------------");
//   next();
// });


router.get('/post/:fileName', function(req, res, next){
    console.log('dfdfdf');
    return res.json({test: 'get'});
});


// router
// .route('/post/:fileName')
// .get(function(req, res, next){
//     console.log('dfdfdf');
//     return res.json({test: 'get'});
// })
/*.post(function(req, res, next) {

    console.log('============================');
    console.log('post');
    console.log(req.params);
    console.log(req.body);
    console.log('-----------------');
    return res.json({test:'post'});    
});*/

/*
router.post('/post/:fileName', function(req, res, next) {

});
*/

module.exports = router;