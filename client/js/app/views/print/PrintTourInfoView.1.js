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
			
			var _getADaySchedule = function(data) {
	        	var baseInfo = data.baseInfo;
	        	var accInfos = data.accommodationInfos;
	        	var mealInfo = data.mealInfo;
	        	var scheduleInfo = data.scheduleInfo;
	        	var startDate = baseInfo.travelStartDate;
        		
        		var scInfo = {};
    			scInfo['date'] = moment( startDate ).format('MM 월 DD 일');
        		
        		scInfo['depAirport'] = '김포 공항';
        		scInfo['depTime'] = baseInfo.depTime;			        		
        		scInfo['arrAirport'] = '제주 공항';
        		scInfo['arrTime'] = baseInfo.arrTime;

    			scInfo['returnArrAirport'] = '제주 공항';
    			scInfo['returnArrTime'] = baseInfo.returnArrTime;
    			scInfo['returnDepAirport'] = '김포 공항';
    			scInfo['returnDepTime'] = baseInfo.returnDepTime;

        		scInfo['meals'] = mealInfo.meals[0];
        		scInfo['schedules'] = scheduleInfo.schedules[0].scheduleItems;
        		
        		return scInfo;
			};
			
			var _getSchedules = function(data){
	        	var baseInfo = data.baseInfo;
	        	var accInfos = data.accommodationInfos;
	        	var mealInfo = data.mealInfo;
	        	var scheduleInfo = data.scheduleInfo;
	        	var startDate = baseInfo.travelStartDate;
	        	
	        	var days = accInfos.length;
				var scInfos = [];
				
	        	for (var i = 0; i < days; i++) {
	        		var scInfo = {};
	        		scInfo['day'] = i+1;
	        		if (i == 0) {	// 첫째 날
	        			scInfo['date'] = moment( startDate ).format('MM 월 DD 일');

		        		scInfo['depAirport'] = '김포 공항';
		        		scInfo['depTime'] = baseInfo.depTime;			        		
		        		scInfo['arrAirport'] = '제주 공항';
		        		scInfo['arrTime'] = baseInfo.arrTime;
	        		} else {
	        			scInfo['date'] = moment( startDate ).add(i, 'days').format('MM 월 DD 일');
	        			
	        			if (i == (days-1) ) { // 마지막 날 
		        			scInfo['depAirport'] = '제주 공항';
		        			scInfo['depTime'] = baseInfo.returnArrTime;
		        			scInfo['arrAirport'] = '김포 공항';
		        			scInfo['arrTime'] = baseInfo.returnDepTime;
	        			} else {
		        			scInfo['depAirport'] = '';
		        			scInfo['depTime'] = '';
		        			scInfo['arrAirport'] = '';
		        			scInfo['arrTime'] = '';
	        			}
	        		}
	        		
	        		scInfo['meals'] = mealInfo.meals[i];
	        		scInfo['schedules'] = scheduleInfo.schedules[i].scheduleItems;
	        		
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
		            this.$el.html(tpl);
		            return this;
		        },
		        events: {
		            "click .btn-print": "onPrintClick"
		        },
		        
		        setData: function(data) {
		        	var viewData = {};
		        	var baseInfo = data.baseInfo;
		        	var accInfos = data.accommodationInfos;
		        	var expenseInfo = data.expenseInfo;

		        	// cover
		        	var $cover = this.$('.cover');
		        	//$cover.find('.tour-name').text(baseInfo.tourName);
		        	//$cover.find('.travel-start-date').text(baseInfo.travelStartDate);
		        	//$cover.find('.planner').text(baseInfo.planner);
		        	
		        	viewData['tourName'] = baseInfo.tourName;
		        	viewData['travelStartDate'] = baseInfo.travelStartDate
		        	viewData['planner'] = baseInfo.planner
		        	
		        	
		        	
		        	// customer-info
		        	var $cuInfo = this.$('.customer-info');
		        	
		        	
		        	//$cuInfo.find('.customer-name').text(baseInfo.customerName);
		        	//$cuInfo.find('.airline').text(baseInfo.airline);
		        	//$cuInfo.find('.travel-date').text(baseInfo.travelStartDate + " ~ " + baseInfo.travelEndDate);
		        	
		        	viewData['customerName'] = baseInfo.customerName; 
		        	viewData['airline'] = baseInfo.airline;
		        	viewData['travelDate'] = baseInfo.travelStartDate + " ~ " + baseInfo.travelEndDate;
		        	
		        	
		        	//$cuInfo.find('.adult-charge').text( expenseInfo.adultCharge );
		        	//$cuInfo.find('.adult-member').text(baseInfo.adultMember);
		        	var totalAdult = Utils.numberWithoutCommas( expenseInfo.adultCharge ) * (baseInfo.adultMember * 1);
		        	//$cuInfo.find('.total-adult-charge').text( Utils.numberWithCommas(totalAdult) );
		        	
		        	viewData['adultCharge'] = expenseInfo.adultCharge;
		        	viewData['adultMember'] = baseInfo.adultMember;
		        	viewData['totalAdultCharge'] = Utils.numberWithCommas(totalAdult);
		        	
		        	//$cuInfo.find('.child-charge').text( expenseInfo.childCharge );
		        	//$cuInfo.find('.child-member').text(baseInfo.childMember);
		        	var totalChild = Utils.numberWithoutCommas( expenseInfo.childCharge ) * (baseInfo.childMember * 1);
		        	//$cuInfo.find('.total-child-charge').text( Utils.numberWithCommas(totalChild) );
		        	//$cuInfo.find('.total-tour-expenses').text(expenseInfo.totalTourExpenses);
		        	
		        	viewData['childCharge'] = expenseInfo.childCharge;
		        	viewData['childMember'] = baseInfo.childMember;
		        	viewData['totalChildCharge'] = Utils.numberWithCommas(totalChild);
		        	viewData['totalTourExpenses'] = expenseInfo.totalTourExpenses;
		        	
		        	// 추가 금액
		        	//$cuInfo.find('.extra-charge').text(baseInfo.extraCharge);
		        	viewData['extraCharge'] = baseInfo.extraCharge;
		        	// 기타 추가 금액
		        	//$cuInfo.find('.extra-charge-info').text(baseInfo.extraChargeInfo);
		        	viewData['extraChargeInfo'] = baseInfo.extraChargeInfo;
		        	
		        	// 포함
		        	//$cuInfo.find('.inclusion').html(baseInfo.inclusion);
		        	viewData['inclusion'] =baseInfo.inclusion;
		        	
		        	// 불포함
		        	//$cuInfo.find('.exclusion').html(baseInfo.exclusion);
		        	viewData['exclusion'] = baseInfo.exclusion;
		        	
		        	// 특별사항
		        	//$cuInfo.find('.specialty').html(baseInfo.specialty);
		        	viewData['specialty'] = baseInfo.specialty;
		        	
		        	// 차량
		        	//$cuInfo.find('.carMember').text(baseInfo.carMember);
		        	viewData['carMember'] = baseInfo.carMember;
		        	
		        	// 담당기사
		        	//$cuInfo.find('.driver').text(baseInfo.driver);
		        	viewData['driver'] = baseInfo.driver;
		        	
		        	// 기획자
		        	//$cuInfo.find('.planner').text(baseInfo.planner);
		        	viewData['planner'] = baseInfo.planner;
		        	// 기획자 정보
		        	//$cuInfo.find('.plannerInfo').text(baseInfo.plannerInfo);
		        	viewData['plannerInfo'] = baseInfo.plannerInfo;
		        	
		        	
		        	var days = accInfos.length;
		        	var scInfos = [];
		        	
		        	if (days == 1) { // 하루 여행
		        		var scInfo = _getADaySchedule(data);
		        		scInfos.push(scInfo);
		        	} else {
		        		scInfos = _getSchedules(data);
		        	}
		        	

		        	
		        	console.log(scInfos);
		        	
		        	/*
		        	date
		        	area
		        	traffic
		        	time
		        	
		        	
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	//$cuInfo.find('.').text();
		        	*/
		        	
		        	var tpl = _.template(tourInfoTpl)(viewData);
		        	
		        	this.$('.content').empty().append(tpl);
		        	
		        },
		        
		        onPrintClick: function(evt) {
		            var $print = this.$('#print');
		            
		            $("#appView").hide();
		            $('#printArea').show().append($print);
		            
		            window.print();
		            $("#appView").show();
		            this.$('.content').append($print);
		        }
		    });
		    return PrintTourInfoView;
} );