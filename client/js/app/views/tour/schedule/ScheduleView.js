define([
    "jquery",
    "underscore",
    "backbone",
    "select2",
    "moment",
    "common/TourData",
    "common/Utils",
    "text!views/tour/schedule/scheduleTpl.html",
    "text!views/tour/schedule/scheduleRowTpl.html",
    "text!views/tour/schedule/scheduleDayRowTpl.html"
], function(
    $,
    _,
    Backbone,
    select2,
    moment,
    TourData,
    Utils,
    mealTpl,
    mealRowTpl,
    scheduleDayRowTpl
) {
    var ScheduleView = Backbone.View.extend({
        initialize: function() {
            this.render();
            this.listenTo(TourData, "change:date", this._onChangeDate);
            this.listenTo(TourData, "change:all", this._onLoadChangeDate);
        },
        
        render : function(){
            this.$el.append(mealTpl);
        },
        
        events : {
            "click .schedule-button" : "_onClickScheduleButton",
            "click .btn-add" : "_onClickButtonAdd",
            "click .btn-remove" : "_onClickButtonRemove",
            "change #scheduleTable input" : "_changeInput",
            "change #scheduleTable select" : "_changeInput",
        },
        
        _addRow : function(rowCount){
            var tpl = _.template(mealRowTpl);
            var _view = this;
            this.$("#scheduleTable > tbody").empty();
            
            _.each(_.range(rowCount), function(day){
                var dayRow = $(tpl({day : day + 1}));
                _view._onClickButtonAdd({target : dayRow.find(".scheduleDayTable")});
                _view.$("#scheduleTable > tbody").append(dayRow);
            });
        },
        
        _onChangeDate : function(){
            var date = TourData.getData("date");
            var days = moment(date.end).diff( moment(date.start), 'days') + 1;
            this._addRow(days);
        },
        
        _onLoadChangeDate : function(){
            var date = TourData.getData("date");
            var days = moment(date.end).diff( moment(date.start), 'days') + 1;
            this._addRow(days);
        },
        
        _onClickScheduleButton : function(evt){
            var target = $(evt.currentTarget);
            if(target.get(0).tagName.toLowerCase() != "button"){
                return;
            }
            var tr = target.parents("tr").eq(0);
            
            if(target.hasClass("btn-type-air")){
                tr.find(".place").select2('destroy');
                this._setScheduleType("place", tr);
            }else{
                this._setScheduleType("airline", tr);
            }
            this.getData();
            
        },
        
        _setScheduleType : function(type, tr){
            var target = tr.find("button").eq(0);
            var inputGroup = target.parents(".input-group");
            if(type == "place"){
                target.removeClass("btn-type-air");
                target.find("span").removeClass("glyphicon-plane").addClass("glyphicon-chevron-right");
                tr.find(".place").remove();
                tr.find(".price").removeAttr("readonly");
                inputGroup.append('<input class="place form-control" type="text" placeholder="장소">');
            }else{
                target.addClass("btn-type-air");
                target.find("span").removeClass("glyphicon-chevron-right").addClass("glyphicon-plane");
                tr.find(".place").remove();
                tr.find(".price").attr("readonly", true);
                inputGroup.append('<select class="form-control place">');
                
                var airlines = TourData.getData("airlines");
                
                var data = [];
                _.each(airlines, function(airline, k){
                    if(!(k == 0 || k == airlines.length - 1)){
                        data.push({
                            id : k,
                            text : airline.airline + "-" + airline.flight
                        });
                    }
                });
                
                
                inputGroup.find(".place").select2({
                    id : "flight",
                    data : data,
                });
                
                tr.find(".price").val(0).trigger("change");
            }
        },
        _onClickButtonAdd : function(evt){
            var target = $(evt.target);
            var tr = target.parents("tr").eq(0);
            var table = tr.find("table");
            if(table.length != 0){
                table.append(scheduleDayRowTpl);    
            }else{
                tr.after(scheduleDayRowTpl);
            }
            
        },
        
        _onClickButtonRemove : function(evt){
            var target = $(evt.target);
            var table = target.parents(".scheduleDayTable");
            
            if(table.find("tr").length > 1){
                target.parents("tr").eq(0).remove();
                this.getData();
            }
        },
        
        _changeInput : function(){
            this.getData();
        },
        
        getData : function(){
            var tables = this.$(".scheduleDayTable");
            var data = [];
            var sum = 0;
            _.each(tables, function(table, index){
                var dayData = [];
                _.each($(table).find("tbody").find("tr"), function(tr){
                    var place = $(tr).find(".place").val();
                    dayData.push({
                        type : $(tr).find(".place").get(0).tagName.toLowerCase() == "select" ? "airline" : "place",
                        place : place, 
                    });
                });
                
                data.push(dayData);
            });
            
            this.$("#scheduleSum").text(Utils.numberWithCommas(sum));
            TourData.setData("schedules", data);
        },
        
        setData : function(){
            var data = TourData.getData("schedules");
            
            var _view = this;
            var daysTr = this.$(".scheduleDayTable");
            
            for(var i=0; i<data.length; i++){
                var daySchedule = data[i];
                var day = daysTr.eq(i);
                
                for(var j=1; j<daySchedule.length; j++){
                    _view._onClickButtonAdd({target : day});
                }
                var trs = day.find("tr");
                _.each(daySchedule, function(data, idx){
                    var tr = $(trs[idx]);
                    _view._setScheduleType(data.type, tr);
                    $(tr).find(".place").val(data.place);
                    $(tr).find(".price").val(data.price).trigger("change");
                });
            }
                
            
            this.getData();
        },
        
        
    });
    
    return ScheduleView;
});