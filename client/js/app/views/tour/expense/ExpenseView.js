define([
    "jquery",
    "underscore",
    "backbone",
    "select2",
    "common/TourData",
    "common/Utils",
    "text!views/tour/expense/expenseTpl.html",
    "text!views/tour/expense/landTpl.html",
], function(
    $,
    _,
    Backbone,
    select,
    TourData,
    Utils,
    expenseTpl,
    landTpl
) {
    var SelectData = [
        {id: "KRW", text: "KRW" },
        {id: "USD", text: "USD" },
        {id: "EUR", text: "EUR" }
    ];
    
    var ExpenseView = Backbone.View.extend({
        initialize : function(){
            this.render();
            this.listenTo(TourData, "change:member", this._calculateAll);
            var _view =this;
            $("#extraCharge").on("change", function(){
                _view._calculateTotalResult();
                _view.getData();
            });
        },
        
        events: {
            "click .add-land": "_onClickAddButton",
            "click .remove-land": "_onClickRemoveButton",
            
            "change .exchange" : "_onChangeExchangeRate",
            "change select" : "_onChangeExchangeRateSelect",
            "change .airfare .price" : "_onChangeAirefare",
            "change .airfare .summary" : "_onChangeSummary",
            "change .hotel .price" : "_onChangeHotelPrice",
            "change .tour .price" : "_onChangeTourPrice",
            "change .result .revenue" : "_onChangeResultRow",
            "change .result .deposit" : "_onChangeDeposit"
        },
        
        render : function(){
            this.$el.append(expenseTpl);
            
            this.$("select").select2({
                data: SelectData              
            });
            
            return this;
        },
        
        _onClickAddButton : function(evt){
            var target = $(evt.target);
            var isHotel = target.parents("tr").hasClass("hotel");
            
            var className;
            if(isHotel == true){
                className = "hotel";
            }else{
                className = "tour";
            }
            
            this._addLandRow(className);
        },
        _addLandRow : function(className){
            var rowspanEl = $(_.first(this.$(".hotel"))).find("th").eq(0);
            var rowspan = rowspanEl.attr("rowspan") * 1;
            rowspanEl.attr("rowspan", rowspan + 1);
            
            $(landTpl).addClass(className)
                .insertBefore(this.$("."+className+".total"))
                .find("select")
                    .select2({
                        data : SelectData
                    });
        },
        
        _onClickRemoveButton : function(evt){
            var target = $(evt.target);
            var targetTr = target.parents("tr");
            
            targetTr.remove();
            
            var rowspanEl = $(_.first(this.$(".hotel"))).find("th").eq(0);
            var rowspan = rowspanEl.attr("rowspan") * 1;
            rowspanEl.attr("rowspan", rowspan - 1);
        },
        
        _onChangeExchangeRate : function(evt){
            this._calculateAll();
        },
        
        _onChangeExchangeRateSelect : function(evt){
            $(evt.target).parents("tr").find(".price").trigger("change");
        },
        
        _onChangeAirefare : function(evt){
            var tr = $(evt.target).parents("tr");
            
            this._calculateAirfareRow(tr);
            this._calculateTotalPrice();
        },
        
        _onChangeSummary : function(evt){
            this.getData();  
        },
        
        _onChangeHotelPrice : function(evt){
            var tr = $(evt.target).parents("tr");

            this._calculateHotelRow(tr);
            this._calculateTotalPrice();
        },
        
        _onChangeTourPrice : function(evt){
            var tr = $(evt.target).parents("tr");

            this._calculateTourRow(tr);
            this._calculateTotalPrice();
        },
        
        _onChangeResultRow : function(evt){
            var tr = $(evt.target).parents("tr");
            this._calculateResultRow(tr);
            this.getData();
        },
        
        _onChangeDeposit : function(evt){
            this._calculateTotalResult();
            this.getData();
        },
        
        _calculateAirfareRow : function(tr){
            var key = tr.attr("class").replace("airfare ", "");
            
            var member = TourData.getData("member");
            var exchangeRate = tr.find("select").val();
            
            var price = Utils.numberWithoutCommas(tr.find(".price").val());
            
            if(price == ""){
                price = 0;
            }
            if(exchangeRate != "KRW"){
                price *= Utils.numberWithoutCommas(this.$("#"+ exchangeRate).val());
            }
            
            tr.find(".person").text(Utils.numberWithCommas(price));
            tr.find(".people").text(Utils.numberWithCommas(parseInt(member[key],10) * price));
        },
        
        _calculateHotelRow : function(tr){
            var member = TourData.getData("member");
            var totalMember = 0;
            _.each(member, function(v,k){
                totalMember += v*1;
            });
            
            var exchangeRate = tr.find("select").val();
            
            var price = Utils.numberWithoutCommas(tr.find(".price").val());
            
            if(price == ""){
                price = 0;
            }
            if(exchangeRate != "KRW"){
                price *= Utils.numberWithoutCommas(this.$("#"+ exchangeRate).val());
            }
            
            if(totalMember == 0){
                tr.find(".person").text("0");
            }else{
                tr.find(".person").text(Utils.numberWithCommas(price/ totalMember));    
            }
            
            tr.find(".people").text(Utils.numberWithCommas(price));
        },
        
        _calculateTourRow : function(tr){
            var member = TourData.getData("member");
            var totalMember = 0;
            _.each(member, function(v,k){
                totalMember += v*1;
            });
            
            var exchangeRate = tr.find("select").val();
            
            var price = Utils.numberWithoutCommas(tr.find(".price").val());
            
            if(price == ""){
                price = 0;
            }
            if(exchangeRate != "KRW"){
                price *= Utils.numberWithoutCommas(this.$("#"+ exchangeRate).val());
            }
            
            tr.find(".person").text(Utils.numberWithCommas(price));
            if(totalMember == 0){
                tr.find(".people").text("0");
            }else{
                tr.find(".people").text(Utils.numberWithCommas(price * totalMember));
            }
            
        },
        
        _calculateResultRow : function(tr){
            var className = tr.attr("class").replace("result ", "");
            var airfare = Utils.numberWithoutCommas(this.$(".airfare."+className).find(".person").text());
            var tour = Utils.numberWithoutCommas(this.$(".tour.total").find(".person").text());
            var hotel = Utils.numberWithoutCommas(this.$(".hotel.total").find(".person").text());
            var revenue = Utils.numberWithoutCommas(tr.find(".revenue").val());
            
            var value = airfare + tour + hotel;
            tr.find(".cost").text(Utils.numberWithCommas(value));
            
            value += revenue;
            tr.find(".person").text(Utils.numberWithCommas(value));
            var member = TourData.getData("member");
            
            tr.find(".people").text(Utils.numberWithCommas(value * member[className]));
            
            this._calculateTotalResult();
        },
        
        _calculateAll : function(){
            var _view = this;
            
            var airfares = this.$(".airfare");
            _.each(airfares, function(airfare){
                if(!$(airfare).hasClass("total")){
                    _view._calculateAirfareRow($(airfare));
                }
            });
            
            var hotels = this.$(".hotel");
            _.each(hotels, function(hotel){
                if(!$(hotel).hasClass("total")){
                    _view._calculateHotelRow($(hotel));
                }
            });
            
            var tours = this.$(".tour");
            _.each(tours, function(tour){
                if(!$(tour).hasClass("total")){
                    _view._calculateTourRow($(tour));
                }
            });
            
            this._calculateTotalPrice();
        },
        
        _calculateTotalPrice : function(){
            var airfares = this.$(".airfare");
            var totalAirfare = 0;
            
            _.each(airfares, function(airfare){
                airfare = $(airfare);
                if(!airfare.hasClass("total")){
                    totalAirfare += Utils.numberWithoutCommas(airfare.find(".people").text()) * 1;
                }
            });
            
            this.$(".airfare.total").find(".people").text(Utils.numberWithCommas(totalAirfare));
            
            var hotels = this.$(".hotel");
            var totalHotel = 0;
            var totalHotelEach = 0;
            _.each(hotels, function(hotel){
                hotel = $(hotel);
                if(!hotel.hasClass("total")){
                    totalHotel += Utils.numberWithoutCommas(hotel.find(".people").text()) * 1;
                    totalHotelEach += Utils.numberWithoutCommas(hotel.find(".person").text()) *1;
                }
            });
            
            this.$(".hotel.total").find(".people").text(Utils.numberWithCommas(totalHotel));
            this.$(".hotel.total").find(".person").text(Utils.numberWithCommas(totalHotelEach));
            
            var tours = this.$(".tour");
            var totalTour = 0;
            var totalTourEach = 0;
            _.each(tours, function(tour){
                tour = $(tour);
                if(!tour.hasClass("total")){
                    totalTour += Utils.numberWithoutCommas(tour.find(".people").text()) * 1;
                    totalTourEach += Utils.numberWithoutCommas(tour.find(".person").text()) *1;
                }
            });
            
            this.$(".tour.total").find(".people").text(Utils.numberWithCommas(totalTour));
            this.$(".tour.total").find(".person").text(Utils.numberWithCommas(totalTourEach));
            
            var _view = this;
            var results = this.$(".result");
            _.each(results, function(result){
                if(!$(result).hasClass("total")){
                    _view._calculateResultRow($(result));
                }
            });
            
            this._calculateTotalResult();
            this.getData();
        },
        
        _calculateTotalResult : function(){
            var total = 0;
            var results = this.$(".result");
            _.each(results, function(result){
                result = $(result);
                if(!result.hasClass("total")){
                    total += Utils.numberWithoutCommas(result.find(".people").text()) * 1;
                }
            });
            var deposit = Utils.numberWithoutCommas(this.$(".result.total").find(".deposit").val());
            var extraCharge = Utils.numberWithoutCommas(this.$("#extraCharge").val());
            this.$(".result.total").find(".balance").text(Utils.numberWithCommas(total - deposit + extraCharge));
        },
        
        getData : function(){
            var data = {
                exchangeRate : {
                    USD : Utils.numberWithoutCommas(this.$("#USD").val()) * 1,
                    EUR : Utils.numberWithoutCommas(this.$("#EUR").val()) * 1
                },
                
                airfare : {
                    adult : {
                        summary : "",
                        price : 0,
                        currency : "",
                        person : 0,
                        people : 0,
                    },
                    
                    child : {
                        summary : "",
                        price : 0,
                        currency : "",
                        person : 0,
                        people : 0,
                    },
                    
                    baby : {
                        summary : "",
                        price : 0,
                        currency : "",
                        person : 0,
                        people : 0,
                    },
                },
                
                hotel : [{
                    summary : "",
                    price : 0,
                    currency : "",
                    person : 0,
                    people : 0,
                }],
                
                tour : [{
                    summary : "",
                    price : 0,
                    currency : "",
                    person : 0,
                    people : 0,
                }],
                
                result : {
                    adult : {
                        revenue : 0,
                        person : 0,
                        people : 0,
                    },
                    
                    child : {
                        revenue : 0,
                        person : 0,
                        people : 0,
                    },
                    
                    baby : {
                        revenue : 0,
                        person : 0,
                        people : 0,
                    },
                },
                
                deposit : 0,
                balance : 0
            };
            
            _.each(this.$(".airfare"), function(airfare){
                airfare = $(airfare);
                if(airfare.hasClass("total")){
                    return;
                }
                var key = airfare.attr("class").replace("airfare ", "");
                data.airfare[key] = {
                    summary : airfare.find(".summary").val(),
                    price : Utils.numberWithoutCommas(airfare.find(".price").val()),
                    currency : airfare.find("select").val(),
                    person : Utils.numberWithoutCommas(airfare.find("td").last().prev().text()) * 1,
                    people : Utils.numberWithoutCommas(airfare.find("td").last().text()) * 1,
                };
            });
            
            var hotels = [];
            _.each(this.$(".hotel"), function(hotel){
                hotel = $(hotel);
                if(hotel.hasClass("total")){
                    return;
                }
                hotels.push({
                    summary : hotel.find(".summary").val(),
                    price : Utils.numberWithoutCommas(hotel.find(".price").val()),
                    currency : hotel.find("select").val(),
                    person : Utils.numberWithoutCommas(hotel.find("td").last().prev().text()) * 1,
                    people : Utils.numberWithoutCommas(hotel.find("td").last().text()) * 1,
                });
            });
            data.hotel = hotels;
            
            var tours = [];
            _.each(this.$(".tour"), function(tour){
                tour = $(tour);
                if(tour.hasClass("total")){
                    return;
                }
                tours.push({
                    summary : tour.find(".summary").val(),
                    price : Utils.numberWithoutCommas(tour.find(".price").val()),
                    currency : tour.find("select").val(),
                    person : Utils.numberWithoutCommas(tour.find("td").last().prev().text()),
                    people : Utils.numberWithoutCommas(tour.find("td").last().text()),
                });
            });
            data.tour = tours;
            
            _.each(this.$(".result"), function(result){
                result = $(result);
                if(result.hasClass("total")){
                    return;
                }
                var key = result.attr("class").replace("result ", "");
                data.result[key] = {
                    revenue : Utils.numberWithoutCommas(result.find(".revenue").val()),
                    person : Utils.numberWithoutCommas(result.find("td").last().prev().text()),
                    people : Utils.numberWithoutCommas(result.find("td").last().text()),
                };
            });
            data.deposit = Utils.numberWithoutCommas(this.$(".result .deposit").val());
            data.balance = Utils.numberWithoutCommas(this.$(".result .balance").text());
            
            TourData.setData("price", data);
        },
        
        setData:function(){
            var data = TourData.getData("price");
            
            // 환율
            this.$("#USD").val(data.exchangeRate.USD);
            this.$("#EUR").val(data.exchangeRate.EUR);
            
            // 항공료
            _.each(this.$(".airfare"), function(airfare){
                airfare = $(airfare);
                if(airfare.hasClass("total")){
                    return;
                }
                var key = airfare.attr("class").replace("airfare ", "");
                
                airfare.find(".summary").val(data.airfare[key].summary);
                airfare.find(".price").val(data.airfare[key].price);
                airfare.find("select").val(data.airfare[key].currency).trigger('change');
            });
            
            // 호텔
            _.each(this.$(".hotel"), function(hotel, i){
                hotel = $(hotel);
                if(!(hotel.hasClass("total") || i == 0)){
                    hotel.remove();
                    var rowspanEl = $(_.first(this.$(".hotel"))).find("th").eq(0);
                    var rowspan = rowspanEl.attr("rowspan") * 1;
                    rowspanEl.attr("rowspan", rowspan - 1);
                }
            });
            
            for(var i=0; i<data.hotel.length -1 ; i++){
                this._addLandRow("hotel");
            }
            
            _.each(this.$(".hotel"), function(hotel, i){
                hotel = $(hotel);
                if(hotel.hasClass("total")){
                    return;
                }
                hotel.find(".summary").val(data.hotel[i].summary);
                hotel.find(".price").val(data.hotel[i].price);
                hotel.find("select").val(data.hotel[i].currency).trigger('change');
            });
            
            // 투어
            _.each(this.$(".tour"), function(tour, i){
                tour = $(tour);
                if(!(tour.hasClass("total") || i == 0)){
                    tour.remove();
                    var rowspanEl = $(_.first(this.$(".hotel"))).find("th").eq(0);
                    var rowspan = rowspanEl.attr("rowspan") * 1;
                    rowspanEl.attr("rowspan", rowspan - 1);
                }
            });
            
            for(var j=0; j<data.tour.length -1 ; j++){
                this._addLandRow("tour");
            }
            
            _.each(this.$(".tour"), function(tour, i){
                tour = $(tour);
                if(tour.hasClass("total")){
                    return;
                }
                tour.find(".summary").val(data.tour[i].summary);
                tour.find(".price").val(data.tour[i].price);
                tour.find("select").val(data.tour[i].currency).trigger('change');
            });
            
            // 1인 이용료
            _.each(this.$(".result"), function(result){
                result = $(result);
                if(result.hasClass("total")){
                    return;
                }
                var key = result.attr("class").replace("result ", "");
                
                result.find(".revenue.price").val(data.result[key].revenue).trigger("change");
            });
            
            // 계약금
            this.$(".result .deposit").val(data.deposit).trigger("change");
            
            this._calculateAll();
        }
    });
    return ExpenseView;
})