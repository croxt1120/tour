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
            this.$("#hotelTable tbody").empty();
            
            _.each(_.range(rowCount), function(day){
                _view.$("#hotelTable tbody").append(tpl({day:day+1}));
            });
        },
        
        setData : function(){
            var data = TourData.getData("hotels");
            
            var hotels = this.$(".hotel");
            if(data.length == hotels.length){
                _.each(hotels, function(hotel, i){
                    $(hotel).find(".name").val(data[i].name);
                    $(hotel).find(".phone").val(data[i].phone);
                });
            }
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