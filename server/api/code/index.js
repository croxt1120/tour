var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var PATH_DATAS_DIR = '../../datas/';

<<<<<<< HEAD
router.get('/:fileName', function(req, res, next) {
        // console.log(req.params);
        // console.log(req.params.fileName);
        
        var filePath = path.resolve(__dirname, PATH_DATAS_DIR + req.params.fileName + '.json');
=======
 router.get('/code/:finde', function(req, res, next) {
     
        console.log(req.body);
        console.log(req.params);
        console.log( req.params.fileName);
        
        // var filePath = path.resolve(__dirname, PATH_DATAS_DIR + req.params.fileName + '.json');
        // // var filePath = path.resolve(__dirname, PATH_DATAS_DIR + 'food.json');
>>>>>>> f78a36d356156177514fffb1fb9a0f7ef6bea4e0
        
        // var data = {};
        // console.log(filePath);
        
<<<<<<< HEAD
        if(!fs.existsSync(filePath)) {
            console.log("File not found");
            data['isSuccess'] = false;
        } else {
            var text = fs.readFileSync(filePath,'utf8');
            // console.log("## text -> " + text);
            data['data'] = JSON.parse(text);
            data['isSuccess'] = true;
        }
        
        return res.json(data);
});
    
router.post('/:fileName', function(req, res, next) {
    console.log(req.body);
    console.log(req.params);
    // console.log(req.params.fileName);
    
    var filePath = path.resolve(__dirname, PATH_DATAS_DIR + req.params.fileName + '.json');
    // // var filePath = path.resolve(__dirname, PATH_DATAS_DIR + 'food.json');
    
    // var data = {};
    // console.log(filePath);
    
    if(!fs.existsSync(filePath)) {
        console.log("File not found");
        // data['isSuccess'] = false;
    } else {
    //     var text = fs.readFileSync(filePath,'utf8');
    //     console.log("## text -> " + text);
    //     data['data'] = JSON.parse(text);
    //     data['isSuccess'] = true;
        // var myData = [{name: "국밥", price:"5000", explain:"good"},{name: "초밥", price:"7000", explain:"bad"}];
        fs.writeFile(filePath, req.body.saveData, 'utf-8', function(err) {
           if(err)
            console.log(err);
            
        });
    }
    
    return res.json({data: 3});
    // return res.json(data);
});
=======
        // if(!fs.existsSync(filePath)) {
        //     console.log("File not found");
        //     data['isSuccess'] = false;
        // } else {
        //     var text = fs.readFileSync(filePath,'utf8');
        //     console.log("## text -> " + text);
        //     data['data'] = JSON.parse(text);
        //     data['isSuccess'] = true;
        // }
        
        return res.json({fdf:232323});
    });
>>>>>>> f78a36d356156177514fffb1fb9a0f7ef6bea4e0
    

module.exports = router;