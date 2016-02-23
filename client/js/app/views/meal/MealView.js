define([
        'jquery',
        'underscore',
        'backbone',
        'custom/View',
        'datas/Foods',
        'datas/Events',
        'common/Utils',
        'text!views/meal/tpls/mealTpl.html',
        'text!views/meal/tpls/rowTpl.html',
        'text!views/meal/tpls/foodSelectTpl.html'
], function ( 
		$,
		_,
		Backbone,
		View,
		Foods,
		Events,
		Utils,
		mealTpl,
		rowTpl,
		foodSelectTpl
		) {

			var eventBus = Events.eventBus;

			// 음식 선택 selector
			var _createFoodSelector = function() {
				var $tpl = $(_.template(foodSelectTpl)( {} ));
				var data = [];
        		_.each(Foods, function(food) {
        			data.push({
        				id: food.price,
        				text: food.name
        			});
        		});				
				
	        	$tpl.find('.select-food').select2({
	        		data: data
	        	});
	        	
	        	$tpl.find('.select-food').on("select2:select", function (e) {
	        		$tpl.find('.input-food-price').val(Utils.numberWithCommas(this.value));
	        	});
				return $tpl;
			};
			
			////////////////////////////////////////////////////////////////////
			
			var FoodRowView = View.extend({
		        initialize: function(param) {
		        	this.viewID = param.viewID;
		        	this._day = param.day;
		            this.render(param.day);
		        },
		        
		        render: function(day) {
		        	var tpl = _.template(rowTpl)( {viewID: this.viewID, day: this._day} );
		        	this.setElement(tpl);

		        	var $breakfast = _createFoodSelector();
		        	this.$('.breakfast').append($breakfast);
		        	
		        	var $lunch = _createFoodSelector();
		        	this.$('.lunch').append($lunch);
		        	
		        	var $dinner = _createFoodSelector();
		        	this.$('.dinner').append($dinner);
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
		        
		        getData: function() {
		        	var data = {
		        		'day': this._day,
		        		'breakfast': {
		        			name: this.$('.breakfast .select-food option:selected').text(),
		        			price: this.$('.breakfast .select-food option:selected').val()
		        		} ,
		        		'lunch': {
		        			name: this.$('.lunch .select-food option:selected').text(),
		        			price: this.$('.lunch .select-food option:selected').val()
		        			
		        		},
		        		'dinner': {
		        			name: this.$('.dinner .select-food option:selected').text(),
		        			price: this.$('.dinner .select-food option:selected').val()
		        		},
		        		total: this.$('.total').text()
		        	};
		        
		        	return data;
		        },
		        
		        setData: function() {
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
		        
		        setData: function(data) {
		        },
		        
			    destroy: function(){
			    }
		    });	
	
		    return MealView;
} );



