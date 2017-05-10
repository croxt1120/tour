define([
    "jquery",
    "underscore",
    "backbone",
    "moment",
    "common/TourData",
    "common/Utils",
    "text!views/tour/meal/mealTpl.html",
    "text!views/tour/meal/mealRowTpl.html"
], function(
    $,
    _,
    Backbone,
    moment,
    TourData,
    Utils,
    mealTpl,
    mealRowTpl
) {
    var MealView = Backbone.View.extend({
        initialize: function() {
            this.render();
            this.listenTo(TourData, "change:date", this._onChangeDate);
            this.listenTo(TourData, "change:all", this._onChangeDate);
        },
        
        render : function(){
            this.$el.append(mealTpl);
            this._addRow(1);
        },
        
        events : {
            "change #meal .price" : "_onChangePrice",
            "change #meal .name" : "_onChangeName",
        },
        
        _onChangeDate : function(){
            var date = TourData.getData("date");
            var days = moment(date.end).diff( moment(date.start), 'days') + 1;
            this._addRow(days);
        },
        
        _onChangeName : function(evt){
            this.getData();
        },
        
        _onChangePrice : function(evt){
            var target = $(evt.target);
            if(target.val() == ""){
                target.val(0);
            }
            var tr = target.parents("tr");
            this._calculateDayTotal(tr);
            this._calculateTotal();
            this.getData();
        },
        
        _addRow : function(rowCount){
            var tpl = _.template(mealRowTpl);
            var _view = this;
            this.$("#mealTable tbody").empty();
            
            _.each(_.range(rowCount), function(day){
                var row = $(tpl({day:day+1}));
                _view.$("#mealTable tbody").append(_view._calculateDayTotal(row));
            });
            
            this._calculateTotal();
        },
        
        _calculateDayTotal : function(tr){
            var inputs = tr.find(".price");
            var sum = 0;
            _.each(inputs, function(input){
                sum += Utils.numberWithoutCommas($(input).val());
            });
            
            tr.find(".total").text(Utils.numberWithCommas(sum));
            
            return tr;
        },
        
        _calculateTotal : function(){
            var meals = this.$(".meal");
            var sum = 0;
            _.each(meals, function(meal){
                sum += Utils.numberWithoutCommas($(meal).find(".total").text());
            });
            
            this.$("#mealSum").text(Utils.numberWithCommas(sum));
        },
        
        getData : function(){
            var meals = this.$(".meal");
            var data = [];
            _.each(meals, function(mealRow){
                mealRow = $(mealRow);
                var meal = mealRow.find(".name");
                var price = mealRow.find(".price");
                var dayData = [];
                
                for(var i=0; i<3; i++){
                    dayData.push({
                        name : meal.eq(i).val(),
                        price : Utils.numberWithoutCommas(price.eq(i).val())
                    });    
                }
                data.push(dayData);
            });
            
            TourData.setData("meals", data);
        },
        
        setData : function(){
            var data = TourData.getData("meals");
            
            var _view = this;
            var meals = this.$(".meal");
            
            if(data.length == meals.length){
                _.each(meals, function(mealRow, idx){
                    var dayData = data[idx];
                    var meal = $(mealRow).find(".name");
                    var price = $(mealRow).find(".price");
                    
                    for(var i=0; i<3; i++){
                        meal.eq(i).val(dayData[i].name);
                        price.eq(i).val(dayData[i].price).trigger("change");    
                    }
                    
                    _view._calculateDayTotal($(mealRow));
                });
                
                this._calculateTotal();
            }
        }
    });
    
    return MealView;
});