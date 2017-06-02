define([
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'custom/View',
	'common/TourData',
	'common/Utils',
	'text!views/contract/tpls/printContractTpl.html',
	'text!views/contract/tpls/printContentTpl.html'
], function(
	$,
	_,
	Backbone,
	moment,
	View,
	TourData,
	Utils,
	adminInfoTpl,
	printContentTpl
) {

	var PrintContractView = View.extend({
		initialize: function() {
		    moment.locale("ko");
			this.render();
		},
		events: {
			"click .btn-print": "onClickPrint",
			"change .contract" : "onChangeContract",
		},
		
		render: function() {
			$("body").append(adminInfoTpl);
			this.setElement($("#printContractView"));
			return this;
		},
		onClickPrint: function(evt) {
			// var $print = this.$('.print-tour');

			// $("#appView").hide();
			// $('#printArea').show().append($print);
			this.$(".yes-print").remove();
			// var _view = this;
			var contracts = this.$(".contract");
			_.each(contracts, function(v){
				// var id=$(v).attr("id");
				// if(id == "notice"){
				// 	var noticeArr = $(v).val().split("\n");
				// 	_.each(noticeArr, function(line){
				// 		var tr = $("<tr></tr").addClass("yes-print");
				// 		var td = $("<td style='font-weight:normal;border:1px solid #000000 !important;padding:4px;' colspan='5'></td>");
				// 		td.text(line);
						
				// 		tr.append(td);
				// 		console.log(_view.$("table tbody"));
				// 		_view.$("table").append(tr);
				// 	});
				// } else {
					var td = $(v).parents("td").eq(0);
					td.append("<div class='yes-print'>"+$(v).val().replace(/\n/g, '<br>')+"</div>");	
				// }
			});
			window.print();
		},
		
		onChangeContract : function(){
			var contracts = this.$(".contract");
			var data = {};
			_.each(contracts, function(v){
				v= $(v);
				var id = v.attr("id");
				var val = v.val();
				data[id] = val;
			});
			TourData.setData("contract", data);
			
			console.log(data);
		},
		getData: function() {
			
		},

		setData: function() {
			var data = TourData.getData();
			
			this.$(".content").empty();
			var printData = {
			    title : data.info.title,
			    member : "",
			    due : Utils.getPrintDateRange(moment(data.date.start, "YYYY-MM-DD") , moment(data.date.end, "YYYY-MM-DD")), 
			    
			    hotels : "",
			    totalPrice : "총 상품가 " + Utils.numberWithCommas(data.price.deposit + data.price.balance) + "원",
			    airline : "",
			    deposit : Utils.numberWithCommas(data.price.deposit) + "원",
			    balance : Utils.numberWithCommas(data.price.balance) + "원",
			    specialty : data.info.specialty.replace(/\n/g, '<br>'),
			    exclusion : data.info.exclusion.replace(/\n/g, '<br>'),
			    inclusion : data.info.inclusion.replace(/\n/g, '<br>'),
			    domestic : data.info.domestic,
			    exchangeRate : {
			    	EUR : Utils.numberWithCommas(data.price.exchangeRate.EUR),
			    	USD : Utils.numberWithCommas(data.price.exchangeRate.USD)
			    },
			};
			
			if(data.member.adult != 0){
			    printData.member += "성인 " + data.member.adult + "명 ";
			}
			if(data.member.child != 0){
			    printData.member += "아동 " + data.member.child + "명 ";
			}
			if(data.member.baby != 0){
			    printData.member += "유아 " + data.member.baby + "명 ";
			}
			
			var hotels = [];
			var prev, start=0, end=0;
			for(var i=0; i<data.hotels.length; i++){
				var hotelName = data.hotels[i].name.trim();
				
				if(hotelName != ""){
					if(i==0){
						prev = hotelName;
					}
					if(prev == hotelName){
						end = i;
					}else{
						hotels.push({ name : prev, start : start, end : end });
						start = end = i;
						prev = hotelName;	
					}
				}
				
				if(i == data.hotels.length - 1){
					hotels.push({ name : prev, start : start, end : end });
				}
			}
			
			var startDate = moment(data.date.start, "YYYY-MM-DD");
			
			_.each(hotels, function(v){
				var start = moment(startDate).add(v.start, 'days');
				var end = moment(startDate).add(v.end, 'days');
				var name = v.name;
				console.log(start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"), name);
				var text = Utils.getPrintDateRange(start,end);
				text += " (" + (v.end - v.start + 1) + "박) : ";
				text += name;
				
				printData.hotels += text + "<br>";
			});
			
			
			
			var firstAirline = _.first(data.airlines);
			printData.airline += moment(firstAirline.date1, "YYYY-MM-DD").format('YYYY년 MM월 DD일 (ddd)') + " " +firstAirline.time1 + " " + firstAirline.locale1 + " / " +
			moment(firstAirline.date2, "YYYY-MM-DD").format('YYYY년 MM월 DD일 (dddd)') + " " +firstAirline.time2 + " " + firstAirline.locale2 + "<br>";
			
			var lastAirline = _.last(data.airlines);
			printData.airline += moment(lastAirline.date1, "YYYY-MM-DD").format('YYYY년 MM월 DD일 (ddd)') + " " +lastAirline.time1 + " " + lastAirline.locale1 + " / " +
			moment(lastAirline.date2, "YYYY-MM-DD").format('YYYY년 MM월 DD일 (dddd)') + " " +lastAirline.time2 + " " + lastAirline.locale2 + "<br>";
			
			var tpl = _.template(printContentTpl);
			this.$(".content").append(tpl(printData));
			
			var _view = this;
			_.each(data.contract, function(v,k){
				_view.$("#"+k).val(v);
			});
		}
	});

	return PrintContractView;
});