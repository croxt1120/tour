define([
        'jquery',
        'underscore',
        'backbone',
        'custom/View',
        'text!components/accommodation/tpls/rowTpl.html',
        'text!components/accommodation/tpls/accommodationTpl.html'
], function ( 
		$,
		_,
		Backbone,
		View,
		rowTpl,
		accommodationTpl
		) {

/////////////////////////////////////////////////////////////////////////			
			var RowView = View.extend({
		        initialize: function(param) {
		        	this.viewID = param.viewID;
		        	this._day = param.day;
		            this.render(param.day);
		            this._hotels = [];
		        },
		        
		        render: function(day) {
		        	var _this = this;
		        	var tpl = _.template(rowTpl)( {viewID: this.viewID, day: this._day} );
		        	this.setElement(tpl);
					this.$('.select-acc').select2({
						ajax: {
							transport: function (params, success, failure) {
								var q = params.data.q;
								q = _.isUndefined(q)?"":q;
								
								$.get('/code/hotel', function(res) {
									if (res.isSuccess) {
										_this._hotels = res.data;
										_this._hotels.unshift({
											name: '-',
											phone: '-',
											address: '-',
										});

										var result = [];
										_.each(_this._hotels, function(item) {
											if (item.name.indexOf(q) > -1) {
												result.push({
													id: item.name,
													text: item.name
												});
											}
										});
										success({results: result});
									} else {
										alert("숙소 데이터 검색에 실패했습니다.");
									}
								}).fail(function(res) {
									alert("숙소 데이터 검색에 실패했습니다.");
								});
							}
						}
					});
		        	
		        	this.$('.select-acc').on("select2:select", function (e) {
		        		var scObj = _.findWhere(_this._hotels, {name: this.value});
		        		var phone = 0;
		        		if (!_.isUndefined(scObj)) {
		        			phone = scObj.phone;
		        		}		        		
		        		_this.$('.input-acc-phone').val( phone );
		        	});

		            return this;
		        },
		        
		        getData: function() {
		        	var hotelName = this.$('.select-acc option:selected').text();
		        	var hotelObj = _.findWhere(this._hotels, {name: hotelName});
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