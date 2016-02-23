define([
        'jquery',
        'underscore',
        'backbone',
        'datepicker',
        'common/Utils',
        'custom/View',
        'text!views/expense/tpls/expenseViewTpl.html'
], function ( 
		$,
		_,
		Backbone,
		Datepicker,
		Utils,
		View,
		expenseViewTpl
		) {
			
			/*
			총 인원 : total-member
			차량 비 : carRent
			숙박비 : roomCharge
			
			계약금 : deposit
			총판매가 : total-tour-expenses
			잔금: balance
			납기일: paymentDate
			
			적요 : airSummary
			성인 항공료 : airOneAdult
			아동 항공료 : airOneChild
			
			적요 : carSummary
			차량료 : car-rent-a-person
			
			적요 : roomSummary
			숙박료 : room-charge-a-person
			
			적요 : localTourSummary
			지상비 : local-tour-charge-a-person
			
			적요 : tourProfitSummary
			보성수익 : tourProfit
			
			총계
			성인 : adult-charge
			아동 : child-charge
			*/
			
			var _createDatepicker = function($target) {
	            $target.datepicker({
	             	autoclose: true,
	             	format: 'yyyy년 mm월 dd일',
	             	language: 'kr'
	             });
	             $target.datepicker("setDate", new Date());
	             return $target;
			};			
			
		    var ExpenseView = View.extend({
		        initialize: function() {
		        	this._adultMember = 0;
		        	this._childMember = 0;
		            this.render();
		        },
		        
		        render: function() {
		        	this.setElement(expenseViewTpl);
		        	
		        	_createDatepicker(this.$('#paymentDate'));
		        	
		            return this;
		        },
		        
		        events: {
		        	'change #carRent': '_onChangeCarRent',
		        	'change #roomCharge': '_onChangeRoomCharge',
		        	'change #airOneAdult': '_onChangeAir',
		        	'change #airOneChild': '_onChangeAir',
		        	'change #tourProfit': '_onChangeTourProfit',
		        	'change #deposit': '_onChangeDeposit'
		        },
		        
		        // 차량비 변경
		        _onChangeCarRent: function() {
		        	this._calculateExpenses();
		        },
		        
		        // 숙박비 변경
		        _onChangeRoomCharge: function() {
		        	this._calculateExpenses();
		        },
		        
		        // 항공료 변경
		        _onChangeAir: function() {
		        	this._calculateExpenses();
		        },
		        
		        // 보성 수익 변경
		        _onChangeTourProfit: function() {
		        	this._calculateExpenses();
		        },
		        
		        // 계약 금 변경
		        _onChangeDeposit: function() {
		        	this._calculateTotalTourExpenses();
		        },
		        
		        // 1인당 성인/아동 비용 계산
		        _calculateExpenses: function() {
		        	var totalMember = this.$('.total-member').text() * 1;
		        	
		        	// 성인 비행 비용
		        	var airOneAdult = this.$('#airOneAdult').val();
		        	airOneAdult = Utils.numberWithoutCommas(airOneAdult);

		        	// 아동 비행 비용
		        	var airOneChild = this.$('#airOneChild').val();
		        	airOneChild = Utils.numberWithoutCommas(airOneChild);

		        	// 차량 비용
		        	var carRent = this.$('#carRent').val();
		        	carRent = Utils.numberWithoutCommas(carRent);
		        	var calCar = (totalMember === 0)? 0 :  carRent / totalMember;
		        	calCar = Math.floor(calCar);
		        	this.$('.car-rent-a-person').text(Utils.numberWithCommas(calCar));
		        	
		        	//숙박 비용
		        	var roomCharge = this.$('#roomCharge').val();
		        	roomCharge = Utils.numberWithoutCommas(roomCharge);
		        	var calRoomCharge = (totalMember === 0)? 0 :  roomCharge / totalMember;
		        	calRoomCharge = Math.floor(calRoomCharge);
		        	this.$('.room-charge-a-person').text(Utils.numberWithCommas(calRoomCharge));


		        	// 지상비
		        	var localTourCharge = this.$('.local-tour-charge-a-person').text();
		        	localTourCharge = Utils.numberWithoutCommas(localTourCharge);
		        	
		        	// 보성 비행 비용
		        	var tourProfit = this.$('#tourProfit').val();
		        	tourProfit = Utils.numberWithoutCommas(tourProfit);
		        	
		        	var totalAdultCharge = 0;
		        	var totalChildCharge = 0;
		        	totalAdultCharge = airOneAdult + calCar + calRoomCharge + localTourCharge + tourProfit;
		        	totalChildCharge = airOneChild + calCar + calRoomCharge + localTourCharge + tourProfit;
		        	this.$('.adult-charge').text(Utils.numberWithCommas(totalAdultCharge));
		        	this.$('.child-charge').text(Utils.numberWithCommas(totalChildCharge));
		        	
		        	this._calculateTotalTourExpenses();
		        },
		        
		        // 총 판매가 계산
		        _calculateTotalTourExpenses: function() {
		        	var adultNumber = this.$('.adult-member').text() * 1;
		        	var childNumber = this.$('.child-member').text() * 1;
		        	
		        	var adultCharge = this.$('.adult-charge').text();
		        	adultCharge = Utils.numberWithoutCommas(adultCharge);
		        	var childCharge = this.$('.child-charge').text();
		        	childCharge = Utils.numberWithoutCommas(childCharge);
		        	
		        	var extraCharge = this.$('.extraCharge').text();
		        	extraCharge = Utils.numberWithoutCommas(extraCharge);
		        	
		        	var totalTourExpenses = (adultNumber * adultCharge) + (childNumber * childCharge);
		        	this.$('.total-tour-expenses').text(Utils.numberWithCommas(totalTourExpenses));
		        	
		        	var deposit = this.$('#deposit').val();
		        	deposit = Utils.numberWithoutCommas(deposit);

		        	// 잔금
		        	var balance = totalTourExpenses - deposit + extraCharge;
		        	this.$('.balance').text(Utils.numberWithCommas(balance));
		        },
		        
		        changeMember: function(param) {
		        	console.log(param);	
		        	var adult = param.adult * 1;
		        	var child = param.child * 1;
		        	
		        	this.$('.total-member').text( (adult + child) );
		        	this.$('.adult-member').text(adult);
		        	this.$('.child-member').text(child);
		        	
		        	this._calculateTotalTourExpenses();
		        },
		        
		        // 기타 요금 변경
		        changeExtraCharge: function(param){
		        	var extraCharge = param.extraCharge;
		        	extraCharge = Utils.numberWithCommas(extraCharge);
		        	this.$('.extraCharge').text(extraCharge);
		        	this._calculateExpenses();
		        },
		        
		        // 지상비 값 설정
		        changeLocalTourPrice: function(price) {
		        	price = Utils.numberWithCommas(price);
		        	this.$('.local-tour-charge-a-person').text(price);
		        	this._calculateExpenses();
		        },


		        getData: function() {
		        	var inputs = this.$('input'); 
		        	var data = {};
		        	$.each(inputs, function() {
		        		data[this['id']] = this['value'];
		        	});
		        	
		        	data['totalTourExpenses'] = this.$('.total-tour-expenses').text();
		        	data['balance'] = this.$('.balance').text();
		        	data['carRentAPerson'] = this.$('.car-rent-a-person').text();
		        	data['roomChargeAPerson'] = this.$('.room-charge-a-person').text();
		        	data['localTourChargeAPerson'] = this.$('.local-tour-charge-a-person').text();
		        	data['adultCharge'] = this.$('.adult-charge').text();
		        	data['childCharge'] = this.$('.child-charge').text();
		        	
		        	return data;
		        },
		        
		        setData: function(data) {
		        },

			    destroy: function(){
			    }
		    });
		    
		    return ExpenseView;
} );