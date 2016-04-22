define([
        'jquery',
        'underscore',
        'backbone',
        'html2canvas',
        'moment',
        'common/Utils',
        'text!views/print/tpls/printViewTpl.html',
        'text!views/print/tpls/tourInfoTpl.html'
], function ( 
		$,
		_,
		Backbone,
		Html2canvas,
		moment,
		Utils,
		printViewTpl,
		tourInfoTpl
		) {
			
			//var DEFAULT_SCHEDULE_ITEM_COUNT = 14;
			var DEFAULT_SCHEDULE_ITEM_COUNT = 2;
			
			var _getADaySchedule = function(data) {
	        	var baseInfo = data.baseInfo;
	        	var accInfos = data.accInfos;
	        	var mealInfos = data.mealInfos;
	        	var scheduleInfo = data.scheduleInfo;
	        	var startDate = baseInfo.travelStartDate;
        		
        		var scInfo = {};
    			scInfo['date'] = moment( startDate ).format('MM 월 DD 일');
    			
        		scInfo['airline'] = baseInfo.airline;
        		scInfo['flightNumber'] = baseInfo.flightNumber;
        		
        		scInfo['depTimeBeforeAHour'] = baseInfo.depTimeBeforeAHour;
        		scInfo['depTime'] = baseInfo.depTime;
        		scInfo['arrTime'] = baseInfo.arrTime;
        		scInfo['area'] = baseInfo.area;
        		
        		scInfo['returnDepTimeBeforeAHour'] = baseInfo.returnDepTimeBeforeAHour;
        		scInfo['returnAirline'] = baseInfo.returnAirline;
        		scInfo['returnFlightNumber'] = baseInfo.returnFlightNumber;
        		scInfo['returnDepTime'] = baseInfo.returnDepTime;			        		
        		scInfo['returnArrTime'] = baseInfo.returnArrTime;
        		scInfo['returnArea'] = baseInfo.returnArea;


        		scInfo['meal'] = mealInfos.meals[0];
        		scInfo['schedules'] = scheduleInfo.schedules[0].scheduleItems;
        		
        		var diff = DEFAULT_SCHEDULE_ITEM_COUNT - scInfo['schedules'].length;
        		scInfo['emptySchedules'] = (diff > 0)?diff:0;
        		
        		scInfo['accInfo'] = accInfos[0];
        		
        		return scInfo;
			};
			
			var _getSchedules = function(data){
	        	var baseInfo = data.baseInfo;
	        	var accInfos = data.accInfos;
	        	var mealInfos = data.mealInfos;
	        	var scheduleInfo = data.scheduleInfo;
	        	var startDate = baseInfo.travelStartDate;
	        	
	        	var days = accInfos.length;
				var scInfos = [];
				
	        	for (var i = 0; i < days; i++) {
	        		var scInfo = {};
	        		scInfo['day'] = i+1;
	        		if (i == 0) {	// 첫째 날
	        			scInfo['date'] = moment( startDate ).format('MM 월 DD 일');
	        			
		        		//scInfo['depAirport'] = '김포 공항';
		        		//scInfo['depTime'] = baseInfo.depTime;			        		
		        		//scInfo['arrAirport'] = '제주 공항';
		        		//scInfo['arrTime'] = baseInfo.arrTime;
		        		scInfo['airline'] = baseInfo.airline;
		        		scInfo['flightNumber'] = baseInfo.flightNumber;
		        		
		        		scInfo['depTimeBeforeAHour'] = baseInfo.depTimeBeforeAHour;
		        		scInfo['depTime'] = baseInfo.depTime;
		        		scInfo['arrTime'] = baseInfo.arrTime;
		        		scInfo['area'] = baseInfo.area;
		        		
		        		
	        		} else {
	        			scInfo['date'] = moment( startDate ).add(i, 'days').format('MM 월 DD 일');
	        			
	        			if (i == (days-1) ) { // 마지막 날 

			        		scInfo['airline'] = baseInfo.returnAirline;
			        		scInfo['flightNumber'] = baseInfo.returnFlightNumber;
			        		
			        		scInfo['depTimeBeforeAHour'] = baseInfo.returnDepTimeBeforeAHour;
			        		scInfo['depTime'] = baseInfo.returnDepTime;
			        		scInfo['arrTime'] = baseInfo.returnArrTime;
			        		scInfo['area'] = baseInfo.returnArea;
	        			
		        			//scInfo['depAirport'] = '제주 공항';
		        			//scInfo['depTime'] = baseInfo.returnArrTime;
		        			//scInfo['arrAirport'] = '김포 공항';
		        			//scInfo['arrTime'] = baseInfo.returnDepTime;
	        			} else {
			        		scInfo['airline'] = "";
			        		scInfo['flightNumber'] = "";
			        		scInfo['depTime'] = "";
			        		scInfo['arrTime'] = "";
			        		scInfo['area'] = "";
	        			}
	        		}
	        		
	        		scInfo['meals'] = mealInfos.meals[i];
	        		scInfo['schedules'] = scheduleInfo.schedules[i].scheduleItems;
	        		var diff = DEFAULT_SCHEDULE_ITEM_COUNT - scInfo['schedules'].length;
	        		scInfo['emptySchedules'] = (diff > 0)?diff:0;	        		
	        		
	        		scInfo['accInfo'] = accInfos[i];
	        		
	        		scInfos.push(scInfo);
	        	}
	        	
	        	return scInfos;
			};
			
		    
		    var PrintTourInfoView = Backbone.View.extend({
		        initialize: function() {
		            this.render();
		        },
		        render: function() {
		            var tpl = _.template(printViewTpl, {} );
		            this.setElement(printViewTpl);
		            return this;
		        },
		        events: {
		            "click .btn-print": "onPrintClick"
		        },
		        
		        setData: function(data) {
		        	var viewData = {};
		        	var baseInfo = data.packageInfo.baseInfo;
		        	var accInfos = data.packageInfo.accInfos;
		        	var expenseInfo = data.packageInfo.expenseInfo;
		        	
		        	var travelStartDate = moment(baseInfo.travelStartDate, "YYYY-MM-DD").format('YYYY년 MM월 DD일 ddd요일');
		        	var travelEndDate = moment(baseInfo.travelEndDate, "YYYY-MM-DD").format('YYYY년 MM월 DD일 ddd요일');
		        	
		        	// cover
		        	viewData['tourName'] = baseInfo.tourName;
		        	viewData['travelStartDate'] = travelStartDate;
		        	viewData['planner'] = baseInfo.planner;
		        	
		        	
		        	
		        	// customer-info
		        	viewData['customerName'] = baseInfo.customerName; 
		        	viewData['airline'] = baseInfo.airline;
		        	viewData['travelDate'] = travelStartDate + " ~ " + travelEndDate;
		        	
		        	
		        	var totalAdult = Utils.numberWithoutCommas( expenseInfo.adultCharge ) * (baseInfo.adultMember * 1);
		        	viewData['adultCharge'] = expenseInfo.adultCharge;
		        	viewData['adultMember'] = baseInfo.adultMember;
		        	viewData['totalAdultCharge'] = Utils.numberWithCommas(totalAdult);
		        	
		        	var totalChild = Utils.numberWithoutCommas( expenseInfo.childCharge ) * (baseInfo.childMember * 1);
		        	viewData['childCharge'] = expenseInfo.childCharge;
		        	viewData['childMember'] = baseInfo.childMember;
		        	viewData['totalChildCharge'] = Utils.numberWithCommas(totalChild);
		        	
		        	// 총 판매가 + 기타금액
		        	var totalTourExpenses = Utils.numberWithoutCommas(expenseInfo.totalTourExpenses) + Utils.numberWithoutCommas(expenseInfo.extraCharge)
		        	viewData['totalTourExpenses'] =  Utils.numberWithCommas(totalTourExpenses);
		        	
		        	// 추가 금액
		        	viewData['extraCharge'] = baseInfo.extraCharge;
		        	// 기타 추가 금액
		        	viewData['extraChargeInfo'] = baseInfo.extraChargeInfo;
		        	
		        	// 포함
		        	viewData['inclusion'] =baseInfo.inclusion;
		        	
		        	// 불포함
		        	viewData['exclusion'] = baseInfo.exclusion;
		        	
		        	// 특별사항
		        	viewData['specialty'] = baseInfo.specialty;
		        	
		        	// 차량
		        	viewData['carMember'] = baseInfo.carMember;
		        	
		        	// 담당기사
		        	viewData['driver'] = baseInfo.driver;
		        	
		        	// 기획자
		        	viewData['planner'] = baseInfo.planner;
		        	// 기획자 정보
		        	viewData['plannerInfo'] = baseInfo.plannerInfo;
		        	
		        	
		        	var days = accInfos.length;
		        	var scInfos = [];
		        	
		        	if (days == 1) { // 하루 여행
		        		var scInfo = _getADaySchedule(data.packageInfo);
		        		scInfos.push(scInfo);
		        	} else {
		        		scInfos = _getSchedules(data.packageInfo);
		        	}
		        	
		        	viewData['scInfos'] = scInfos;
		        	
		        	// 계약금
		        	viewData['deposit'] = expenseInfo.deposit;
		        	
		        	// 잔금
		        	viewData['balance'] = expenseInfo.balance;
		        	
		        	// 납기일
		        	viewData['paymentDate'] = moment(expenseInfo.paymentDate, "YYYY-MM-DD").format('YYYY년 MM월 DD일 ddd요일');
		        	
		        	viewData['adminInfo'] = data.adminInfo;

		        	console.log(viewData);
		        
		        	var tpl = _.template(tourInfoTpl)(viewData);
		        	
		        	this.$('.content').empty().append(tpl);
		        	
		        },
		        
		        onPrintClick: function(evt) {
		            var $print = this.$('.print-tour');
		            
		            $("#appView").hide();
		            $('#printArea').show().append($print);
		            
		            window.print();
		            $("#appView").show();
		            this.$('.content').append($print);
		            
		            /*
		     		var w = 900;
		     		var h = 1000;
		     		var top = 10;
		     		var left = 10;
		     		var popup = null;
		     		window['printTourData'] = this.$('.content').html();
		     		popup = window.open("package_popup.html", "", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
				    popup.focus();
		            */
		            
		        }
		    });
		    return PrintTourInfoView;
} );