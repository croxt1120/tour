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
        },
        
        events: {
            "click .add-airline": "_onClickAddAirplane",
            "click .remove-airline": "_onClickRemoveAirplane",
            "changeDate .date" : "_onChangeDate",
            "change .info" : "_onChangeInfo",
            "change .member" : "_onChangeMember",
            "change .airline input" : "_onChangeAirLine"
        },
        
        render : function(){
            this.$el.append(infoTpl);
            
            this._addAirplane("귀국");
            this._addAirplane("출국");
            
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
            this._addAirplane();
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
                if(_isValidDate(start, end)){
                    var data = {
                        start : start.format("YYYY-MM-DD"),
                        end : end.format("YYYY-MM-DD")
                    };
                    
                    this.getData("date", data);
                }else{
                    alert("여행 개시일은 여행 마감일 이전 날짜로 설정 할 수 없습니다.");
    				this.$("#end").datepicker("setDate",start.toDate());
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
                    airlineData[id] = value;
                });
                data.push(airlineData);
            });
            
            TourData.setData("airlines", data);
        },
        
        _addAirplane : function(name, target){
            var rowTemplate = _.template(airlineTpl);
            if(_.isUndefined(name)){
                name = null;
            }
            
            if(this.$(".airline").length == 0){
                this.$("#airlineRow").append(rowTemplate({name : name}));
            }else{
                var lastAirline = _.last(this.$(".airline"));
                $(rowTemplate({name : name})).insertBefore($(lastAirline));
            }
        },
        
        getData : function(key, data){
            if(key != "date"){
                data = {};
                var inputs = this.$("."+key);
                _.each(inputs, function(input){
                    input = $(input);
                    var id = input.attr("id");
                    var value = input.val();
                    if(input.hasClass("price")){
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
                _view.$("#"+k).val(v);
            });
            
            _.each(data.member, function(v,k){
                _view.$("#"+k).val(v);
            });
            
            this.$("#end").datepicker("clearDates");
            this.$("#start").datepicker("clearDates");
            
            _.each(data.date, function(v,k){
                _view.$("#"+k).datepicker("setDate", v);
            });
            
            var airlines = data.airlines;
            this.$("#airlineRow").empty();
            
            this._addAirplane("귀국");
            this._addAirplane("출국");
            for(var i=0; i < airlines.length - 2; i++){
                this._addAirplane();
            }
            var airlinesEl = this.$(".airline");
            for(var j=0; j < airlines.length; j++){
                _.each(airlines[j], function(v,k){
                    airlinesEl.eq(j).find("#"+k).val(v);
                });
            }
        },
        
    });
    return InfoView;
})