define([
    "jquery",
    "underscore",
    "backbone",
    'moment',
    'datepicker',
    'localekr',
    'common/Utils',
    'common/TourData',
    "text!views/tour/info/infoTpl.html",
    "text!views/tour/info/airlineTpl.html"
], function(
    $,
    _,
    Backbone,
    moment,
    datepicker,
    localekr,
    Utils,
    TourData,
    infoTpl,
    airlineTpl
) {
    var InfoView = Backbone.View.extend({
        initialize : function(){
            this.render();
            moment.locale('ko');
            
            // this.listenTo(TourData, "change:date", this._onChangeDateAirline);
        },
        
        events: {
            "click .add-airline": "_onClickAddAirplane",
            "click .remove-airline": "_onClickRemoveAirplane",
            "changeDate .date" : "_onChangeDate",
            "change .info" : "_onChangeInfo",
            "change .member" : "_onChangeMember",
            "change .airline .air" : "_onChangeAirLine",
            "change .airline .airDate" : "_onChangeAirLineDate",
        },
        
        render : function(){
            this.$el.append(infoTpl);
            
            var datepickerOption ={
             	autoclose: true,
             	format: 'yyyy년 mm월 dd일 DD',
             	language: 'kr',
            };
            
            this.$("#start").datepicker(datepickerOption);
            this.$("#end").datepicker(datepickerOption);
            
            return this;
        },
        
        _onClickAddAirplane : function(evt){
            var date = TourData.getData("date");
            this._addAirplane(undefined, date.start, date.start, false);
            this._onChangeAirLine();
        },
        
        _onClickRemoveAirplane : function(evt){
            $(evt.target).parents("table.airline").remove();
        },
        
        _onChangeDate : function(evt){
            var start = moment(this.$("#start").datepicker("getDate"));
            var end = moment(this.$("#end").datepicker("getDate"));
            
            var _isValidDate = function(startDate, endDate) {
    			var diff = moment(startDate).diff(endDate);
    			return (diff > 0)?false:true;
    		};
    		
            // 초기 설정시 end가 설정 안됬을때 제외
            if(end.isValid()){
                if(!_isValidDate(start, end)){
                    alert("여행 개시일은 여행 마감일 이전 날짜로 설정 할 수 없습니다.");
    				this.$("#end").datepicker("setDate",start.toDate());
    				end = start;
                }
                
                var data = {
                    start : start.format("YYYY-MM-DD"),
                    end : end.format("YYYY-MM-DD")
                };
                
                this.getData("date", data);
                
                var first = $(_.first(this.$(".airline")));
                if(first.find("#airline").val() == "" && first.find("#locale1").val() == "" && first.find("#locale2").val() == ""){
                    $(_.first(this.$(".airline #date1"))).datepicker("setDate", start.toDate());
                    $(_.first(this.$(".airline #date2"))).datepicker("setDate", start.toDate());
                }
                
                var last = $(_.last(this.$(".airline")));
                if(last.find("#airline").val() == "" && last.find("#locale1").val() == "" && last.find("#locale2").val() == ""){
                    $(_.last(this.$(".airline #date1"))).datepicker("setDate", end.toDate());
                    $(_.last(this.$(".airline #date2"))).datepicker("setDate", end.toDate());
                }
                
            }
        },
        
        _onChangeInfo : function(){
            this.getData("info");
        },
        
        _onChangeMember : function(){
            this.getData("member");
        },
        
        _onChangeAirLine : function(){
            var airlines = this.$(".airline");
            
            var data = [];
            _.each(airlines, function(airline){
                airline = $(airline);
                var inputs = airline.find("input");
                var airlineData = {};
                _.each(inputs, function(input){
                    input = $(input);
                    var id= input.attr("id");
                    var value = input.val();
                    
                    if(input.hasClass("date")){
                        value = moment(input.datepicker("getDate")).format("YYYY-MM-DD");
                    }else if(input.hasClass("time")){
                        if(value == ""){
                            value = "00:00";
                        }
                    }
                    airlineData[id] = value;
                });
                data.push(airlineData);
            });
            
            TourData.setData("airlines", data);
        },
        
        _addAirplane : function(name, date1, date2, row){
            var rowTemplate = _.template(airlineTpl);
            
            if(_.isUndefined(name)){
                name = null;
            }
            
            if(_.isNull(date1)){
                date1 = TourData.getData("date").start;
            }
            
            if(_.isNull(date2)){
                date2 = TourData.getData("date").start;
            }
            
            var tpl = $(rowTemplate({name : name}));
            
            tpl.find("#date1").datepicker({
             	autoclose: true,
             	format: 'yyyy-mm-dd',
             	language: 'kr',
            });
            
            tpl.find("#date1").datepicker("setDate", moment(date1, "YYYY-MM-DD").toDate());
            
            tpl.find("#date2").datepicker({
             	autoclose: true,
             	format: 'yyyy-mm-dd',
             	language: 'kr',
            });
            
            tpl.find("#date2").datepicker("setDate", moment(date2, "YYYY-MM-DD").toDate());
            
            if(row == true){
                this.$("#airlineRow").append(tpl);
            }else{
                var lastAirline = _.last(this.$(".airline"));
                tpl.insertBefore($(lastAirline));
            }
            
            return tpl;
        },
        
        getData : function(key, data){
            if(key != "date"){
                data = {};
                var inputs = this.$("."+key);
                _.each(inputs, function(input){
                    input = $(input);
                    var id = input.attr("id");
                    var value = input.val();
                    
                    if(id == "domestic"){
                        value = input.is(":checked");
                    }else if(input.hasClass("price")){
                        value = Utils.numberWithoutCommas(input.val());
                    }
                    data[id] = value;
                });
            }
            
            TourData.setData(key, data);
        },
        
        setData : function(){
            var _view = this;
            var data = TourData.getData();
            
            _.each(data.info, function(v,k){
                if(k == "domestic"){
                    _view.$("#"+k).attr("checked", v);   
                }else{
                    _view.$("#"+k).val(v);
                }
            });
            
            _.each(data.member, function(v,k){
                _view.$("#"+k).val(v);
            });
            
            var airlines = data.airlines;
            
            this.$("#airlineRow").empty();
            
            for(var j=0; j < airlines.length; j++){
                var name = undefined;
                
                if(j == 0){
                    name = "출국";
                }else if (j == airlines.length -1){
                    name = "귀국";
                }
                
                var airlinesEl = this._addAirplane(name, airlines[j].date1, airlines[j].date2, true);
                _.each(airlines[j], function(v,k){
                    if(k == "date1" || k == "date2"){
                        
                    }else{
                        airlinesEl.find("#"+k).val(v);
                    }
                    
                });
            }
            
            this.$("#end").datepicker("clearDates");
            this.$("#start").datepicker("clearDates");
            
            _.each(data.date, function(v,k){
                if(v == null){
                    v = moment().format("YYYY-MM-DD");
                }
                _view.$("#"+k).datepicker("setDate", v);
            });
        },
        
    });
    return InfoView;
})