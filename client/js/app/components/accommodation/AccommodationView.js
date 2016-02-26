define([
        'jquery',
        'underscore',
        'backbone',
        'custom/View',
        'datas/Hotels',
        'text!components/accommodation/tpls/rowTpl.html',
        'text!components/accommodation/tpls/accommodationTpl.html'
], function ( 
		$,
		_,
		Backbone,
		View,
		Hotels,
		rowTpl,
		accommodationTpl
		) {
//////////////////////////////////////////////////////////////
			// 숙소 selector
			var _createAccSelector = function($target) {
				var data = [];
        		_.each(Hotels, function(food) {
        			data.push({
        				id: food.phone,
        				text: food.name
        			});
        		});				
				
	        	$target.select2({
	        		data: data
	        	});
	        	
	        	$target.on("select2:select", function (e) {
	        		$target.val( this.value );
	        	});
				return $target;
			};

/////////////////////////////////////////////////////////////////////////			
			var RowView = View.extend({
		        initialize: function(param) {
		        	this.viewID = param.viewID;
		        	this._day = param.day;
		            this.render(param.day);
		        },
		        
		        render: function(day) {
		        	var _this = this;
		        	var tpl = _.template(rowTpl)( {viewID: this.viewID, day: this._day} );
		        	this.setElement(tpl);
		        	
					var data = [];
	        		_.each(Hotels, function(food) {
	        			data.push({
	        				id: food.phone,
	        				text: food.name
	        			});
	        		});				
					
		        	this.$('.select-acc').select2({
		        		data: data
		        	});
		        	
		        	this.$('.select-acc').on("select2:select", function (e) {
		        		_this.$('.input-acc-phone').val( this.value );
		        	});



		            return this;
		        },
		        
		        getData: function() {
		        	var data = {};
		        	data['day'] = this._day;
		        	data['name'] = this.$('.select-acc option:selected').text();
		        	data['phone'] = this.$('.select-acc option:selected').val();
		        	
		        	return data;
		        },
		        
		        setData: function() {
		        },
		        
			    destroy: function(){
			    	this.remove();
			    }
			});


//////////////////////////////////////////////////////////////
			var ROW_ID_SUFFIX = 'acc';
			var ROW = '.accommodation-table tbody tr';
			var ROWS = '.accommodation-table tbody';

		    var AccommodationView = View.extend({
		        initialize: function() {
		        	this._children = {};
		            this.render();
		        },
		        
		        render: function() {
		        	this.setElement(accommodationTpl);
		            return this;
		        },
		        
		        events: {
		        },

		        getData: function() {
		        	var data = [];
				  
		        	var children = this.getChildren();
		        	_.each(children, function(child) {
		        		data.push(child.getData());
		        	});				  
				  
				  /*
				  var accLen = this.$(ROW).length;
				  var tViewID = "";
				  
				  for (var i = 1; i <= accLen; i++) {
				  	tViewID = "#"+ ROW_ID_SUFFIX + i;
				  	
				  	data.push({
				  		day: i,
				  		name: this.$(tViewID + ' .input-acc-name' ).val(),
				  		phone: this.$(tViewID + ' .input-acc-phone' ).val(),
				  	});
				  }
				*/

				  return data;
		        },
		        
		        setData: function(data) {
		        },
		        
		        changeDay: function(days) {
		        	// 숫자 변환
		        	days = days * 1;
		        	
		        	var accLen = this.$(ROW).length;
		        	var diffDays = days - accLen;
		        	var tViewID = "";
		        	
		        	if (diffDays > 0) { // 추가
		        		var tDay = "";
		        		for (var i = 1; i <= diffDays; i++) {
		        			tDay = accLen + i;
		        			tViewID = ROW_ID_SUFFIX + tDay;
		        			
				        	var rowView = new RowView({viewID: tViewID,day: tDay});
				        	this.addChild(ROWS, rowView);
		        		}
		        	} else if (diffDays < 0) { // 삭제
		        		// 양수 변환
		        		var st = diffDays * -1;
		        		
		        		for (var i = 1; i <= st; i++) {
		        			tViewID = ROW_ID_SUFFIX +(days+i); 
		        			this.removeChild(tViewID);
		        		}
		        	}
		            return this;
		        },
		        
			    destroy: function(){
			    }
		    });
		    
		    return AccommodationView;
} );