define([
	'jquery',
	'underscore',
	'backbone',
	'html2canvas',
	'moment',
	'common/Utils',
	'common/TourData',
	'text!views/print/tpls/printViewTpl.html',
	'text!views/print/tpls/tourInfoTpl.html',
	'text!views/print/tpls/scheduleTpl.html'
	
], function(
	$,
	_,
	Backbone,
	Html2canvas,
	moment,
	Utils,
	TourData,
	printViewTpl,
	tourInfoTpl,
	scheduleTpl
) {
	var PrintView = Backbone.View.extend({
		initialize: function() {
			this.render();
			moment.locale("ko");
		},
		render: function() {
			var tpl = _.template(printViewTpl, {});

			$("body").append(tpl);

			this.setElement($("#printView"));
			return this;
		},
		events: {
			"click .btn-print": "onPrintClick"
		},
		
		_getScheduleData : function(){
			var airlines = TourData.getData("airlines");
			var meals = TourData.getData("meals");
			var hotels = TourData.getData("hotels");
			var schedules = TourData.getData("schedules");
			
			var date = TourData.getData("date");
			
			var changeBlank = function(text){
				return text == "" ? "-" : text;
			};
			
			var makeAirlineSchedule = function(airline){
				var schedules = [];					
				schedules.push({
					place : airline.locale1,
					transportation : airline.airline,
					time : moment(airline.time1, "HH:mm").subtract('hour', 1).format("HH:mm"),
					summary : airline.locale1 + " 공항 도작 및 수속(신분증 필수 지참)",
				});
				schedules.push({
					place : "",
					transportation : "("+airline.flight+")",
					time : airline.time1,
					summary : airline.locale1 + " 공항 출발",
				});
				schedules.push({
					place : airline.locale2,
					transportation : "",
					time : airline.time2,
					summary : airline.locale2 + " 공항 도착",
				});
				
				return schedules;
			};
			
			var days = moment(date.end).diff( moment(date.start), 'days');
			var scheduleData = [];
			for(var i=0; i<= days; i++){
				var item = {
					index : i + 1,
					date : moment(date.start).add("day", i).format ("MM월 DD일"),
					meals : [],
					hotel : {
						name : changeBlank(hotels[i].name),
						phone : changeBlank(hotels[i].phone),
					},
					schedules : []
				};
				
				var mealPrefix = ["조", "중", "석"];
				_.each(meals[i], function(meal, idx){
					var name = changeBlank(meal.name);
					item.meals.push(mealPrefix[idx] + " : " + name);
				});
				
				_.each(schedules[i], function(schedule, idx){
					if(schedule.type == "place"){
						item.schedules.push({
							place : "",
							transportation : "",
							time : "",
							summary : schedule.place,
						});
					}else{
						item.schedules = item.schedules.concat(makeAirlineSchedule(airlines[schedule.place]));
					}
				});
				scheduleData.push(item);
			}

			_.first(scheduleData).schedules = makeAirlineSchedule(_.first(airlines)).concat(_.first(scheduleData).schedules);
			_.last(scheduleData).schedules = _.last(scheduleData).schedules.concat(makeAirlineSchedule(_.last(airlines)));
			
			return scheduleData;
		},
		
		setData: function() {
			var data = TourData.getData();
			var convertData = {
				title : data.info.title,
				
				client : data.info.client,
				planner : data.info.planner,
				plannerInfo : data.info.planner,
				
				inclusion : data.info.inclusion,
				exclusion : data.info.exclusion,
				specialty : data.info.specialty,
				
				car : data.info.car,
				driver : data.info.driver,
				
				adult : {
					member : data.member.adult,
					person : Utils.numberWithCommas(data.price.result.adult.person),
					people : Utils.numberWithCommas(data.price.result.adult.people),
				},
				
				child : {
					member : data.member.child,
					person : Utils.numberWithCommas(data.price.result.child.person),
					people : Utils.numberWithCommas(data.price.result.child.people),
				},
				
				baby : {
					member : data.member.baby,
					person : Utils.numberWithCommas(data.price.result.baby.person),
					people : Utils.numberWithCommas(data.price.result.baby.people),
				},
				
				price : {
					total : Utils.numberWithCommas(data.price.deposit + data.price.balance),
					deposit : Utils.numberWithCommas(data.price.deposit),
					balance : Utils.numberWithCommas(data.price.balance),
					extraCharge : Utils.numberWithCommas(data.info.extraCharge),
					extraChargeInfo : data.info.extraChargeInfo
				},
				
				date : {
					start : moment(data.date.start).format('YYYY년 MM월 DD일 dddd'),
					end : moment(data.date.end).format('YYYY년 MM월 DD일 dddd'),
					due : moment(data.price.dueDate).format('YYYY년 MM월 DD일 dddd'),
				},
				
				admin : {
					depositor : data.admin.depositor,
					bankName : data.admin.bankName,
					accountNumber : data.admin.accountNumber,
					packagePrintMsg : data.admin.packagePrintMsg.replace(/\n/g, '<br>')
				}
			};
			
			var tpl = _.template(tourInfoTpl);
			this.$('.content').empty().append(tpl(convertData));
			
			var schedules = this._getScheduleData();
			
			var _view = this;
			var schedulesTpl = _.template(scheduleTpl);
			_.each(schedules, function(schedule){
				_view.$(".schedule-table").append(schedulesTpl(schedule));
			});
		},

		onPrintClick: function(evt) {
			var $print = this.$('.print-tour');

			$("#appView").hide();
			$('#printArea').show().append($print);

			window.print();
			$("#appView").show();
			this.$('.content').append($print);
		}
	});
	return PrintView;
});