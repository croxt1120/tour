define([
        'jquery',
        'underscore',
        'backbone',
        'datepicker',
        'localekr',
        'moment',
        'common/Utils',
        'datas/Events',
        'custom/View',
        'text!views/packageTour/baseInfo/tpls/baseInfoTpl.html'
], function ( 
		$,
		_,
		Backbone,
		Datepicker,
		localekr,
		moment,
		Utils,
		Events,
		View,
		baseInfoTpl
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
		    
		    var BaseInfoView = View.extend({
		        initialize: function() {
		        	this.setElement(this.el);
					this._accommodationView = null;
		            this.$travelStartDate = null;
		            this.$travelEndDate = null;
		            this.render();
		            
		            this._travelStartDate = moment(new Date()).format('YYYY-MM-DD');
		            this._travelEndDate = moment(new Date()).format('YYYY-MM-DD');
		        },
		        
		        render: function() {
		        	var _this = this;
		            var tpl = _.template(baseInfoTpl, {} );
		            this.$el.html(tpl);

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
		            "change #adultMember": "_onChangeMember",
		            "change #childMember": "_onChangeMember",
		            "change #extraCharge": "_onChangeExtraCharge",
		            "change #depTime": "_onChangeDepTime",
		            "change #returnDepTime": "_onChangeReturnDepTime"
		        },
		        
		        _onChangeMember: function() {
		        	var data = {
		        		adult: this.$('#adultMember').val(),
		        		child: this.$('#childMember').val()
		        	};
		        	
		        	this.trigger(Events.CHANGE_MEMBER, data);
		        },
		        
		        _onChangeExtraCharge: function() {
		        	var extraCharge = this.$('#extraCharge').val();
		        	this.trigger(Events.CHANGE_EXTRA_CHARGE, {'extraCharge': extraCharge});
		        },
		        
		        _onChangeDepTime: function() {
		        	var time = this.$('#depTime').val();
		        	var times = time.split(":");
		        	var hour = times[0];
		        	var min = times[1];
		        	var tTime = moment({ hour:hour, minute:min }).add(1, 'h').add(5, 'm').format("HH:mm");
		        	this.$('#arrTime').val(tTime);
		        },
		        
		        _onChangeReturnDepTime: function() {
		        	var time = this.$('#returnDepTime').val();
		        	var times = time.split(":");
		        	var hour = times[0];
		        	var min = times[1];
		        	var tTime = moment({ hour:hour, minute:min }).add(1, 'h').add(5, 'm').format("HH:mm");
		        	this.$('#returnArrTime').val(tTime);
		        },

		        changeDate: function(startDate, endDate) {
		        	startDate = moment(startDate).format('YYYY-MM-DD');
		        	endDate = moment(endDate).format('YYYY-MM-DD');

					if (!_isValidDate(startDate, endDate) ) {
						alert("여행 개시일은 여행 마감일 이전 날짜로 설정 할 수 없습니다.");
						this.$travelEndDate.datepicker("setDate",startDate);
						endDate = startDate;
					}
					
		            this._travelStartDate = startDate;
		            this._travelEndDate = endDate;
		            
					var days = moment(endDate).diff( moment(startDate), 'days') + 1;
					this.trigger(Events.CHANGE_DATE, {days: days});
		        },
		        
		        getData: function() {
				  var inputs = this.$('input'); 
				  var data = {};
				  $.each(inputs, function() {
				    data[this['id']] = this['value'];
				  });
				  
				  data['inclusion'] = this.$('#inclusion').val().replace(/\n/g, '<br>');
				  data['exclusion'] = this.$('#exclusion').val().replace(/\n/g, '<br>');
				  data['specialty'] = this.$('#specialty').val().replace(/\n/g, '<br>');
				  
				  data['travelStartDate'] = this._travelStartDate;
				  data['travelEndDate'] = this._travelEndDate;

				  return data;
		        },
		        
		        setData: function(data) {
		        	this.$('#customerName').val(data.customerName);
		        	this.$('#adultMember').val(data.adultMember);
		        	this.$('#childMember').val(data.childMember);
		        	
		        	this.$('#tourName').val(data.tourName);
		        	
		        	var travelStartDate = moment(data.travelStartDate).format('YYYY-MM-DD');
		        	this.$travelStartDate.datepicker("setDate",travelStartDate);
		        	
		        	var travelEndDate = moment(data.travelEndDate).format('YYYY-MM-DD');
		        	this.$travelEndDate.datepicker("setDate",travelEndDate);
		        	
		        	this.$('#planner').val(data.planner);
		        	this.$('#plannerInfo').val(data.plannerInfo);
		        	
		        	this.$('#inclusion').val(data.inclusion.replace(/\<br\s*\>/gi, '\n'));
		        	this.$('#exclusion').val(data.exclusion.replace(/\<br\s*\>/gi, '\n'));
		        	this.$('#specialty').val(data.specialty.replace(/\<br\s*\>/gi, '\n'));
		        	
		        	this.$('#extraCharge').val(data.extraCharge);
		        	this.$('#extraChargeInfo').val(data.extraChargeInfo);
		        	
		        	this.$('#airline').val(data.airline);
		        	this.$('#depTime').val(data.depTime);
		        	this.$('#arrTime').val(data.arrTime);
		        	this.$('#flightNumber').val(data.flightNumber);
		        	this.$('#area').val(data.area);
		        	
		        	this.$('#returnAirline').val(data.returnAirline);
		        	this.$('#returnDepTime').val(data.returnDepTime);
		        	this.$('#returnArrTime').val(data.returnArrTime);
		        	this.$('#returnFlightNumber').val(data.returnFlightNumber);
		        	this.$('#returnArea').val(data.returnArea);
		        	
		        	this.$('#carMember').val(data.carMember);
		        	this.$('#driver').val(data.driver);
		        },
		        
			    destroy: function(){
			    	this.$travelStartDate.datepicker("destroy");
			    	this.$travelEndDate.datepicker("destroy");
			    }
		    });
		    
		    return BaseInfoView;
} );