var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var PATH_DATAS_DIR = '../../datas/';

router.get('/', function(req, res, next) {
        console.log("all");
        
        var data = {};

        var foodPath = path.resolve(__dirname, PATH_DATAS_DIR + 'food.json'),
            hotelPath = path.resolve(__dirname, PATH_DATAS_DIR + 'hotel.json'),
            schedulePath = path.resolve(__dirname, PATH_DATAS_DIR + 'schedule.json');
        
        
        if(!fs.existsSync(foodPath) || !fs.existsSync(hotelPath) || !fs.existsSync(schedulePath)) {
            console.log("File not found :");
            data['msg'] = "File not found: food";
            data['isSuccess'] = false;
            return res.json(data);
        } else {
            var foods, hotels, schedules;
            foods = fs.readFileSync(foodPath,'utf8');
            foods = JSON.parse(foods);
            
            hotels = fs.readFileSync(hotelPath,'utf8');
            hotels = JSON.parse(hotels);
            
            schedules = fs.readFileSync(schedulePath,'utf8');
            schedules = JSON.parse(schedules);
            data['isSuccess'] = true;
            data['msg'] = 'success';
            data['data'] = {
              foods: foods,
              hotels: hotels,
              schedules: schedules
            };
            return res.json(data);
        }
});

router.get('/:fileName', function(req, res, next) {
    var filePath = path.resolve(__dirname, PATH_DATAS_DIR + req.params.fileName + '.json');
 
    var data = {};
    
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
    
router.post('/:fileName', function(req, res, next) {
    var saveData = req.body.saveData;
    var fileName = req.params.fileName;
    console.log(new Date() + "========================================================");
    console.log("code save : " + fileName);
    // console.log(saveData);
    console.log("=====================================================================");    
    
    var filePath = path.resolve(__dirname, PATH_DATAS_DIR + fileName + '.json');
    var data = {};
    fs.writeFile(filePath, saveData, 'utf-8');
    data['isSuccess'] = true;
    return res.json(data);
});

module.exports = router;