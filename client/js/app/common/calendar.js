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
	
	
	
	return {
	    isNumber: _isNumber

	};
} );