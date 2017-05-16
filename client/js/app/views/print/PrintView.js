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
	'text!views/print/tpls/scheduleTpl.html',
	'text!/../../css/print-tour.css',
	
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
	scheduleTpl,
	printStyle
) {
	var PrintView = Backbone.View.extend({
		initialize: function() {
			this.render();
			moment.locale("ko");
			this.listenTo(TourData, "change", this.setData);
		},
		render: function() {
			var tpl = _.template(printViewTpl, {});

			$("body").append(tpl);

			this.setElement($("#printView"));
			return this;
		},
		events: {
			"click .btn-print": "onClickPrint",
			"click .btn-email": "onClickSendEmail"
		},
		
		_getScheduleData : function(){
			var airlines = TourData.getData("airlines");
			var meals = TourData.getData("meals");
			var hotels = TourData.getData("hotels");
			var urls = TourData.getData("url");
			var schedules = TourData.getData("schedules");
			
			var date = TourData.getData("date");
			
			var changeBlank = function(text){
				return text == "" ? "-" : text;
			};
			
			var makeAirlineSchedule = function(airline){
				var schedules = [[],[]];
				var info =TourData.getData("info");
				var hour = 3;
				
				if(info.domestic == true){
					hour = 1;
				}
				
				var timeFormat = "HH:mm";
				var dateFormat = "YYYY-MM-DD HH:mm";
				var format = "YYYY-MM-DD";
				
				var timeIndex = 0;
				
				schedules[timeIndex].push({
					place : airline.locale1 ,
					transportation : airline.airline + "-" + airline.flight,
					time : moment(airline.date1 + " " +airline.time1, dateFormat).subtract(hour, 'hour').format(timeFormat),
					summary : airline.locale1 + " 공항 도작 및 수속 ("+(info.domestic==true?"신분증":"여권")+" 필수 지참)",
				});
				
				schedules[timeIndex].push({
					place : "",
					transportation : "",
					time : moment(airline.date1 + " " +airline.time1, dateFormat).format(timeFormat),
					summary : airline.locale1 + " 공항 출발",
				});	
					
				if(moment(airline.date1 + " " +airline.time1, dateFormat).format(format) 
					!= moment(airline.date2 + airline.time2, dateFormat).format(format)){
						
					timeIndex += 1;
				}
				
				schedules[timeIndex].push({
					place : airline.locale2,
					transportation : "",
					time : moment(airline.date2 + " " +airline.time2, dateFormat).format(timeFormat),
					summary : airline.locale2 + " 공항 도착 (비행시간 : " +airline.flighttime + ")",
				});		
				
				if(timeIndex != 0){
					return schedules;
				}else{
					return [schedules[0]];
				}
			};
			
			var days = moment(date.end).diff( moment(date.start), 'days');
			var scheduleData = [];
			var prevSchedule = [];
			for(var i=0; i<= days; i++){
				var item = {
					index : i + 1,
					date : moment(date.start).add(i, "day").format ("MM월 DD일"),
					meals : [],
					hotel : {
						name : changeBlank(hotels[i].name),
						phone : changeBlank(hotels[i].phone),
					},
					schedules : [],
					urls : _.isUndefined(urls[i])? [] : urls[i]
				};
				
				console.log(urls);
				if(prevSchedule.length > 0){
					item.schedules = prevSchedule;
					prevSchedule = [];
				}
				var mealPrefix = ["조", "중", "석"];
				_.each(meals[i], function(meal, idx){
					var name = changeBlank(meal.name);
					item.meals.push(mealPrefix[idx] + " : " + name);
				});
				
				_.each(schedules[i], function(schedule, idx){
					if(schedule.type == "place"){
						if(schedule.place != ""){
							item.schedules.push({
								place : "",
								transportation : "",
								time : "",
								summary : schedule.place,
							});
						}
					}else{
						var airlineSchedule = makeAirlineSchedule(airlines[schedule.place]);
						if(airlineSchedule.length == 1){
							item.schedules = item.schedules.concat(airlineSchedule[0]);	
						}else{
							item.schedules = item.schedules.concat(airlineSchedule[0]);	
							prevSchedule = prevSchedule.concat(airlineSchedule[1]);
						}
						
					}
				});
				scheduleData.push(item);
			}
			
			var first = makeAirlineSchedule(_.first(airlines));
			var last = makeAirlineSchedule(_.last(airlines));
			
			var len = scheduleData.length;
			if(first.length == 1){
				scheduleData[0].schedules = first[0].concat(_.first(scheduleData).schedules);	
			}else{
				scheduleData[0].schedules = first[0].concat(_.first(scheduleData).schedules);	
				scheduleData[1].schedules = first[1].concat(_.first(scheduleData).schedules);	
			}
			
			if(last.length == 1){
				scheduleData[len-1].schedules = _.last(scheduleData).schedules.concat(last[0]);
			}else{
				scheduleData[len-2].schedules = _.last(scheduleData).schedules.concat(last[0]);
				scheduleData[len-1].schedules = _.last(scheduleData).schedules.concat(last[1]);
			}
			
			return scheduleData;
		},
		
		setData: function() {
			var data = TourData.getData();
			var convertData = {
				title : data.info.title,
				
				airline : _.first(data.airlines).airline,
				client : data.info.client,
				planner : data.info.planner,
				plannerInfo : data.info.plannerInfo,
				
				inclusion : data.info.inclusion.replace(/\n/g, '<br>'),
				exclusion : data.info.exclusion.replace(/\n/g, '<br>'),
				specialty : data.info.specialty.replace(/\n/g, '<br>'),
				
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

		onClickPrint: function(evt) {
			var $print = this.$('.print-tour');

			$("#appView").hide();
			$('#printArea').show().append($print);

			window.print();
			$("#appView").show();
			this.$('.content').append($print);
		},
		
		onClickSendEmail : function(evt){
			var result = $("<div></div>");
			var style = $("<style></style>").text(printStyle);
			var html = this.$('.content').html();
			
			result.append(style);
			result.append(html);
			
			$.post("/mail", {html : result.html()}, function(res) {
				if (res.isSuccess) {
					alert('데이터를 저장하였습니다.');
				}
				else {
					alert('데이터 저장에 실패 했습니다.');
				}

			}).fail(function(res) {
				alert('데이터 저장에 실패 했습니다.');
			}).always(function(res) {});
		}
	});
	return PrintView;
});