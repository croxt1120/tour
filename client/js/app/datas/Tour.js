define([
        'underscore',
        'backbone'
	], function (
		_,
		Backbone
		) {
			
			var _code = {};
			var _foods ={};
			var _hotels = {};
			var _schedules = {};
			
			var _loadCode = function() {
				var dfd = $.Deferred();
				$.ajax({
		        		url: "/code",
		        		dataType: "json",
		        		type: "GET",
	        		}).done(function(data) {
	        			if (data['isSuccess']) {
	        				_code = data['data'];
	        				
	        				_foods = _code.foods;
	        				_hotels = _code.hotels;
	        				_schedules = _code.schedules;
	        				
	        				dfd.resolve();
	        			} else {
	        				dfd.reject();
	        			}
	        		}).fail(function() {
	        			dfd.reject();
	        		}).always(function() {
	        		});
	        	
	        	return dfd.promise();
			};
			
			return {
				loadCode: _loadCode,
				getCode: function(code) {
					return _code[code];
				},
				getFoods: function() {
					return _code['foods'];
				},
				getHotels: function() {
					return _code['hotels'];
				},
				
				getSchedules: function() {
					return _code['schedules'];
				}
			};
} );