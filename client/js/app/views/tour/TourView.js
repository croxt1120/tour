define([
    "jquery",
    "underscore",
    "backbone",
    "common/TourData",
    "views/tour/info/InfoView",
    "views/tour/expense/ExpenseView",
    "views/tour/meal/MealView",
    "views/tour/hotel/HotelView",
    "views/tour/schedule/ScheduleView",
    "text!views/tour/tourTpl.html"
], function(
    $,
    _,
    Backbone,
    TourData,
    InfoView,
    ExpenseView,
    MealView,
    HotelView,
    ScheduleView,
    tourTpl
) {
    var TourView = Backbone.View.extend({
        initialize: function() {
            this.render();
            this.listenTo(TourData, "change:all", this.setData);
        },

        render: function() {
            $("body").append(tourTpl);
            this.setElement($("#tourView"));
            
            this.views = {};
            
            this.views["info"]    = new InfoView({el : this.$("#tour-wide")});
            this.views["expense"] = new ExpenseView({el : this.$("#tour-wide")});
            
            this.views["meal"] = new MealView({el : this.$("#tour-narrow")});
            this.views["hotel"] = new HotelView({el : this.$("#tour-narrow")});
            this.views["schedule"] = new ScheduleView({el : this.$("#tour-narrow")});
        },

        events: {
            // "click .nav > li > a": "_onClickMenu"
        },
        
        setData : function(){
            _.each(this.views, function(v,k){
                if(_.isFunction(v.setData)){
                    v.setData();     
                }   
            });
        },
    });
    return TourView;
})