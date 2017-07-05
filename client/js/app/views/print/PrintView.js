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
				var schedules = [];
				var info =TourData.getData("info");
				var hour = 3;
				
				if(info.domestic == true){
					hour = 1;
				}
				
				var timeFormat = "HH:mm";
				var dateFormat = "YYYY-MM-DD HH:mm";
				var format = "YYYY-MM-DD";
				
				var timeIndex = 0;
				
				schedules.push([{
					place : airline.locale1 ,
					transportation : airline.airline + "-" + airline.flight,
					time : moment(airline.date1 + " " +airline.time1, dateFormat).subtract(hour, 'hour').format(timeFormat),
					summary : airline.locale1 + " 공항 도작 및 수속 ("+(info.domestic==true?"신분증":"여권")+" 필수 지참)",
				}, {
					place : "",
					transportation : "",
					time : moment(airline.date1 + " " +airline.time1, dateFormat).format(timeFormat),
					summary : airline.locale1 + " 공항 출발",
				}]);
				
				if( moment(airline.date2, format).diff(moment(airline.date1, format), "days") > 0){
					timeIndex += moment(airline.date2, format).diff(moment(airline.date1, format), "days");
					schedules[timeIndex] = [];
				}
				
				
				schedules[timeIndex].push({
					place : airline.locale2,
					transportation : "",
					time : moment(airline.date2 + " " +airline.time2, dateFormat).format(timeFormat),
					summary : airline.locale2 + " 공항 도착 (비행시간 : " +airline.flighttime + ")",
				});		
				
				console.log(schedules);
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
				
				item.schedules = prevSchedule.shift();
				if(_.isUndefined(item.schedules)){
					item.schedules = [];
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
						_.each(airlineSchedule, function(v, i){
							if(i==0){
								item.schedules = item.schedules.concat(v);		
							}else{
								if(_.isUndefined(prevSchedule[i-1])){
									prevSchedule[i-1] = [];
								}
								if(!_.isUndefined(v)){
									prevSchedule[i-1] = prevSchedule[i-1].concat(v);
								}
							}
						});
					}
				});
				scheduleData.push(item);
			}
			
			var first = makeAirlineSchedule(_.first(airlines));
			var last = makeAirlineSchedule(_.last(airlines));
			
			for(var i=0; i< first.length; i++){
				var v = first[i];
				if(!_.isUndefined(v)){
					scheduleData[i].schedules = v.concat(scheduleData[i].schedules);
				}
			}
			for(var j=0; j<last.length; j++){
				var v = last[j];
				var index = scheduleData.length - last.length + j;
				if(!_.isUndefined(v)){
					if(j == last.length - 1){
						scheduleData[index].schedules = v.concat(scheduleData[index].schedules);
					}else{
						scheduleData[index].schedules = scheduleData[index].schedules.concat(v);
					}
				}
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
				},
				
				host : window.location.protocol + "//" + window.location.host
			};
			
			var tpl = _.template(tourInfoTpl);
			this.$('.content').empty().append(tpl(convertData));
			
			var schedules = this._getScheduleData();
			
			var _view = this;
			var schedulesTpl = _.template(scheduleTpl);
			_.each(schedules, function(schedule){
				schedule["host"] = window.location.protocol + "//" + window.location.host;
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
			var data = {
				html : "",
				mail : this.$("#email").val(),
				title : this.$("#mailTitle").val()
			};
			
			var email = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
			if(email.test(data.mail) != true){
				alert("이메일 주소를 확인해주세요");
				return;
			}
			
			if($.trim(data.title) == ""){
				alert("메일 제목을 입력하세요");
				return;
			}
			
			var result = $("<div></div>");
			var html = this.$('.content').html();
			result.append(html);
			data.html = result.html();
			
			$.post("/mail", data, function(res) {
				if (res.isSuccess) {
					alert("메일을 전송했습니다.");
				}
				else {
					alert('메일 전송에 실패했습니다.');
				}

			}).fail(function(res) {
				alert('메일 전송에 실패했습니다.');
			}).always(function(res) {});
		}
	});
	return PrintView;
});