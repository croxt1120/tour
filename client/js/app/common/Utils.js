define([
        'underscore',
        'backbone'
	], function (
		_,
		Backbone
		) {
	var _isNumber = function(num) {
    	if (_.isNumber(num) && !_.isNaN(num) ) {
    		 return true;
    	} else {
    	    return false;
    	}
	};
	
	var _numberWithCommas = function(x) {
	    x = Math.round(x * 1);
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    var _numberWithoutCommas = function(str) {
        return str.toString().replace(/,/g, "") * 1;
    };
    
    var _getPrintDate = function(start, end){
		var text = start.format("YYYY년 MM월 DD일");
		if(start.year() == end.year()){
			if(start.month() == end.month()){
				if(start.day() == end.day()){
					
				} else {
					text += " ~ " + end.format("DD일");
				}
			}else{
				text += " ~ " + end.format("MM월 DD일");
			}
		}else{
			text += " ~ " + end.format("YYYY년 MM월 DD일");
		}
		return text;
	};
	
    var _checkInputMoney = function(money) {
        // 콤마 제거
        money = _numberWithoutCommas(money);
        
        if (!_isNumber(money)) {
            alert("입력 값이 잘 못 되었습니다.");
            money = 0;
        }else if (money.length > 9) {
            alert("천만원 단위까지만 입력 가능합니다.");
            money = 0;
        } else {
            money = _numberWithCommas(money);
        }
        
        return money;
    };
    
    var _checkTimeFormat = function(timeStr) {
        var regexp = /([01][0-9]|[02][0-3]):[0-5][0-9]/;
        var isValid = regexp.test(timeStr);
        return isValid;
    }
	
	return {
	    isNumber: _isNumber,
	    numberWithCommas: _numberWithCommas,
	    numberWithoutCommas: _numberWithoutCommas,
	    checkInputMoney: _checkInputMoney,
	    checkTimeFormat: _checkTimeFormat,
	    getPrintDateRange : _getPrintDate
	};
} );