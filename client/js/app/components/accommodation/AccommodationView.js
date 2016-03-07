define([
        'jquery',
        'underscore',
        'backbone',
        'custom/View',
        'datas/Tour',
        'text!components/accommodation/tpls/rowTpl.html',
        'text!components/accommodation/tpls/accommodationTpl.html'
], function ( 
		$,
		_,
		Backbone,
		View,
		Tour,
		rowTpl,
		accommodationTpl
		) {

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
		        	
		        	var hotels = Tour.getHotels();
					var data = [];
	        		_.each(hotels, function(hotel) {
	        			data.push({
	        				id: hotel.phone,
	        				text: hotel.name
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
		        	var hotels = Tour.getHotels();
		        	var hotelName = this.$('.select-acc option:selected').text();
		        	var hotelObj = _.findWhere(hotels, {name: hotelName});
		        	var data = {};
		        	
		        	if (!_.isUndefined(hotelObj)) {
			        	data = _.clone(hotelObj);
		        	} else {
		        		data['name'] = '';
		        		data['phone'] = '';
		        		data['address'] = '';
		        	}
		        	data['day'] = this._day;
		        	return data;
		        },
		        
		        setData: function(data) {
		        	this.$('.select-acc option:selected').text(data.name);
		        	this.$('.input-acc-phone').val( data.phone );
		        },
		        
			    destroy: function(){
			    	this.remove();
			    }
			});


//////////////////////////////////////////////////////////////
			var ROW_ID_SUFFIX = 'acc';
			var ROW = '.accommodation-table tbody tr';
			var ROWS = '.accommodation-table tbody';
			
			var _createChild = function(tDay) {
				var tViewID = ROW_ID_SUFFIX + tDay;
				var rowView = new RowView({viewID: tViewID, day: tDay});
				return rowView;
			};

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
				  
				  return data;
		        },
		        
		        setData: function(accInfos) {
		        	console.log(accInfos);
		        	var _this = this;
		        	_.each(accInfos, function(accInfo) {
						var rowView = _createChild(accInfo.day);
						rowView.setData(accInfo);
				        _this.addChild(ROWS, rowView);		        		
		        	});
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
				        	var rowView = _createChild(tDay);
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