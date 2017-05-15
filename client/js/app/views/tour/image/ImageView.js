define([
    "jquery",
    "jquery_ui_widget",
    "jquery_iframe_transport",
    "jquery_fileupload",
    "underscore",
    "backbone",
    "moment",
    "common/TourData",
    "text!views/tour/image/imageTpl.html",
    "text!views/tour/image/galleryTpl.html",
    "text!views/tour/image/imageRow.html",
], function(
    $,
    jquery_ui_widget,
    jquery_iframe_transport,
    jquery_fileupload,
    _,
    Backbone,
    moment,
    TourData,
    imageTpl,
    galleryTpl,
    imageRowTpl
) {
    var ImageView = Backbone.View.extend({
        initialize: function() {
            this.render();
            this.files = [];
            this.listenTo(TourData, "change:date", this._onChangeDate);
        },
        
        _onChangeDate : function(){
            var date = TourData.getData("date");
            var days = moment(date.end).diff( moment(date.start), 'days') + 1;
            this.files = [];
            this.addRow(days);
        },
        
        addRow : function(rowCount){
            var tpl = _.template(imageRowTpl);
            var _view = this;
            this.$("#imageTable tbody").empty();
            _.each(_.range(rowCount), function(day){
                var row = $(tpl({day:day+1}));
                _view.$("#imageTable tbody").append(row);
                row.find('#fileupload').fileupload({
                    dataType: 'json',
                    disableImageResize: false,
                    imageMaxWidth: 900,
                    imageMaxHeight: 600,
                    imageCrop: true, // Force cropped images,
                    add: function(e, data) {
                        var index= $(e.target).parents("tr").index();
                        
                        var uploadFile = data.files[0];
                        if (!(/png|jpe?g|gif/i).test(uploadFile.name)) {
                            alert('png, jpg, gif 만 가능합니다');
                            return;
                        }
    
                        if (uploadFile) {
                            _view.addGallery(data.files, index);
                        }
                        
                    },
                    fail: function(e, data) {
                        alert('서버와 통신 중 문제가 발생했습니다');
                    }
                });
                _view.files.push([]);
            });
        },
        
        addGallery: function(files, index) {
            var target = this.$("#imageTable").find("tr").eq(index);
            
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

        render: function() {
            this.$el.append(imageTpl);
        },

        events: {
            
        },
        
        setData: function() {
            var urls = TourData.getData("url");
            
            this.$(".thumbnail.img").remove();
            var _view = this;
            _.each(urls, function(urlArr,idx) {
                var target = _view.$("#imageTable").find("tr").eq(idx);
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
                        
                        console.log("MAX", MAX_WIDTH, MAX_HEIGHT);
                        
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
                        
                        console.log("RESULT", width, height);
                        canvas.width = width;
                        canvas.height = height;
                        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
                        
                        canvas.toDataURL("image/png");
                    };
                    
                    img.src = "/image/thumbnail/"+url;
                    target.find("td").append(gallery);
                });
                
            });
        }
    });

    return ImageView;
});