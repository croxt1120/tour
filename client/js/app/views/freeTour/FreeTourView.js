define([
        'jquery',
        'underscore',
        'backbone',
        'datepicker',
        'localekr',
        'moment',
        'common/Utils',
        'components/accommodation/AccommodationView',
        'text!views/freeTour/tpls/freeTourTpl.html'
], function ( 
		$,
		_,
		Backbone,
		Datepicker,
		localekr,
		moment,
		Utils,
		AccommodationView,
		freeTourTpl
		) {
			
			var _createDatepicker = function($target) {
	            $target.datepicker({
	             	autoclose: true,
	             	format: 'yyyy년 mm월 dd일 DD',
	             	language: 'kr'
	             });
	             $target.datepicker("setDate", new Date());
	             return $target;
			};
			
			var _isValidDate = function(startDate, endDate) {
				var diff = moment(startDate).diff(endDate);
				return (diff > 0)?false:true;
			};
		    
		    var FreeTourView = Backbone.View.extend({
		        initialize: function() {
		        	this._accommodationView = null;
		            this.render();
		            
		            this._travelStartDate = moment(new Date()).format('YYYY-MM-DD');
		            this._travelEndDate = moment(new Date()).format('YYYY-MM-DD');
		        },
		        render: function() {
		        	var _this = this;
		        	this.setElement(freeTourTpl);
		            //var tpl = _.template(freeTourTpl, {} );
		            //this.$el.html(tpl);

					this._accommodationView = new AccommodationView();
					this.$('#accommodationInfoBox').append(this._accommodationView.el);
					this._accommodationView.changeDay(1);
					

		            var $travelStartDate = this.$travelStartDate = _createDatepicker(this.$('#travelStartDate'));
		            var $travelEndDate   = this.$travelEndDate = _createDatepicker(this.$('#travelEndDate'));

		            $travelStartDate.datepicker().on('changeDate', function(e) {
		            	var startDate = e.date;
		            	var endDate = $travelEndDate.datepicker("getDate");

		            	_this.changeDate(startDate, endDate);
		            });
		            
		            $travelEndDate.datepicker().on('changeDate', function(e) {
		            	var startDate = $travelStartDate.datepicker("getDate");
		            	var endDate = e.date;
		            	_this.changeDate(startDate, endDate);
		             });
		            
		            return this;
		        },
		        events: {
		        	'change #airOneAdult': '_onChangeAdultInfo',
		        	'change #adultMember': '_onChangeAdultInfo',
		        	'change #airOneChild': '_onChangeChildInfo',
		        	'change #childMember': '_onChangeChildInfo',
		        	'change #rentCarCharge': '_onChangeRentCarInfo',
		        	'change #rentCarInsu': '_onChangeRentCarInfo',
		        	'change #busRentCharge': '_onChangeBusRentInfo',
		        	'change #totalRoomCharge': '_onChangeTotalRoomCharge'
		        },
		        
		        _onChangeAdultInfo: function() {
		        	var charge = this.$('#airOneAdult').val();
		        	charge = Utils.numberWithoutCommas(charge);
		        	var member = this.$('#adultMember').val() * 1;
		        	
		        	// 천만원 단위까지만 가능
		        	if (!Utils.isNumber(charge) || charge.toString().length > 8) {
		        		charge = 0;
		        	}		        	
		        	
		        	var total = charge * member;
		        	this.$('.total-air-adult-charge').text(Utils.numberWithCommas(total));
		        	this._changeTotalAirCharge();
		        },
		        
		        _onChangeChildInfo: function() {
		        	var charge = this.$('#airOneChild').val();
		        	charge = Utils.numberWithoutCommas(charge);
		        	var member = this.$('#childMember').val() * 1;

		        	// 천만원 단위까지만 가능
		        	if (!Utils.isNumber(charge) || charge.toString().length > 8) {
		        		charge = 0;
		        	}		        	
		        	
		        	var total = charge * member;
		        	this.$('.total-air-child-charge').text(Utils.numberWithCommas(total));
		        	this._changeTotalAirCharge();
		        },
		        
		        _onChangeRentCarInfo: function() {
		        	var rentCarCharge = this.$('#rentCarCharge').val();
		        	rentCarCharge = Utils.numberWithoutCommas(rentCarCharge);

		        	// 천만원 단위까지만 가능
		        	if (!Utils.isNumber(rentCarCharge) || rentCarCharge.toString().length > 8) {
		        		rentCarCharge = 0;
		        	}		        	
		        	
		        	var rentCarInsu = this.$('#rentCarInsu').val();
		        	rentCarInsu = Utils.numberWithoutCommas(rentCarInsu);
		        	
		        	// 천만원 단위까지만 가능
		        	if (!Utils.isNumber(rentCarInsu) || rentCarInsu.toString().length > 8) {
		        		rentCarInsu = 0;
		        	}		        	
		        			        	
		        	var total = rentCarCharge + rentCarInsu;
		        	this.$('.total-rent-car-charge').text(Utils.numberWithCommas(total));
		        	
		        	this._calculateTotalTourExpenses();
		        },
		        
		        _onChangeBusRentInfo: function() {
		        	var busRentCharge = this.$('#busRentCharge').val();
		        	busRentCharge = Utils.numberWithoutCommas(busRentCharge);
		        	
		        	// 천만원 단위까지만 가능
		        	if (!Utils.isNumber(busRentCharge) || busRentCharge.toString().length > 8) {
		        		busRentCharge = 0;
		        	}		        	
		        	
		        	this.$('.toal-bus-rent-charge').text(Utils.numberWithCommas(busRentCharge));
		        	
		        	this._calculateTotalTourExpenses();
		        },
		        
		        _onChangeTotalRoomCharge: function() {
		        	this._calculateTotalTourExpenses();
		        },
		        
		        _changeTotalAirCharge: function() {
		        	var adult = this.$('.total-air-adult-charge').text();
		        	var child = this.$('.total-air-child-charge').text();
		        	var total = 0;
		        	
		        	adult = Utils.numberWithoutCommas(adult);
		        	child = Utils.numberWithoutCommas(child);
		        	
		        	total = adult + child;
		        	this.$('.total-air-charge').text(Utils.numberWithCommas(total));
		        	this._calculateTotalTourExpenses();
		        },

		        changeDate: function(startDate, endDate) {
		        	startDate = moment(startDate).format('YYYY-MM-DD');
		        	endDate = moment(endDate).format('YYYY-MM-DD');

					if (!_isValidDate(startDate, endDate) ) {
						alert("출발 일은 리턴일 이전 날짜로 설정 할 수 없습니다.");
						this.$travelEndDate.datepicker("setDate",startDate);
						endDate = startDate;
					}
					
		            this._travelStartDate = startDate;
		            this._travelEndDate = endDate;
		            
					var days = moment(endDate).diff( moment(startDate), 'days') + 1;
					//this.trigger(Events.CHANGE_DATE, {days: days});
					
					this._accommodationView.changeDay(days);
		        },
		        _calculateTotalTourExpenses: function() {
		        	var totalAirCharge = this.$('.total-air-charge').text();
		        	totalAirCharge = Utils.numberWithoutCommas(totalAirCharge);
		        	
		        	var totalRoomCharge = this.$('#totalRoomCharge').val();
		        	totalRoomCharge = Utils.numberWithoutCommas(totalRoomCharge);
		        	
		        	var totalRentCarCharge = this.$('.total-rent-car-charge').text();
		        	totalRentCarCharge = Utils.numberWithoutCommas(totalRentCarCharge);
		        	
		        	var totalBusRentCharge = this.$('.toal-bus-rent-charge').text();
		        	totalBusRentCharge = Utils.numberWithoutCommas(totalBusRentCharge);
		        	
		        	var totalCharge = totalAirCharge + totalRoomCharge + totalRentCarCharge + totalBusRentCharge;
		        	totalCharge = Utils.numberWithCommas(totalCharge);
		        	this.$('.total-charge').text(totalCharge);
		        	this.$('.total-charge-card').text(totalCharge);
		        },
		        
		        getData: function() {
		        	var data = {};
		        	
		        	//////////////////////////////////////////
		        	var baseInfo = {};
		        	var baseInputs = this.$('#baseInfoBox input');
		        	$.each(baseInputs, function() {
		        		baseInfo[this['id']] = this['value'];
		        	});
		        	baseInfo['travelStartDate'] = this._travelStartDate;
		        	baseInfo['travelEndDate'] = this._travelEndDate;
		        	
		        	baseInfo['totalAirAdultCharge'] = this.$('.total-air-adult-charge').text();
		        	baseInfo['totalAirChildCharge'] = this.$('.total-air-child-charge').text();
		        	data['baseInfo'] = baseInfo;
		        	
		        	//////////////////////////////////////////
		        	data['accInfos'] = this._accommodationView.getData();
		        	
		        	//////////////////////////////////////////
		        	var rentCarInfo = {};
		        	var rentCarInputs = this.$('#rentCarInfoBox input');
		        	$.each(rentCarInputs, function() {
		        		rentCarInfo[this['id']] = this['value'];
		        	});
		        	data['rentCarInfo'] = rentCarInfo;
		        	
		        	//////////////////////////////////////////
		        	var busInfo = {};
		        	var busInfoInputs = this.$('#busInfoBox input');
		        	$.each(busInfoInputs, function() {
		        		busInfo[this['id']] = this['value'];
		        	});
		        	data['busInfo'] = busInfo;
		        	
		        	//////////////////////////////////////////
		        	var expenseInfo = {};
		        	expenseInfo['totalAirCharge'] = this.$('.total-air-charge').text();
		        	expenseInfo['totalRoomCharge'] = this.$('#totalRoomCharge').val();
		        	expenseInfo['totalRentCarCharge'] = this.$('.total-rent-car-charge').text();
		        	expenseInfo['totalBusRentCharge'] = this.$('.toal-bus-rent-charge').text();
		        	expenseInfo['totalCharge'] = this.$('.total-charge').text();
		        	expenseInfo['totalChargeCard'] = this.$('.total-charge-card').text();
		        	data['expenseInfo'] = expenseInfo;

		        	return data;
		        },
		        
		        setData: function(data) {
		        	console.log(data);
		        	var baseInfo = data.baseInfo;
		        	var accInfos = data.accInfos;
		        	var rentCarInfo = data.rentCarInfo;
		        	var busInfo = data.busInfo;
		        	var expenseInfo = data.expenseInfo;
		        	
		        	// 기본 정보
		        	this.$('#customerName').val(baseInfo.customerName);
		        	
		        	// 출발
		        	this.$('#airline').val(baseInfo.airline);
		        	this.$('#flightNumber').val(baseInfo.flightNumber);
		        	
		        	var travelStartDate = moment(baseInfo.travelStartDate).format('YYYY-MM-DD');
		        	this.$('#travelStartDate').datepicker("setDate",travelStartDate);		        	
		        	
		        	this.$('#depTime').val(baseInfo.depTime);
		        	
		        	// 리턴
		        	this.$('#returnAirline').val(baseInfo.airline);
		        	this.$('#returnFlightNumber').val(baseInfo.flightNumber);

		        	var travelEndDate = moment(baseInfo.travelEndDate).format('YYYY-MM-DD');
		        	this.$('#travelEndDate').datepicker("setDate",travelEndDate);		        	

		        	this.$('#returnDepTime').val(baseInfo.depTime);
		        	
		        	// 성인 항공 요금
		        	this.$('#airOneAdult').val(baseInfo.airOneAdult);
		        	this.$('#adultMember').val(baseInfo.adultMember);	        	
		        	this.$('.total-air-adult-charge').text(baseInfo.totalAirAdultCharge);
		        	
		        	// 아동 항공 요금
		        	this.$('#airOneChild').val(baseInfo.airOneChild);
		        	this.$('#childMember').val(baseInfo.childMember);	        	
		        	this.$('.total-air-child-charge').text(baseInfo.totalAirChildCharge);
		        	
		        	// 숙박
		        	this._accommodationView.setData(accInfos);
		        	
		        	// 렌터카
		        	this.$('#rentCarName').val(rentCarInfo.rentCarName);
		        	this.$('#rentCarPhone').val(rentCarInfo.rentCarPhone);
		        	this.$('#rentCarLocation').val(rentCarInfo.rentCarLocation);
		        	this.$('#rentCarType').val(rentCarInfo.rentCarType);
		        	this.$('#rentCarCharge').val(rentCarInfo.rentCarCharge);
		        	this.$('#rentCarUsingTime').val(rentCarInfo.rentCarUsingTime);
		        	this.$('#rentCarInsu').val(rentCarInfo.rentCarInsu);
		        	
		        	// 차량 대절
		        	this.$('#busMember').val(busInfo.busMember);
		        	this.$('#busRentCharge').val(busInfo.busRentCharge);
		        	
		        	// 총 요금
		        	this.$('.total-air-charge').text(expenseInfo.totalAirCharge);
		        	this.$('#totalRoomCharge').val(expenseInfo.totalRoomCharge);
		        	this.$('.total-rent-car-charge').text(expenseInfo.totalRentCarCharge);
		        	this.$('.toal-bus-rent-charge').text(expenseInfo.totalBusRentCharge);
		        	this.$('.total-charge').text(expenseInfo.totalCharge);
		        	this.$('.total-charge-card').text(expenseInfo.totalChargeCard);		        	
		        	
		        }
		        
		    });
		    
		    return FreeTourView;
} );