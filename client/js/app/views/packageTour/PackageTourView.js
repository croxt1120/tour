define([
        'jquery',
        'underscore',
        'backbone',
	    'datas/Events',
	    'common/Utils',
	    'views/packageTour/baseInfo/BaseInfoView',
	    'views/accommodation/AccommodationView',
	    'views/meal/MealView',
	    'views/schedule/ScheduleView',
	    'views/expense/ExpenseView',
        'text!views/packageTour/tpls/packageTourTpl.html'
], function ( 
		$,
		_,
		Backbone,
        Events,
        Utils,
        BaseInfoView,
        AccommodationView,
        MealView,
        ScheduleView,
        ExpenseView,
		packageTourTpl
		) {
			var eventBus = Events.eventBus;
			
		    var TourView = Backbone.View.extend({
		        initialize: function() {
		        	this._baseInfoView = null;
		        	this._expenseView = null;
		        	this._accommodationView = null;
		        	this._mealView = null;
		        	this._scheduleView = null;
		        	
		            this.render();
		            
		            this._baseInfoView.trigger(Events.CHANGE_DATE, {days: 1});
		        },
		        render: function() {
		        	var _this = this;
		        	this.setElement(packageTourTpl);
		            
					this._baseInfoView = new BaseInfoView();
					this.$('#baseInfoBox').append(this._baseInfoView.el);
					
					this._expenseView = new ExpenseView();
					this.$('#expenseInfoBox').append(this._expenseView.el);
					
					this._accommodationView = new AccommodationView();
					this.$('#accommodationInfoBox').append(this._accommodationView.el);
					
					this._mealView = new MealView();
					this.$('#mealInfoBox').append(this._mealView.el);					
					
					this._scheduleView = new ScheduleView();
					this.$('#scheduleInfoBox').append(this._scheduleView.el);					
					
					
					// 인원 변경
					this._baseInfoView.on(Events.CHANGE_MEMBER, function(param) {
						console.log("Events.CHANGE_MEMBER");
						_this._expenseView.changeMember(param);
					});
					
					// 기타 요금 변경
					this._baseInfoView.on(Events.CHANGE_EXTRA_CHARGE, function(param) {
						console.log("Events.CHANGE_EXTRA_CHARGE");
						_this._expenseView.changeExtraCharge(param);
					});					
					
					// 기간 변경
					this._baseInfoView.on(Events.CHANGE_DATE, function(param) {
						_this._accommodationView.changeDay(param.days);
						_this._mealView.changeDay(param.days);
						_this._scheduleView.changeDay(param.days);
					});
					
					// 식사 / 일정 가격 변경
					eventBus.on(Events.CHANGE_PRICE, function() {
						var mealData = _this._mealView.getData();
						var scheduleData = _this._scheduleView.getData();
						var mealTotal = Utils.numberWithoutCommas(mealData.total);
						var scheduleTotal = Utils.numberWithoutCommas(scheduleData.total);
						var total = mealTotal + scheduleTotal;
						
						_this._expenseView.changeLocalTourPrice(total);
					});
					
		            return this;
		        },
		        getData: function() {
		        	var data = {};
		        	data['baseInfo'] = this._baseInfoView.getData();
		        	data['accommodationInfos'] = this._accommodationView.getData();
		        	data['mealInfo'] = this._mealView.getData();
		        	data['scheduleInfo'] = this._scheduleView.getData();
		        	data['expenseInfo'] = this._expenseView.getData();
		        	return data;
		        },
		        setData: function(data) {
		        }
		    });
		    return TourView;
} );