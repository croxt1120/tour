var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var PATH_TOUR_DIR = path.resolve(__dirname, '../../datas/tour');

router.get('/', function(req, res, next){
    var data = {};
    
    if (fs.existsSync(PATH_TOUR_DIR)) {
        var files = fs.readdirSync(PATH_TOUR_DIR);
        
        var list = [],
            file = "";
        for (var idx in files) {
            file = files[idx].replace('.json', '');
            // console.log(file);
            list.push( file );
        }
        
        
        data['list'] = list;
        data['isSuccess'] = true;        
        
    } else {
        console.log("File dir not found.");
        data['msg'] = "File dir not found";
        data['isSuccess'] = false;
    }
    
    // console.log(data);
    return res.json(data);
});


router
.route('/:tourName')
.get(function(req, res, next){

    // console.log('============================');
    // console.log('post');
    // console.log(req.params);
    // console.log(req.body);
    // console.log('-----------------');

    var tourName = req.params.tourName;
    var filePath = PATH_TOUR_DIR + "/" + tourName + ".json";
    // console.log(filePath);
    
    var data = {};
    if (fs.existsSync(filePath)) {
        var file = fs.readFileSync(filePath,'utf8');
        file = JSON.parse(file);
        
        data['tourInfo'] = file;
        data['isSuccess'] = true;        
    } else {
        console.log("File not found :" + tourName);
        data['msg'] = "File not found: " + tourName;
        data['isSuccess'] = false;
    }

    return res.json(data);
})
.post(function(req, res, next) {

    // console.log('============================');
    // console.log('post');
    // console.log(req.params);
    // console.log(req.body);
    // console.log(req.body.saveData);
    // console.log('-----------------');

    var tourName = req.params.tourName;
    var filePath = PATH_TOUR_DIR + "/" + tourName + ".json";
    // console.log(filePath);
    
    var data = {};
    if (fs.existsSync(PATH_TOUR_DIR)) {
        
        var isOverWrite = req.body.isOverWrite;
        var isExisted = fs.existsSync(filePath);
        
        // console.log(isOverWrite + "/" + isExisted);
        
        if ( !isExisted || (isExisted && isOverWrite === 'true') ) {
            fs.writeFile(filePath, req.body.saveData, 'utf-8');
            data['isSuccess'] = true;
        } else {
            data['isExisted'] = true;
            data['msg'] = "같은 이름의 데이터가 존재합니다.";
            data['isSuccess'] = false;
        }
        
    } else {
        console.log("File dir not found.");
        data['msg'] = "File dir not found";
        data['isSuccess'] = false;
    }

    return res.json(data);
})
.delete(function(req, res, next) {

    // console.log('============================');
    // console.log('delete');
    // console.log(req.params);
    // console.log(req.body);
    // console.log('-----------------');

    var tourName = req.params.tourName;
    var filePath = PATH_TOUR_DIR + "/" + tourName + ".json";
    // console.log(filePath);
    
    var data = {};
    if (fs.existsSync(PATH_TOUR_DIR)) {
        fs.unlinkSync(filePath);
        data['isSuccess'] = true;
    } else {
        console.log("File not found.");
        data['msg'] = "File not found";
        data['isSuccess'] = false;
    }

    return res.json(data);
});

module.exports = router;