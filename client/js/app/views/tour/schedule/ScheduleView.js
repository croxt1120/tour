define([
    "jquery",
    "jquery_ui_widget",
    "jquery_iframe_transport",
    "jquery_fileupload",
    "underscore",
    "backbone",
    "select2",
    "moment",
    "common/TourData",
    "common/Utils",
    "text!views/tour/schedule/galleryTpl.html",
    "text!views/tour/schedule/scheduleTpl.html",
    "text!views/tour/schedule/scheduleRowTpl.html",
    "text!views/tour/schedule/scheduleDayRowTpl.html"
], function(
    $,
    jquery_ui_widget,
    jquery_iframe_transport,
    jquery_fileupload,
    _,
    Backbone,
    select2,
    moment,
    TourData,
    Utils,
    galleryTpl,
    mealTpl,
    mealRowTpl,
    scheduleDayRowTpl
) {
    var ScheduleView = Backbone.View.extend({
        initialize: function() {
            this.render();
            this.files = [];
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
            "click .thumbnail.img" : "_removeGallery",
            "change #scheduleTable input" : "_changeInput",
            "change #scheduleTable select" : "_changeInput",
        },
        
        _addRow : function(rowCount){
            var tpl = _.template(mealRowTpl);
            var _view = this;
            
            var trs = this.$("#scheduleTable > tbody > .scheduleRow");
            
            var len = trs.length;
            rowCount -= len;
            
            if(rowCount > 0){
                _.each(_.range(rowCount), function(day){
                    var dayRow = $(tpl({day : len + day + 1}));
                    _view._onClickButtonAdd({target : dayRow.find(".scheduleDayTable")});
                    _view.$("#scheduleTable").append(dayRow);
                    
                    dayRow.find('#fileupload').fileupload({
                        dataType: 'json',
                        disableImageResize: false,
                        imageMaxWidth: 900,
                        imageMaxHeight: 600,
                        imageCrop: true, // Force cropped images,
                        add: function(e, data) {
                            var tr= $(e.target).parents(".scheduleRow");
                            
                            var uploadFile = data.files[0];
                            if (!(/png|jpe?g|gif/i).test(uploadFile.name)) {
                                alert('png, jpg, gif 만 가능합니다');
                                return;
                            }
        
                            if (uploadFile) {
                                _view.addGallery(data.files, tr);
                            }
                            
                        },
                        fail: function(e, data) {
                            alert('서버와 통신 중 문제가 발생했습니다');
                        }
                    });
                    _view.files.push([]);
                });   
            }else{
                for(var i=0; i > rowCount; i--){
                    var imageRow = this.$("#scheduleTable .imageRow");
                    var scheduleRow = this.$("#scheduleTable .scheduleRow");
                    $(_.last(imageRow)).remove();
                    $(_.last(scheduleRow)).remove();
                }
            }
            
            var startDate = moment(TourData.getData("date").start, "YYYY-MM-DD");
            var date = this.$(".scheduleRow .date");
            
            _.each(date, function(el, i){
                $(el).text(startDate.format("MM/DD(ddd)"));
                startDate = startDate.add("1", "days");
            });
        },
        
        addGallery: function(files, scheduleRow) {
            var index = scheduleRow.index() / 2;
            var target = this.$(".imageRow").eq(index);
            
            if (_.isArray(files)) {
                _.each(files,function(file){
                    var reader = new FileReader();  
                    reader.onload = function(e) {
                        var gallery = $(galleryTpl);
                        var img = $("<img/>")[0];
                        img.onload = function(){
                            var canvas = gallery.find("canvas")[0];
                            var ctx = canvas.getContext("2d");
                            ctx.drawImage(img, 0, 0);
                            
                            var MAX_WIDTH = gallery.width();
                            var MAX_HEIGHT = gallery.height();
                            var width = MAX_WIDTH;
                            var height = MAX_HEIGHT;
                            
                            if (width > height) {
                              if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                              }
                            } else {
                              if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                              }
                            }
                            
                            canvas.width = width;
                            canvas.height = height;
                            canvas.getContext("2d").drawImage(img, 0, 0, width, height);
                            
                            canvas.toDataURL("image/png");
                        };
                        
                        img.src = e.target.result;
                        target.find("td").append(gallery);
                    };
                    
                    reader.readAsDataURL(file);
                    
                    
                });
                
                this.files[index] = this.files[index].concat(files);
                TourData.setData("files", this.files);
            }
        },
        
        _removeGallery : function(e){
            var img = $(e.currentTarget);
            var imgIndex = img.index();
            var trIndex = (img.parents("tr").index() - 1 ) / 2;
            console.log(TourData.getData("files"));
            console.log(TourData.getData("url"));
        },
        
        _onChangeDate : function(){
            var date = TourData.getData("date");
            var days = moment(date.end).diff( moment(date.start), 'days') + 1;
            this.files = [];
            for(var i=0; i<days; i++){
                this.files.push([]);
            }
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
                if(target.hasClass("btn-type-air")){
                    target.removeClass("btn-type-air");
                    target.find("span").removeClass("glyphicon-plane").addClass("glyphicon-chevron-right");
                    tr.find(".place").remove();
                    tr.find(".price").removeAttr("readonly");
                    inputGroup.append('<input class="place form-control" type="text" placeholder="장소">');    
                }
            }else{
                if(target.hasClass("btn-type-air") == false){
                    target.addClass("btn-type-air");
                    target.find("span").removeClass("glyphicon-chevron-right").addClass("glyphicon-plane");
                    tr.find(".place").remove();
                    tr.find(".price").attr("readonly", true);
                    inputGroup.append('<select class="form-control place">');
                }
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
                
                var trs = day.find("tr");
                var len = trs.length;
                
                if(daySchedule.length - len > 0){
                    for(var j=0; j<daySchedule.length-len; j++){
                        _view._onClickButtonAdd({target : day});
                    }
                }else{
                    for(var k=0; k<daySchedule.length-len; k--){
                        trs = day.find("tr");
                        $(_.last(trs)).remove();
                    }
                }
                
                trs = day.find("tr");
                _.each(daySchedule, function(data, idx){
                    var tr = $(trs[idx]);
                    _view._setScheduleType(data.type, tr);
                    $(tr).find(".place").val(data.place);
                    $(tr).find(".price").val(data.price).trigger("change");
                });
            }
                
            var urls = TourData.getData("url");
            
            this.$(".thumbnail.img").remove();
            _.each(urls, function(urlArr,idx) {
                var target = _view.$(".imageRow").eq(idx);
                _.each(urlArr, function(url){
                    var gallery = $(galleryTpl);
                    var img = $("<img>")[0];
                    img.onload = function(){
                        var canvas = gallery.find("canvas")[0];
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        
                        var MAX_WIDTH = gallery.width();
                        var MAX_HEIGHT = gallery.height();
                        var width = MAX_WIDTH;
                        var height = MAX_HEIGHT;
                        
                        if (width > height) {
                          if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                          }
                        } else {
                          if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                          }
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
                        
                        canvas.toDataURL("image/png");
                    };
                    
                    img.src = "/image/thumbnail/"+url;
                    target.find("td").append(gallery);
                });
                
            });
            
            this.getData();
        },
        
        
    });
    
    return ScheduleView;
});