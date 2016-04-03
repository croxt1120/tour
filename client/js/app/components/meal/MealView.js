define([
        'jquery',
        'underscore',
        'backbone',
        'custom/View',
        'datas/Events',
        'datas/Tour',
        'common/Utils',
        'text!components/meal/tpls/mealTpl.html',
        'text!components/meal/tpls/rowTpl.html',
        'text!components/meal/tpls/foodSelectTpl.html'
], function ( 
		$,
		_,
		Backbone,
		View,
		Events,
		Tour,
		Utils,
		mealTpl,
		rowTpl,
		foodSelectTpl
		) {
			
			var eventBus = Events.eventBus;
			var _allMeals = [];
			////////////////////////////////////////////////////////////////////
			
			var FoodRowView = View.extend({
				initialize: function(param) {
					this.viewID = param.viewID;
					this._day = param.day;
					this.render(param.day);
					this._meals = [];
				},
				
				render: function(day) {
					var tpl = _.template(rowTpl)( {viewID: this.viewID, day: this._day} );
					this.setElement(tpl);

					this.$('.breakfast').append(foodSelectTpl);
					this._createFoodSelector('.breakfast');
					
					this.$('.lunch').append(foodSelectTpl);
					this._createFoodSelector('.lunch');
					
					this.$('.dinner').append(foodSelectTpl);
					this._createFoodSelector('.dinner');
					
					return this;
				},
				
				events: {
					'select2:select .select-food': '_onChangePrice'
				},
				_onChangePrice: function(e) {
					var total = 0;
					var price = "";
					
					this.$('.input-food-price').each(function() {
						price = Utils.numberWithoutCommas(this.value);
						total += price;
					});
					
					total = Utils.numberWithCommas(total);
					this.$('.total-a-day').text(total);
					
					// 가격 변경 이벤트
					this.trigger(Events.CHANGE_PRICE);
				},
				
				// 음식 선택 selector
				_createFoodSelector: function(target) {
					var _this = this;
					this.$(target + ' .select-food').select2({
						ajax: {
							transport: function (params, success, failure) {
								var q = params.data.q;
								q = _.isUndefined(q)?"":q;
								
								$.get('/code/food', function(res) {
									if (res.isSuccess) {
										_this._meals = res.data;
										_this._meals.unshift({
											name: '-',
											price: 0,
											explain: '-',
										});
										
										var result = [];
										_.each(_this._meals, function(item) {
											if (item.name.indexOf(q) > -1) {
												result.push({
													id: item.name,
													text: item.name
												});
											}
										});
										success({results: result});
									} else {
										alert("음식 데이터 검색에 실패했습니다.");
									}
								}).fail(function(res) {
									alert("음식 데이터 검색에 실패했습니다.");
								});
							}
						}
					});
					
					this.$(target + ' .select-food').on("select2:select", function (e) {
		        		var scObj = _.findWhere(_this._meals, {name: this.value});
		        		var price = 0;
		        		if (!_.isUndefined(scObj)) {
		        			price = scObj.price;
		        		}						
						_this.$(target + ' .input-food-price').val(Utils.numberWithCommas(price));
					});

					//return $tpl;
				},
				
				getData: function() {
		        	var data = {
		        		'day': this._day,
		        		'breakfast': {
		        			name: this.$('.breakfast .select-food option:selected').text(),
		        			price: this.$('.breakfast .input-food-price').val()
		        		} ,
		        		'lunch': {
		        			name: this.$('.lunch .select-food option:selected').text(),
		        			price: this.$('.lunch .input-food-price').val()
		        			
		        		},
		        		'dinner': {
		        			name: this.$('.dinner .select-food option:selected').text(),
		        			price: this.$('.dinner .input-food-price').val()
		        		},
		        		total: this.$('.total-a-day').text()
		        	};
		        
		        	return data;
		        },
		        
		        setData: function(data) {
		        	var _this = this;
		        	this._meals = _allMeals;
		        	setSelector('.breakfast', data.breakfast);
		        	setSelector('.lunch', data.lunch);
		        	setSelector('.dinner', data.dinner);
		        	this.$('.total-a-day').text(data.total);
		        	
		        	// 각 식사별 셋팅 
		        	function setSelector(target, data) {
						_this.$(target + ' .select-food').select2({
							data: [{
								id: data.name,
								text: data.name
							}]
						});
						
						_this._createFoodSelector(target);
			        	
						var mealName = "-";
						var price = 0;
						
						// 조회된 음식 목록에서 저장된 음식이 삭제됐는지 체크 
						var mealObj = _.findWhere(_this._meals, {name: data.name});
						if (!_.isUndefined(mealObj)) {
							mealName = data.name;
							price = data.price;
						}
						
			        	_this.$(target + ' .select-food option:selected').text(mealName);
			        	_this.$(target + ' .select2-selection__rendered').text(mealName);
			        	_this.$(target + ' .select2-selection__rendered').attr('title', mealName);
			        	_this.$(target + ' .input-food-price').val( price );      		
		        	}
		        	
		        },
		        
			    destroy: function(){
			    	this.remove();
			    }
			});

			
			////////////////////////////////////////////////////////////////////
			var ROW_ID_SUFFIX = 'meal';
			var ROW = '.meal-table tbody tr';
			var ROWS = '.meal-table tbody';

		    var MealView = View.extend({
		        initialize: function() {
		            this.render();
		            this._children = {};
		        },
		        
		        render: function() {
		            this.setElement(mealTpl);
		            return this;
		        },

		        _onChangePrice: function() {
		        	var total = 0;
		        	var aDayVal = 0;
		        	this.$('.total-a-day').each(function() {
		        		aDayVal = Utils.numberWithoutCommas(this.textContent);
		        		total += aDayVal;
		        	});
		        	total = Utils.numberWithCommas(total);
		        	this.$('.total-meal-price').text(total);
		        	
		        	// 가격 변경 이벤트 발생
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
		        			
				        	var foodRow = new FoodRowView({viewID: tViewID,day: tDay});
				        	// 가격 변경 이벤트 수신
				        	foodRow.on(Events.CHANGE_PRICE, this._onChangePrice, this);
				        	this.addChild(ROWS, foodRow);
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
		        		'meals' : [],
		        		'total': 0
		        	};
		        	
		        	var meals = [];
		        	var children = this.getChildren();
		        	_.each(children, function(child) {
		        		meals.push( child.getData() );
		        	});
		        	data['total'] = this.$('.total-meal-price').text();
		        	data['meals'] = meals;

				  return data;
		        },
		        
		        setData: function(mealInfos) {
		        	var _this = this;
		        	var meals = mealInfos.meals;
		        	var len = this.$(ROW).length;
		        	var tViewID = "";
	        		for (var i = 1; i <= len; i++) {
	        			tViewID = ROW_ID_SUFFIX +(i); 
	        			this.removeChild(tViewID);
	        		}		        

					$.get('/code/food', function(res) {
						if (res.isSuccess) {
							_allMeals = res.data;
							_allMeals.unshift({
								name: '-',
								phone: '-',
								address: '-',
							});
							
				        	_.each(meals, function(meal) {
			        			tViewID = ROW_ID_SUFFIX + meal.day;
			        			
					        	var foodRow = new FoodRowView({viewID: tViewID, day: meal.day});
					        	// 가격 변경 이벤트 수신
					        	foodRow.on(Events.CHANGE_PRICE, _this._onChangePrice, _this);
					        	_this.addChild(ROWS, foodRow);
						        foodRow.setData(meal);
				        	});
							
							// 전체 가격 설정
							_this._onChangePrice();

						} else {
							alert("숙소 데이터 검색에 실패했습니다.");
						}
					}).fail(function(res) {
						alert("숙소 데이터 검색에 실패했습니다.");
					});		        	
		        	
		        },
		        
			    destroy: function(){
			    }
		    });
	
		    return MealView;
} );