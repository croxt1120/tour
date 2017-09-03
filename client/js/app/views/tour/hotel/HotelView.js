define([
    "jquery",
    "underscore",
    "backbone",
    "moment",
    "common/TourData",
    "text!views/tour/hotel/hotelTpl.html",
    "text!views/tour/hotel/hotelRowTpl.html"
], function(
    $,
    _,
    Backbone,
    moment,
    TourData,
    mealTpl,
    mealRowTpl
) {
    var HotelView = Backbone.View.extend({
        initialize: function() {
            this.render();
            this.listenTo(TourData, "change:date", this._onChangeDate);
            this.listenTo(TourData, "change:all", this._onChangeDate);
        },
        
        events : {
            "change #hotel input" : "_onChangeInput"
        },
        render : function(){
            this.$el.append(mealTpl);
            this.addRow(1);
        },
        _onChangeDate : function(){
            var date = TourData.getData("date");
            var days = moment(date.end).diff( moment(date.start), 'days') + 1;
            this.addRow(days);
        },
        _onChangeInput : function(){
            this.getData();
        },
        
        addRow : function(rowCount){
            var tpl = _.template(mealRowTpl);
            var _view = this;
            
            var trs = this.$("#hotelTable tbody tr");
            
            var len = trs.length;
            rowCount -= len;
            
            if(rowCount > 0){
                _.each(_.range(rowCount), function(day){
                    _view.$("#hotelTable tbody").append(tpl({day:len+day+1}));
                });    
            }else{
                for(var i=0; i > rowCount; i--){
                    trs = this.$("#hotelTable tbody tr");
                    $(_.last(trs)).remove();
                }
            }
            
            var startDate = moment(TourData.getData("date").start, "YYYY-MM-DD");
            var date = this.$(".hotel .date");
            
            _.each(date, function(el, i){
                $(el).text(startDate.format("MM/DD(ddd)"));
                startDate = startDate.add("1", "days");
            });
        },
        
        setData : function(){
            var data = TourData.getData("hotels");
            
            var hotels = this.$(".hotel");
            // if(data.length == hotels.length){
                _.each(data, function(hotel, i){
                    $(hotels[i]).find(".name").val(hotel.name);
                    $(hotels[i]).find(".phone").val(hotel.phone);
                });
            // }
        },
        
        getData : function(){
            var hotels = this.$(".hotel");
            var data = [];
            
            _.each(hotels, function(hotel){
                hotel = $(hotel);
                data.push({
                    name : hotel.find(".name").val(),
                    phone : hotel.find(".phone").val(),
                });
            });
            
            TourData.setData("hotels", data);
        }
    });
    
    return HotelView;
});