define([
        'jquery',
        'underscore',
        'backbone',
        'custom/View',
        'datas/Events',
        'common/Utils',
        'text!components/schedule/tpls/scheduleTpl.html',
        'text!components/schedule/tpls/rowTpl.html',
        'text!components/schedule/tpls/scheduleSelectTpl.html'
], function ( 
		$,
		_,
		Backbone,
		View,
		Events,
		Utils,
		scheduleTpl,
		rowTpl,
		scheduleSelectTpl
		) {
		   
		   	var eventBus = Events.eventBus;
		   
		   /**
		    * 일일 스케줄
		    */
			var RowView = View.extend({
		        initialize: function(param) {
		        	this.viewID = param.viewID;
		        	this._day = param.day;
		            this.render(param.day);
		            
		            this._schedules = [];
		        },
		        
		        render: function(day) {
		        	var tpl = _.template(rowTpl)( {viewID: this.viewID, day: this._day} );
		        	this.setElement(tpl);
		        	this._onAddSchedule();
		            return this;
		        },
		        
		        events: {
		        	'select2:select .select-schedule': '_onChangePrice',
		        	'click .btn-add': '_onAddSchedule',
		        	'click .btn-remove': '_onRemoveSchedule'
		        },
		        
		        _onChangePrice: function(e) {
		        	var total = 0;
		        	var price = 0;
		        	this.$('.input-price').each(function() {
		        		price = Utils.numberWithoutCommas(this.value);
		        		total += price;
		        	});
		        	total = Utils.numberWithCommas(total);
		        	this.$('.total-a-day').text(total);
		        	
		        	// 가격 변경 이벤트
		        	this.trigger(Events.CHANGE_PRICE);
		        },
		        
		        _onAddSchedule: function(evt) {
		        	var len = this.$('.schedule-item').length;
		        	var $selector = this._createScheduleSelector();
		        	
		        	if (len === 0) {
		        		this.$('.schedule-items').append($selector);
		        	} else if (!_.isUndefined(evt)) {
		        		$(evt.currentTarget).parent().after($selector);
		        	}
		        	
		        	this._onChangePrice();
		        },
		        
		        _onRemoveSchedule: function(evt) {
		        	var len = this.$('.schedule-item').length;
		        	if (len === 1) {
		        		alert("1개 이상의 일정은 등록 되어있어야 합니다.");
		        		return;
		        	}
		        	
		        	$(evt.currentTarget).parent().remove();
		        	this._onChangePrice();
		        },
		        
				// 음식 선택 selector
				_createScheduleSelector:  function() {
					var _this = this;
					var $tpl = $(_.template(scheduleSelectTpl)( {} ));

					$tpl.find('.select-schedule').select2({
						ajax: {
							transport: function (params, success, failure) {
								var q = params.data.q;
								q = _.isUndefined(q)?"":q;
								
								$.get('/code/schedule', function(res) {
									if (res.isSuccess) {
										_this._schedules = res.data;
										_this._schedules.unshift({
											name: '-',
											price: 0,
											explain: '-',
										});

										var result = [];
										_.each(_this._schedules, function(item) {
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
						
		        	$tpl.find('.select-schedule').on("select2:select", function (e) {
		        		var scObj = _.findWhere(_this._schedules, {name: this.value});
		        		var price = 0;
		        		if (!_.isUndefined(scObj)) {
		        			price = scObj.price;
		        		}

		        		$tpl.find('.input-price').val(Utils.numberWithCommas(price));
		        	});
					return $tpl;
				},
		        
		        getData: function() {
		        	var _this = this;
		        	var scheduleItems = [];
		        	var items = this.$('.schedule-item');
		        	var $item;
		        	
		        	var tSchedule, tObj, tExplain;
		        	_.each(items, function(item) {
		        		
		        		$item = $(item);
			        	tSchedule = $item.find('.select-schedule option:selected').text();
			        	tObj = _.findWhere(_this._schedules, {name: tSchedule});
			        	tExplain = (_.isUndefined(tObj))? "": tObj.explain;		        		
		        		
		        		scheduleItems.push({
		        			name: tSchedule,
		        			price: $item.find('.select-schedule option:selected').val(),
		        			explain: tExplain
		        		});
		        	});
		        
		        	var data = {
		        		day : this._day,
		        		scheduleItems : scheduleItems,
		        		total : this.$('.total-a-day').text()
		        	};		        
		        
		        	return data;
		        },
		        
		        setData: function() {
		        },
		        
			    destroy: function(){
			    	this.remove();
			    }
			});
		   
		   /////////////////////////////////////////////////////////////////////////
   			var ROW_ID_SUFFIX = 'schedule';
			var ROWS = '.schedule-table tbody';
			var ROW = '.schedule-table tbody tr';
 
		    var ScheduleView = View.extend({
		        initialize: function() {
		            this.render();
		            this._children = {};
		        },
		        
		        render: function() {
		            this.setElement(scheduleTpl);
		            return this;
		        },
		        
		        events: {
		        },
		        
		        _onChangePrice: function() {
		        	var total = 0;
		        	var aDayVal = 0;
		        	this.$('.total-a-day').each(function() {
		        		aDayVal = Utils.numberWithoutCommas(this.textContent);
		        		total += aDayVal;
		        	});
		        	total = Utils.numberWithCommas(total);
		        	this.$('.total-schedule-price').text(total);
		        	
		        	// 가격 이벤트 변경 이벤트 전달
		        	eventBus.trigger(Events.CHANGE_PRICE);
		        },
		        
		        changeDay: function(days) {
		        	// 숫자 변환
		        	days = days * 1;
		        	
		        	var mealLen = this.$(ROW).length;
		        	var diffDays = days - mealLen;
		        	var tViewID = "";
		        	
		        	if (diffDays > 0) { // 추가
		        		var tDay = "";
		        		for (var i = 1; i <= diffDays; i++) {
		        			tDay = mealLen + i;
		        			tViewID = ROW_ID_SUFFIX + tDay;
		        			
				        	var rowView = new RowView({viewID: tViewID,day: tDay});
				        	// 가격 변경 이벤트 수신
				        	rowView.on(Events.CHANGE_PRICE, this._onChangePrice, this);
				        	this.addChild(ROWS, rowView);
		        		}
		        	} else if (diffDays < 0) { // 삭제
		        		// 양수 변환
		        		var st = diffDays * -1;
		        		
		        		for (var i = 1; i <= st; i++) {
		        			tViewID = ROW_ID_SUFFIX + (days+i);
		        			this.removeChild(tViewID);
		        		}		        		
		        	}
		        	this._onChangePrice();
		            return this;
		        },
		        		        
		        getData: function() {
		        	var data = {
		        		'schedules' :[],
		        		'total': 0
		        	};
		        	var schedules = [];
		        	var children = this.getChildren();
		        	_.each(children, function(child) {
		        		schedules.push( child.getData() );
		        	});
		        	data['schedules'] = schedules;
		        	data['total'] = this.$('.total-schedule-price').text();

				  return data;
		        },
		        
		        setData: function() {
		        },
		        
			    destroy: function(){
			    	this.remove();
			    }
		    });
		    return ScheduleView;
} );