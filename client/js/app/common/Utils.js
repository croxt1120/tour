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
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    var _numberWithoutCommas = function(str) {
        return str.toString().replace(/,/g, "") * 1;
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
	    checkTimeFormat: _checkTimeFormat
	};
} );